// controllers/adminController.js
const { pool } = require('../config/database');

const getDashboardStats = async (req, res) => {
    try {
        const [totalUsers] = await pool.query('SELECT COUNT(*) as total FROM users');
        const [totalQuestionarios] = await pool.query('SELECT COUNT(*) as total FROM questionario_respostas');

        // Contar especializações (se a tabela existir, senão usa 0)
        let totalEspecializacoes = 0;
        try {
            const [especs] = await pool.query('SELECT COUNT(*) as total FROM user_especializacoes');
            totalEspecializacoes = specs[0].total;
        } catch (err) {
            console.log('Tabela user_especializacoes não existe, usando 0');
        }

        // Contar usuários ativos (se a tabela existir, senão usa total de usuários)
        let usuariosAtivos = 0;
        try {
            const [ativos] = await pool.query('SELECT COUNT(DISTINCT user_id) as total FROM user_stats WHERE last_access > DATE_SUB(NOW(), INTERVAL 30 DAY)');
            usuariosAtivos = ativos[0].total || 0;
        } catch (err) {
            console.log('Tabela user_stats não existe, usando total de usuários');
            usuariosAtivos = totalUsers[0].total;
        }

        res.json({
            total_usuarios: totalUsers[0].total,
            total_questionarios: totalQuestionarios[0].total,
            total_especializacoes: totalEspecializacoes,
            usuarios_ativos_30d: usuariosAtivos
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro ao carregar estatísticas' });
    }
};

const getTopEspecializacoes = async (req, res) => {
    try {
        // Tenta buscar da tabela real, se não existir retorna dados de exemplo
        try {
            const [rows] = await pool.query('SELECT especializacao, COUNT(*) as total, materia FROM user_especializacoes GROUP BY especializacao ORDER BY total DESC LIMIT 10');
            if (rows.length > 0) {
                return res.json(rows);
            }
        } catch (err) {
            console.log('Tabela user_especializacoes não existe, usando dados de exemplo');
        }

        // Dados de exemplo baseados nos cursos concluídos
        const [cursos] = await pool.query(`
            SELECT curso_nome, COUNT(*) as total 
            FROM cursos_concluidos 
            GROUP BY curso_nome 
            ORDER BY total DESC 
            LIMIT 10
        `);

        if (cursos.length > 0) {
            return res.json(cursos.map(c => ({
                especializacao: c.curso_nome,
                total: c.total,
                materia: 'Cursos Concluídos'
            })));
        }

        res.json([]);
    } catch (error) {
        console.error('Erro:', error);
        res.json([]);
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
        res.json({ programacao: 0, dados: 0, design: 0, seguranca: 0, marketing: 0 });
    }
};

const getUsuarios = async (req, res) => {
    try {
        const [usuarios] = await pool.query(`
            SELECT 
                u.id, u.name, u.email, u.curso,
                qr.programacao_nivel, qr.dados_nivel, qr.design_nivel, 
                qr.seguranca_nivel, qr.marketing_nivel,
                (SELECT COUNT(*) FROM cursos_concluidos WHERE user_id = u.id) as total_cursos
            FROM users u
            LEFT JOIN questionario_respostas qr ON u.id = qr.user_id
            ORDER BY u.id DESC
            LIMIT 50
        `);
        res.json(usuarios);
    } catch (error) {
        console.error('Erro:', error);
        res.json([]);
    }
};

const getGraficos = async (req, res) => {
    try {
        // Cursos por matéria (baseado em cursos_concluidos)
        const [cursosPorMateria] = await pool.query(`
            SELECT trilha_nome as materia, COUNT(*) as total
            FROM cursos_concluidos
            GROUP BY trilha_nome
            ORDER BY total DESC
            LIMIT 10
        `);

        // Usuários por mês
        const [usuariosPorMes] = await pool.query(`
            SELECT DATE_FORMAT(created_at, '%Y-%m') as mes, COUNT(*) as total
            FROM users
            WHERE created_at > DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY mes ASC
        `);

        // Distribuição de níveis
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
            especializacoes_por_materia: cursosPorMateria,
            usuarios_por_mes: usuariosPorMes,
            distribuicao_niveis: distribuicaoNiveis
        });
    } catch (error) {
        console.error('Erro:', error);
        res.json({ especializacoes_por_materia: [], usuarios_por_mes: [], distribuicao_niveis: [] });
    }
};

module.exports = {
    getDashboardStats,
    getTopEspecializacoes,
    getNivelMedioPorMateria,
    getUsuarios,
    getGraficos
};