const express = require('express');
const { pool } = require('../config/database');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Iniciar progresso
async function iniciarProgresso(userId) {
    const [existente] = await pool.query('SELECT id FROM progresso_usuario WHERE user_id = ?', [userId]);
    if (existente.length === 0) {
        await pool.query('INSERT INTO progresso_usuario (user_id, nivel_atual, pontos_total, horas_estudadas, ultimo_acesso) VALUES (?, 1, 0, 0, NOW())', [userId]);
    }
}

// Marcar curso como concluído
router.post('/concluir-curso', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { curso_nome, trilha_nome, horas_dedicadas } = req.body;

        await iniciarProgresso(userId);

        const [jaConcluiu] = await pool.query('SELECT id FROM cursos_concluidos WHERE user_id = ? AND curso_nome = ?', [userId, curso_nome]);
        if (jaConcluiu.length > 0) {
            return res.json({ success: false, message: 'Voce ja concluiu este curso!' });
        }
        
        await pool.query(
            'INSERT INTO cursos_concluidos (user_id, curso_nome, trilha_nome, horas_dedicadas, data_conclusao) VALUES (?, ?, ?, ?, NOW())', 
            [userId, curso_nome, trilha_nome, horas_dedicadas || 0]
        );
        
        await pool.query(
            'UPDATE progresso_usuario SET pontos_total = pontos_total + 100, horas_estudadas = horas_estudadas + ?, ultimo_acesso = NOW() WHERE user_id = ?', 
            [horas_dedicadas || 0, userId]
        );
        
        const [cursosCount] = await pool.query('SELECT COUNT(*) as total FROM cursos_concluidos WHERE user_id = ?', [userId]);
        const totalCursos = cursosCount[0].total;
        let conquista = null;
        let pontosBonus = 0;

        if (totalCursos === 1) { 
            conquista = "Primeiro Passo!"; 
            pontosBonus = 50;
        } else if (totalCursos === 3) { 
            conquista = "Aprendiz Dedicado"; 
            pontosBonus = 50;
        } else if (totalCursos === 5) { 
            conquista = "Mestre dos Cursos"; 
            pontosBonus = 50;
        } else if (totalCursos === 10) { 
            conquista = "Mestre Absoluto!"; 
            pontosBonus = 100;
        }

        if (conquista) {
            await pool.query(
                'INSERT INTO conquistas (user_id, conquista_nome, conquista_descricao, pontos_ganhos, data_obtencao) VALUES (?, ?, ?, ?, NOW())', 
                [userId, conquista, "Concluiu " + totalCursos + " cursos!", pontosBonus]
            );
            await pool.query('UPDATE progresso_usuario SET pontos_total = pontos_total + ? WHERE user_id = ?', [pontosBonus, userId]);
        }

        res.json({ success: true, message: "Curso concluído!", conquista: conquista, pontos_ganhos: 100 + pontosBonus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao marcar curso' });
    }
});

// Buscar proximo curso
router.get('/proximo-curso', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        await iniciarProgresso(userId);

        const [cursosConcluidos] = await pool.query('SELECT curso_nome FROM cursos_concluidos WHERE user_id = ?', [userId]);
        const concluidos = new Set(cursosConcluidos.map(c => c.curso_nome));

        const [progresso] = await pool.query('SELECT nivel_atual FROM progresso_usuario WHERE user_id = ?', [userId]);
        let nivelAtual = progresso[0]?.nivel_atual || 1;

        const cursosPorNivel = {
            1: ["Introdução a Banco de Dados", "HTML5 e CSS3", "JavaScript Básico", "Git e GitHub"],
            2: ["React.js", "Node.js com TypeScript", "SQL Avançado", "Machine Learning com Python"],
            3: ["React Avançado", "DevOps na Prática", "Ethical Hacking", "Deep Learning"]
        };

        let proximosCursos = cursosPorNivel[nivelAtual].filter(curso => !concluidos.has(curso));

        if (proximosCursos.length === 0 && nivelAtual < 3) {
            nivelAtual++;
            await pool.query('UPDATE progresso_usuario SET nivel_atual = ? WHERE user_id = ?', [nivelAtual, userId]);
            proximosCursos = cursosPorNivel[nivelAtual].filter(curso => !concluidos.has(curso));
        }

        res.json({ success: true, nivel_atual: nivelAtual, proximo_curso: proximosCursos[0] || null, total_concluidos: concluidos.size });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar proximo curso' });
    }
});

// Buscar progresso completo
router.get('/meu-progresso', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        await iniciarProgresso(userId);

        const [progresso] = await pool.query('SELECT * FROM progresso_usuario WHERE user_id = ?', [userId]);
        const [cursos] = await pool.query('SELECT * FROM cursos_concluidos WHERE user_id = ? ORDER BY data_conclusao DESC', [userId]);
        const [conquistas] = await pool.query('SELECT * FROM conquistas WHERE user_id = ? ORDER BY data_obtencao DESC', [userId]); // CORRIGIDO

        res.json({ success: true, progresso: progresso[0] || { pontos_total: 0, horas_estudadas: 0, nivel_atual: 1 }, cursos_concluidos: cursos, conquistas: conquistas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar progresso' });
    }
});

module.exports = router;
