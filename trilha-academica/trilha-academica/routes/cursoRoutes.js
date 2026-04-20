// cursoRoutes.js - ROTAS DE CURSOS
const express = require('express');
const { 
    listarAreas, 
    listarSubareas, 
    listarCursos, 
    getCursoDetalhes 
} = require('../controllers/cursoController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Rotas protegidas (requer login)
router.get('/areas', authMiddleware, listarAreas);
router.get('/areas/:area/subareas', authMiddleware, listarSubareas);
router.get('/areas/:area/subareas/:subarea/cursos', authMiddleware, listarCursos);
router.get('/areas/:area/subareas/:subarea/:nivel/:curso', authMiddleware, getCursoDetalhes);

module.exports = router;