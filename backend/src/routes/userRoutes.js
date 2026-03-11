const express = require('express');
const router = express.Router();
const {register, login, getMe, logout} = require('../controllers/userController');
const { protect } = require('../middlewares/userMiddleware');

router.post('/register', register);
router.post('/login', login);

router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
