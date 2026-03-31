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
router.get('/myorders', protect, getMyOrders);
router.post('/', protect, createOrder);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/return', protect, requestReturn);

router.put('/:id/status', protect, admin, updateOrderStatus);
router.get('/', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;