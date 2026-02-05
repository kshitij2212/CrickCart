const express = require('express');
const router = express.Router();
const {register, login, getMe, logout} = require('../controllers/userController');
const { protect } = require('../middlewares/userMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
