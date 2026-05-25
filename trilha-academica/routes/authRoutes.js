// routes/authRoutes.js
const express = require('express');
const { 
    register, 
    login, 
    getProfile,
    forgotPassword,
    resetPassword,
    uploadFotoPerfil,
    atualizarPerfil,
    marcarQuestionario,
    upload
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Rotas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Rotas protegidas (requer login)
router.get('/me', authMiddleware, getProfile);
router.post('/upload-foto', authMiddleware, upload.single('foto'), uploadFotoPerfil);
router.put('/perfil', authMiddleware, atualizarPerfil);
router.post('/marcar-questionario', authMiddleware, marcarQuestionario);

module.exports = router;