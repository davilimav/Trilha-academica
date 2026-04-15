// recomendacaoController.js - Controlador de Recomendação
const axios = require('axios');
const { pool } = require('../config/database');

const PYTHON_API_URL = 'http://localhost:5000';

// Buscar perguntas do questionário
const getPerguntas = async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_API_URL}/questionario/perguntas`);
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar perguntas:', error.message);
        res.json({ perguntas: [] });
    }
};

// Salvar respostas do usuário
const salvarRespostas = async (req, res) => {
    try {
        const userId = req.user.id;
        const { programacao_nivel, dados_nivel, design_nivel, seguranca_nivel, marketing_nivel } = req.body;
        
        await pool.query(
            `INSERT INTO questionario_respostas 
             (user_id, programacao_nivel, dados_nivel, design_nivel, seguranca_nivel, marketing_nivel) 
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             programacao_nivel = VALUES(programacao_nivel),
             dados_nivel = VALUES(dados_nivel),
             design_nivel = VALUES(design_nivel),
             seguranca_nivel = VALUES(seguranca_nivel),
             marketing_nivel = VALUES(marketing_nivel)`,
            [userId, programacao_nivel || 0, dados_nivel || 0, design_nivel || 0, seguranca_nivel || 0, marketing_nivel || 0]
        );
        
        res.json({ success: true, message: 'Respostas salvas com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar respostas:', error);
        res.status(500).json({ error: 'Erro ao salvar respostas' });
    }
};

// Buscar respostas do usuário
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

// Obter recomendações
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
                recomendacoes: [] 
            });
        }
        
        const response = await axios.post(`${PYTHON_API_URL}/questionario/recomendar`, respostas[0]);
        res.json(response.data);
        
    } catch (error) {
        console.error('Erro ao obter recomendações:', error);
        res.status(500).json({ error: 'Erro ao obter recomendações' });
    }
};

module.exports = { getPerguntas, salvarRespostas, getRespostas, getRecomendacoes };