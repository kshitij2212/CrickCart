const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

exports.getWishlist = async (req, res) => {
    console.log('🔥 getWishlist called');
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id })
            .populate('items.product')
        console.log('product data:', JSON.stringify(wishlist?.items?.[0]?.product, null, 2));

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user.id, items: [] });
        }

        res.status(200).json({ success: true, data: wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching wishlist', error: error.message });
    }
};

exports.toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        let wishlist = await Wishlist.findOne({ user: req.user.id });
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user.id, items: [] });
        }

        const alreadyAdded = wishlist.items.some(
            item => item.product.toString() === productId
        );

        let message;
        if (alreadyAdded) {
            wishlist.items = wishlist.items.filter(
                item => item.product.toString() !== productId
            );
            message = 'Removed from wishlist';
        } else {
            wishlist.items.push({ product: productId });
            message = 'Added to wishlist';
        }

        await wishlist.save();

        res.status(200).json({ success: true, message, data: wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error toggling wishlist', error: error.message });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user.id });
        if (!wishlist) {
            return res.status(404).json({ success: false, message: 'Wishlist not found' });
        }

        wishlist.items = wishlist.items.filter(
            item => item.product.toString() !== productId
        );

        await wishlist.save();

        res.status(200).json({ success: true, message: 'Removed from wishlist', data: wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing from wishlist', error: error.message });
    }
};