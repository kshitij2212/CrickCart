const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    cancelOrder,
    requestReturn,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/userMiddleware');

// ==========================================
// USER ROUTES (Protected)
// ==========================================

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, createOrder);

// @route   GET /api/orders/myorders
// @desc    Get logged in user's orders
// @access  Private
router.get('/myorders', protect, getMyOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private (user or admin)
router.get('/:id', protect, getOrderById);

// @route   PUT /api/orders/:id/pay
// @desc    Update order payment status (Payment gateway callback)
// @access  Private
router.put('/:id/pay', protect, updateOrderToPaid);

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, cancelOrder);

// @route   PUT /api/orders/:id/return
// @desc    Request return for delivered order
// @access  Private
router.put('/:id/return', protect, requestReturn);

// ==========================================
// ADMIN ROUTES (Protected + Admin)
// ==========================================

// @route   GET /api/orders
// @desc    Get all orders (with filters)
// @access  Private/Admin
router.get('/', protect, admin, getAllOrders);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;