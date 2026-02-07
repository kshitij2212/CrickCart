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

// ✅ IMPORTANT: Specific routes BEFORE dynamic routes

// @route   GET /api/v1/orders/myorders
// @desc    Get logged in user's orders
// @access  Private
router.get('/myorders', protect, getMyOrders);  // ✅ Move this UP

// @route   POST /api/v1/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, createOrder);

// @route   PUT /api/v1/orders/:id/pay
// @desc    Update order payment status
// @access  Private
router.put('/:id/pay', protect, updateOrderToPaid);

// @route   PUT /api/v1/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, cancelOrder);

// @route   PUT /api/v1/orders/:id/return
// @desc    Request return for delivered order
// @access  Private
router.put('/:id/return', protect, requestReturn);

// ==========================================
// ADMIN ROUTES (Protected + Admin)
// ==========================================

// @route   PUT /api/v1/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, admin, updateOrderStatus);

// ✅ Admin GET route at the BOTTOM (after all specific routes)
// @route   GET /api/v1/orders
// @desc    Get all orders (with filters)
// @access  Private/Admin
router.get('/', protect, admin, getAllOrders);

// ✅ Dynamic route LAST
// @route   GET /api/v1/orders/:id
// @desc    Get order by ID
// @access  Private (user or admin)
router.get('/:id', protect, getOrderById);

module.exports = router;