// cursoRoutes.js - ROTAS DE CURSOS
const express = require('express');
const {
    listarAreas,
    listarSubareas,
    listarCursos,
    getCursoDetalhes,
    getCursoDetalhesCompleto
} = require('../controllers/cursoController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/areas', authMiddleware, listarAreas);
router.get('/areas/:area/subareas', authMiddleware, listarSubareas);
router.get('/areas/:area/subareas/:subarea/cursos', authMiddleware, listarCursos);
router.get('/areas/:area/subareas/:subarea/:nivel/:curso', authMiddleware, getCursoDetalhes);
router.get('/detalhes-completo/:area/:subarea/:nivel/:curso', authMiddleware, getCursoDetalhesCompleto);

module.exports = router;