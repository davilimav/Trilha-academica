// controllers/adminController.js
const { pool } = require('../config/database');

const getDashboardStats = async (req, res) => {
    try {
        const [totalUsers] = await pool.query('SELECT COUNT(*) as total FROM users');
        const [totalQuestionarios] = await pool.query('SELECT COUNT(*) as total FROM questionario_respostas');
        const [totalEspecializacoes] = await pool.query('SELECT COUNT(*) as total FROM user_especializacoes');
        const [usuariosAtivos] = await pool.query(`
            SELECT COUNT(DISTINCT user_id) as total 
            FROM user_stats 
            WHERE last_access > DATE_SUB(NOW(), INTERVAL 30 DAY)
        `);
        res.json({
            total_usuarios: totalUsers[0].total,
            total_questionarios: totalQuestionarios[0].total,
            total_especializacoes: totalEspecializacoes[0].total,
            usuarios_ativos_30d: usuariosAtivos[0].total || 0
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro ao carregar estatísticas' });
    }
};

const getTopEspecializacoes = async (req, res) => {
    try {
        const [topEspecs] = await pool.query(`
            SELECT especializacao, COUNT(*) as total, materia
            FROM user_especializacoes
            GROUP BY especializacao, materia
            ORDER BY total DESC
            LIMIT 10
        `);
        res.json(topEspecs);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro ao carregar especializações' });
    }
};

const getNivelMedioPorMateria = async (req, res) => {
    try {
        const [niveis] = await pool.query(`
            SELECT 
                AVG(programacao_nivel) as programacao,
                AVG(dados_nivel) as dados,
                AVG(design_nivel) as design,
                AVG(seguranca_nivel) as seguranca,
                AVG(marketing_nivel) as marketing
            FROM questionario_respostas
        `);
        res.json(niveis[0] || { programacao: 0, dados: 0, design: 0, seguranca: 0, marketing: 0 });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro ao carregar níveis' });
    }
};

const getUsuarios = async (req, res) => {
    try {
        const [usuarios] = await pool.query(`
            SELECT 
                u.id, u.name, u.email, u.curso, u.created_at,
                qr.programacao_nivel, qr.dados_nivel, qr.design_nivel, 
                qr.seguranca_nivel, qr.marketing_nivel,
                (SELECT COUNT(*) FROM user_especializacoes WHERE user_id = u.id) as total_especializacoes,
                us.login_count, us.last_access
            FROM users u
            LEFT JOIN questionario_respostas qr ON u.id = qr.user_id
            LEFT JOIN user_stats us ON u.id = us.user_id
            ORDER BY u.created_at DESC
        `);
        res.json(usuarios);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro ao carregar usuários' });
    }
};

const getEspecializacoesUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const [especializacoes] = await pool.query(`
            SELECT materia, especializacao, created_at
            FROM user_especializacoes
            WHERE user_id = ?
            ORDER BY created_at DESC
        `, [id]);
        res.json(especializacoes);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro ao carregar especializações' });
    }
};

const getGraficos = async (req, res) => {
    try {
        const [especPorMateria] = await pool.query(`
            SELECT materia, COUNT(*) as total
            FROM user_especializacoes
            GROUP BY materia
            ORDER BY total DESC
        `);
        const [usuariosPorMes] = await pool.query(`
            SELECT DATE_FORMAT(created_at, '%Y-%m') as mes, COUNT(*) as total
            FROM users
            WHERE created_at > DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY mes ASC
        `);
        const [distribuicaoNiveis] = await pool.query(`
            SELECT 
                CASE 
                    WHEN (programacao_nivel + dados_nivel + design_nivel + seguranca_nivel + marketing_nivel) / 5 < 1.5 THEN 'Iniciante'
                    WHEN (programacao_nivel + dados_nivel + design_nivel + seguranca_nivel + marketing_nivel) / 5 < 2.5 THEN 'Intermediário'
                    ELSE 'Avançado'
                END as nivel,
                COUNT(*) as total
            FROM questionario_respostas
            GROUP BY nivel
        `);
        res.json({
            especializacoes_por_materia: especPorMateria,
            usuarios_por_mes: usuariosPorMes,
            distribuicao_niveis: distribuicaoNiveis
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro ao carregar gráficos' });
    }
};

module.exports = {
    getDashboardStats,
    getTopEspecializacoes,
    getNivelMedioPorMateria,
    getUsuarios,
    getEspecializacoesUsuario,
    getGraficos
};