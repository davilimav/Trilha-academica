// controllers/recommendationController.js
const axios = require('axios');
const { pool } = require('../config/database');

const PYTHON_API_URL = 'http://localhost:5000';

// =====================================================
// BUSCAR PERGUNTAS DO QUESTIONÁRIO
// =====================================================
const getPerguntas = async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_API_URL}/questionario/perguntas`);
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar perguntas:', error.message);
        res.json({ perguntas: [] });
    }
};

// =====================================================
// SALVAR RESPOSTAS DO USUÁRIO
// =====================================================
const salvarRespostas = async (req, res) => {
    try {
        const userId = req.user.id;
        const { areas_interesse } = req.body;
        
        console.log('📥 ========================================');
        console.log('📥 Salvando respostas para usuário:', userId);
        console.log('📥 Áreas de interesse:', JSON.stringify(areas_interesse, null, 2));
        console.log('📥 ========================================');
        
        // Converter as áreas de interesse para os níveis (simplificado)
        let programacao_nivel = 0;
        let dados_nivel = 0;
        let design_nivel = 0;
        let seguranca_nivel = 0;
        let marketing_nivel = 0;
        
        for (const area of areas_interesse) {
            if (area.area === "Tecnologia da Informação (TI)") {
                programacao_nivel = area.cursos.length > 0 ? 2 : 1;
            }
            if (area.area === "Ciências") {
                dados_nivel = area.cursos.length > 0 ? 2 : 1;
            }
            if (area.area === "Matemática") {
                design_nivel = area.cursos.length > 0 ? 2 : 1;
            }
        }
        
        // Verificar se já existe registro
        const [existing] = await pool.query(
            'SELECT id FROM questionario_respostas WHERE user_id = ?',
            [userId]
        );
        
        if (existing.length > 0) {
            await pool.query(
                `UPDATE questionario_respostas 
                 SET programacao_nivel = ?, dados_nivel = ?, design_nivel = ?, 
                     seguranca_nivel = ?, marketing_nivel = ?, updated_at = NOW()
                 WHERE user_id = ?`,
                [programacao_nivel, dados_nivel, design_nivel, seguranca_nivel, marketing_nivel, userId]
            );
            console.log('✅ Respostas atualizadas para o usuário', userId);
        } else {
            await pool.query(
                `INSERT INTO questionario_respostas 
                 (user_id, programacao_nivel, dados_nivel, design_nivel, seguranca_nivel, marketing_nivel) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, programacao_nivel, dados_nivel, design_nivel, seguranca_nivel, marketing_nivel]
            );
            console.log('✅ Respostas inseridas para o usuário', userId);
        }
        
        res.json({ success: true, message: 'Respostas salvas com sucesso' });
    } catch (error) {
        console.error('❌ Erro ao salvar respostas:', error);
        res.status(500).json({ error: 'Erro ao salvar respostas' });
    }
};

// =====================================================
// BUSCAR RESPOSTAS DO USUÁRIO
// =====================================================
const getRespostas = async (req, res) => {
    try {
        const userId = req.user.id;
        const [respostas] = await pool.query(
            'SELECT programacao_nivel, dados_nivel, design_nivel, seguranca_nivel, marketing_nivel FROM questionario_respostas WHERE user_id = ?',
            [userId]
        );
        
        if (respostas.length === 0) {
            return res.json({});
        }
        
        res.json(respostas[0]);
    } catch (error) {
        console.error('Erro ao buscar respostas:', error);
        res.status(500).json({ error: 'Erro ao buscar respostas' });
    }
};

// =====================================================
// OBTER RECOMENDAÇÕES
// =====================================================
const getRecomendacoes = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [respostas] = await pool.query(
            'SELECT programacao_nivel, dados_nivel, design_nivel, seguranca_nivel, marketing_nivel FROM questionario_respostas WHERE user_id = ?',
            [userId]
        );
        
        if (respostas.length === 0) {
            return res.json({ 
                success: false, 
                message: 'Responda o questionário primeiro',
                recomendacoes: [],
                nivel_usuario: 0
            });
        }
        
        console.log('📤 Enviando para Python:', respostas[0]);
        
        const response = await axios.post(`${PYTHON_API_URL}/questionario/recomendar`, respostas[0]);
        
        console.log('📥 Resposta do Python:', response.data);
        
        res.json({
            success: true,
            nivel_usuario: response.data.nivel_usuario || 1,
            recomendacoes: response.data.recomendacoes || []
        });
        
    } catch (error) {
        console.error('❌ Erro ao obter recomendações:', error.message);
        res.json({ 
            success: false, 
            error: 'Erro ao obter recomendações',
            recomendacoes: [],
            nivel_usuario: 0
        });
    }
};

// =====================================================
// MARCAR QUESTIONÁRIO COMO RESPONDIDO
// =====================================================
const marcarQuestionario = async (req, res) => {
    try {
        await pool.query('UPDATE users SET questionario_respondido = TRUE WHERE id = ?', [req.user.id]);
        console.log('✅ Questionário marcado como respondido para usuário', req.user.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao marcar questionário:', error);
        res.status(500).json({ error: 'Erro ao marcar questionário' });
    }
};

module.exports = { 
    getPerguntas, 
    salvarRespostas, 
    getRespostas, 
    getRecomendacoes,
    marcarQuestionario
};