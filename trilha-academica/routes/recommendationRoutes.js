// routes/recommendationRoutes.js - ROTAS DE RECOMENDAÇÃO
const express = require('express');
const { 
    getPerguntas, 
    salvarRespostas, 
    getRespostas, 
    getRecomendacoes
} = require('../controllers/recommendationController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Rotas públicas
router.get('/perguntas', getPerguntas);

// Rotas protegidas (requer login)
router.post('/respostas', authMiddleware, salvarRespostas);
router.get('/respostas', authMiddleware, getRespostas);
router.get('/recomendacoes', authMiddleware, getRecomendacoes);

module.exports = router;
