const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const ORDER_STATUS = {
    PENDING:    'Pending',
    PROCESSING: 'Processing',
    SHIPPED:    'Shipped',
    DELIVERED:  'Delivered'
};

const PAYMENT_STATUS = {
    PENDING:   'Pending',
    COMPLETED: 'Completed',
    FAILED:    'Failed'
};

const VALID_TRANSITIONS = {
    [ORDER_STATUS.PENDING]:    [ORDER_STATUS.PROCESSING],
    [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.SHIPPED],
    [ORDER_STATUS.SHIPPED]:    [ORDER_STATUS.DELIVERED],
    [ORDER_STATUS.DELIVERED]:  []
};

exports.createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            discount,
            totalPrice
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'No order items'
            });
        }

        if (!shippingAddress) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Shipping address is required'
            });
        }

        for (let item of orderItems) {
            const product = await Product.findOneAndUpdate(
                {
                    _id: item.product,
                    countInStock: { $gte: item.quantity }
                },
                {
                    $inc: { countInStock: -item.quantity }
                },
                {
                    session,
                    new: true
                }
            );

            if (!product) {
                await session.abortTransaction();
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.name || 'product'}`
                });
            }
        }

        let order;
        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {
            const orderNumber = await Order.generateOrderNumber();

            try {
                order = await Order.create([{
                    orderNumber,
                    user: req.user.id,
                    orderItems,
                    shippingAddress,
                    payment: {
                        method: paymentMethod,
                        status: PAYMENT_STATUS.PENDING
                    },
                    pricing: {
                        itemsPrice,
                        taxPrice: taxPrice || 0,
                        shippingPrice: shippingPrice || 100,
                        discount: discount || 0,
                        totalPrice
                    },
                    orderStatus: ORDER_STATUS.PENDING
                }], { session });

                break;
            } catch (err) {
                if (err.code === 11000 && err.keyPattern && err.keyPattern.orderNumber) {
                    attempts++;
                    if (attempts >= maxAttempts) {
                        await session.abortTransaction();
                        return res.status(500).json({
                            success: false,
                            message: 'Could not generate unique order number. Please try again.'
                        });
                    }
                    continue;
                }
                throw err;
            }
        }

        await Cart.findOneAndUpdate(
            { user: req.user.id },
            { items: [] },
            { session }
        );

        await session.commitTransaction();

        const populatedOrder = await Order.findById(order[0]._id)
            .populate('orderItems.product', 'name slug images')
            .populate('user', 'name email phone')
            .lean();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: populatedOrder
        });

    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    } finally {
        session.endSession();
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const { status } = req.query;
        const page  = Math.max(1, parseInt(req.query.page,  10) || 1);
        const limit = Math.max(1, Math.min(parseInt(req.query.limit, 10) || 10, 100));

        let query = { user: req.user.id };
        if (status) query.orderStatus = status;

        const orders = await Order.find(query)
            .populate('orderItems.product', 'name slug images')
            .sort('-createdAt')
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();

        const count = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            count: orders.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('orderItems.product', 'name slug images brand')
            .lean();

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
};

exports.updateOrderToPaid = async (req, res) => {
    try {
        const { transactionId, provider, status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this order'
            });
        }

        if (order.payment.status === PAYMENT_STATUS.COMPLETED) {
            return res.status(400).json({
                success: false,
                message: 'Order has already been paid'
            });
        }

        order.payment.status = status === 'success'
            ? PAYMENT_STATUS.COMPLETED
            : PAYMENT_STATUS.FAILED;

        if (status === 'success') {
            order.payment.paidAt        = Date.now();
            order.payment.transactionId = transactionId;
            order.payment.provider      = provider;
            order.orderStatus           = ORDER_STATUS.PROCESSING;
        }

        const updatedOrder = await order.save();

        res.status(200).json({
            success: true,
            message: status === 'success' ? 'Payment confirmed' : 'Payment failed',
            data: updatedOrder
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating payment',
            error: error.message
        });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const { status, paymentStatus } = req.query;
        const page  = Math.max(1, parseInt(req.query.page,  10) || 1);
        const limit = Math.max(1, Math.min(parseInt(req.query.limit, 10) || 10, 100));

        let query = {};
        if (status) query.orderStatus = status;
        if (paymentStatus) query['payment.status'] = paymentStatus;

        const orders = await Order.find(query)
            .populate('user', 'name email phone')
            .populate('orderItems.product', 'name slug')
            .sort('-createdAt')
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();

        const count = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            count: orders.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { status } = req.body;

        if (!status) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const validStatuses = Object.values(ORDER_STATUS);
        if (!validStatuses.includes(status)) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const order = await Order.findById(req.params.id).session(session);

        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const allowedNext = VALID_TRANSITIONS[order.orderStatus] || [];
        if (!allowedNext.includes(status)) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: `Cannot transition order from '${order.orderStatus}' to '${status}'`
            });
        }

        order.orderStatus = status;

        if (status === ORDER_STATUS.DELIVERED) {
            order.deliveredAt = Date.now();
        }

        order.$session(session);
        await order.save();

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: 'Order status updated',
            data: order
        });

    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    } finally {
        session.endSession();
    }
};