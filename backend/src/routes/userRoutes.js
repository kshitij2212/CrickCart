const express = require('express');
const router = express.Router();
const {register, login, getMe, logout, googleAuth, updateProfile} = require('../controllers/userController');
const { protect } = require('../middlewares/userMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/profile', protect, updateProfile);

module.exports = router;
