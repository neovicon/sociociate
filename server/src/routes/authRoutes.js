const express = require('express');
const router = express.Router();
const { register, login, getMe, googleAuth, googleAuthCallback } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);


module.exports = router;
