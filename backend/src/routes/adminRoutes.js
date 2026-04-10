const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/userMiddleware');
const {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} = require('../controllers/adminController');

router.get('/users', protect, admin, getAllUsers);
router.patch('/users/:id/role', protect, admin, updateUserRole);
router.patch('/users/:id/status', protect, admin, updateUserStatus);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
