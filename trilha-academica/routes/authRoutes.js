const express = require('express');
const { 
    register, 
    login, 
    getProfile,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authMiddleware, getProfile);

module.exports = router;