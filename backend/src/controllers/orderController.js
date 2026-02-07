const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Order Status Constants
const ORDER_STATUS = {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    RETURN_REQUESTED: 'Return Requested',
    RETURNED: 'Returned'
};

const PAYMENT_STATUS = {
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    REFUNDED: 'Refunded'
};

// @desc    Create new order with transaction
// @route   POST /api/orders
// @access  Private
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

        // Validation
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

        // ✅ FIX 1: Atomic stock update with session
        for (let item of orderItems) {
            const product = await Product.findOneAndUpdate(
                {
                    _id: item.product,
                    countInStock: { $gte: item.quantity } // ✅ Only update if stock available
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

        // ✅ FIX 2: Generate order number with retry
        let orderNumber;
        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {
            orderNumber = await Order.generateOrderNumber();
            const exists = await Order.findOne({ orderNumber }).session(session);
            
            if (!exists) break;
            
            attempts++;
            if (attempts === maxAttempts) {
                await session.abortTransaction();
                return res.status(500).json({
                    success: false,
                    message: 'Could not generate unique order number. Please try again.'
                });
            }
        }

        // ✅ FIX 3: Realistic payment status
        const paymentStatus = paymentMethod === 'COD' 
            ? PAYMENT_STATUS.PENDING 
            : PAYMENT_STATUS.PENDING; // All start as pending, gateway callback will update

        // Create order
        const order = await Order.create([{
            orderNumber,
            user: req.user.id,
            orderItems,
            shippingAddress,
            payment: {
                method: paymentMethod,
                status: paymentStatus
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

        // Clear user's cart
        await Cart.findOneAndUpdate(
            { user: req.user.id },
            { items: [] },
            { session }
        );

        // ✅ Commit transaction
        await session.commitTransaction();

        // ✅ FIX 4: Use lean() for read-only
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

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const {
            status,
            page = 1,
            limit = 10
        } = req.query;

        let query = { user: req.user.id };
        if (status) query.orderStatus = status;

        const orders = await Order.find(query)
            .populate('orderItems.product', 'name slug images')
            .sort('-createdAt')
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .lean(); // ✅ FIX 4: Use lean()

        const count = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            count: orders.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
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

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('orderItems.product', 'name slug images brand')
            .lean(); // ✅ Use lean()

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check authorization
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

// @desc    Payment callback (webhook from payment gateway)
// @route   PUT /api/orders/:id/pay
// @access  Private
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

        // ✅ Realistic payment status handling
        order.payment.status = status === 'success' 
            ? PAYMENT_STATUS.COMPLETED 
            : PAYMENT_STATUS.FAILED;
        
        if (status === 'success') {
            order.payment.paidAt = Date.now();
            order.payment.transactionId = transactionId;
            order.payment.provider = provider;
            order.orderStatus = ORDER_STATUS.PROCESSING;
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

// @desc    Cancel order with transaction
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(req.params.id).session(session);

        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check authorization
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            await session.abortTransaction();
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
        }

        // Check if cancellable
        if (![ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING].includes(order.orderStatus)) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order with status: ${order.orderStatus}`
            });
        }

        order.orderStatus = ORDER_STATUS.CANCELLED;
        order.cancelledAt = Date.now();

        // ✅ Atomic stock restore
        for (let item of order.orderItems) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { countInStock: item.quantity } },
                { session }
            );
        }

        // Handle refund
        if (order.payment.status === PAYMENT_STATUS.COMPLETED) {
            order.payment.status = PAYMENT_STATUS.REFUNDED;
            order.payment.refundedAt = Date.now();
        }

        await order.save({ session });
        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });

    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({
            success: false,
            message: 'Error cancelling order',
            error: error.message
        });
    } finally {
        session.endSession();
    }
};

// @desc    Request return
// @route   PUT /api/orders/:id/return
// @access  Private
exports.requestReturn = async (req, res) => {
    try {
        const { reason } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        if (order.orderStatus !== ORDER_STATUS.DELIVERED) {
            return res.status(400).json({
                success: false,
                message: 'Can only return delivered orders'
            });
        }

        // Check return window (7 days)
        const daysSinceDelivery = Math.floor((Date.now() - order.deliveredAt) / (1000 * 60 * 60 * 24));
        if (daysSinceDelivery > 7) {
            return res.status(400).json({
                success: false,
                message: 'Return window expired. Returns allowed within 7 days of delivery'
            });
        }

        order.orderStatus = ORDER_STATUS.RETURN_REQUESTED;
        order.returnRequestedAt = Date.now();

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Return requested successfully',
            data: order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error requesting return',
            error: error.message
        });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
    try {
        const {
            status,
            paymentStatus,
            page = 1,
            limit = 10
        } = req.query;

        let query = {};
        if (status) query.orderStatus = status;
        if (paymentStatus) query['payment.status'] = paymentStatus;

        const orders = await Order.find(query)
            .populate('user', 'name email phone')
            .populate('orderItems.product', 'name slug')
            .sort('-createdAt')
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .lean(); // ✅ Use lean()

        const count = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            count: orders.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
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

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
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

        order.orderStatus = status;

        if (status === ORDER_STATUS.DELIVERED) {
            order.deliveredAt = Date.now();
        } else if (status === ORDER_STATUS.RETURNED) {
            order.returnedAt = Date.now();
            order.payment.status = PAYMENT_STATUS.REFUNDED;
            order.payment.refundedAt = Date.now();
            
            // ✅ Atomic stock restore
            for (let item of order.orderItems) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { countInStock: item.quantity } },
                    { session }
                );
            }
        }

        await order.save({ session });
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

module.exports = {
    ORDER_STATUS,
    PAYMENT_STATUS
};