const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id })
            .populate({
                path: 'items.product',
                select: 'name price discount images slug countInStock'
            });

        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            data: cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching cart",
            error: error.message
        });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const requestedQuantity = quantity || 1;
        if (product.countInStock < requestedQuantity) {
            return res.status(400).json({
                success: false,
                message: "No more quantity available"
            });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            const newQuantity = cart.items[existingItemIndex].quantity + requestedQuantity;

            if (product.countInStock < newQuantity) {
                return res.status(400).json({
                    success: false,
                    message: "No more quantity available"
                });
            }

            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            cart.items.push({
                product: productId,
                quantity: requestedQuantity,
                price: product.price
            });
        }

        await cart.save();

        cart = await Cart.findById(cart._id).populate({
            path: 'items.product',
            select: 'name price discount images slug countInStock'
        });

        return res.status(200).json({
            success: true,
            message: "Item added to cart",
            data: cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error adding to cart",
            error: error.message
        });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item._id.toString() === req.params.itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        const product = await Product.findById(cart.items[itemIndex].product);
        if (product.countInStock < quantity) {
            return res.status(400).json({
                success: false,
                message: "No more quantity available"
            });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        cart = await Cart.findById(cart._id).populate({
            path: 'items.product',
            select: 'name price discount images slug countInStock'
        });

        return res.status(200).json({
            success: true,
            message: 'Cart updated',
            data: cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating cart',
            error: error.message
        });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(
            item => item._id.toString() !== req.params.itemId
        );

        await cart.save();

        cart = await Cart.findById(cart._id).populate({
            path: 'items.product',
            select: 'name price discount images slug countInStock'
        });

        return res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            data: cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error removing from cart',
            error: error.message
        });
    }
};

exports.clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = [];
        await cart.save();

        return res.status(200).json({
            success: true,
            message: 'Cart cleared',
            data: cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error clearing cart',
            error: error.message
        });
    }
};