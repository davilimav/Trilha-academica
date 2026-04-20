const express = require('express');
const { pool } = require('../config/database');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Middleware de autenticação para todas as rotas admin
router.use(authMiddleware);

// Dashboard stats
router.get('/dashboard/stats', async (req, res) => {
    try {
        const [totalUsers] = await pool.query('SELECT COUNT(*) as total FROM users');
        const [totalQuestionarios] = await pool.query('SELECT COUNT(*) as total FROM questionario_respostas');
        const [totalEspecializacoes] = await pool.query('SELECT COUNT(*) as total FROM user_especializacoes');
        const [usuariosAtivos] = await pool.query('SELECT COUNT(DISTINCT user_id) as total FROM user_stats WHERE last_access > DATE_SUB(NOW(), INTERVAL 30 DAY)');
        res.json({
            total_usuarios: totalUsers[0].total,
            total_questionarios: totalQuestionarios[0].total,
            total_especializacoes: totalEspecializacoes[0].total,
            usuarios_ativos_30d: usuariosAtivos[0].total || 0
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro' });
    }
});

// Top especializações
router.get('/dashboard/top-especializacoes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT especializacao, COUNT(*) as total FROM user_especializacoes GROUP BY especializacao ORDER BY total DESC LIMIT 10');
        res.json(rows);
    } catch (error) {
        res.json([]);
    }
});

// Níveis médios
router.get('/dashboard/niveis-medios', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT AVG(programacao_nivel) as programacao, AVG(dados_nivel) as dados, AVG(design_nivel) as design, AVG(seguranca_nivel) as seguranca, AVG(marketing_nivel) as marketing FROM questionario_respostas');
        res.json(rows[0] || {});
    } catch (error) {
        res.json({});
    }
});

// Usuários
router.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT u.id, u.name, u.email, u.curso, q.programacao_nivel, q.dados_nivel, q.design_nivel, q.seguranca_nivel, q.marketing_nivel, (SELECT COUNT(*) FROM user_especializacoes WHERE user_id = u.id) as total_especializacoes FROM users u LEFT JOIN questionario_respostas q ON u.id = q.user_id ORDER BY u.id DESC`);
        res.json(rows);
    } catch (error) {
        res.json([]);
    }
});

// Gráficos
router.get('/dashboard/graficos', async (req, res) => {
    try {
        const [especPorMateria] = await pool.query('SELECT materia, COUNT(*) as total FROM user_especializacoes GROUP BY materia');
        const [usuariosPorMes] = await pool.query('SELECT DATE_FORMAT(created_at, "%Y-%m") as mes, COUNT(*) as total FROM users WHERE created_at > DATE_SUB(NOW(), INTERVAL 6 MONTH) GROUP BY mes ORDER BY mes');
        const [distribuicaoNiveis] = await pool.query(`SELECT CASE WHEN (programacao_nivel + dados_nivel + design_nivel + seguranca_nivel + marketing_nivel) / 5 < 1.5 THEN 'Iniciante' WHEN (programacao_nivel + dados_nivel + design_nivel + seguranca_nivel + marketing_nivel) / 5 < 2.5 THEN 'Intermediário' ELSE 'Avançado' END as nivel, COUNT(*) as total FROM questionario_respostas GROUP BY nivel`);
        res.json({ especializacoes_por_materia: especPorMateria, usuarios_por_mes: usuariosPorMes, distribuicao_niveis: distribuicaoNiveis });
    } catch (error) {
        res.json({});
    }
});

module.exports = router;