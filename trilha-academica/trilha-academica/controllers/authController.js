// authController.js - AUTENTICAÇÃO COMPLETA
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../config/database');
const emailService = require('../services/emailService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// =====================================================
// CONFIGURAÇÃO DE UPLOAD DE FOTO DE PERFIL
// =====================================================
const uploadDir = path.join(__dirname, '../frontend/uploads/perfil');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const userId = req.user.id;
        const ext = path.extname(file.originalname);
        const filename = `perfil-${userId}-${Date.now()}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// =====================================================
// CADASTRO
// =====================================================
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
        }
        
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        
        res.status(201).json({ 
            success: true,
            message: 'Cadastro realizado com sucesso!',
            user: { id: result.insertId, name, email }
        });
        
    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// =====================================================
// LOGIN
// =====================================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [users] = await pool.query(
            'SELECT id, name, email, foto_url, curso, interesses, questionario_respondido FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }
        
        const user = users[0];
        const [passwords] = await pool.query('SELECT password FROM users WHERE email = ?', [email]);
        const isValidPassword = await bcrypt.compare(password, passwords[0].password);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }
        
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                foto_url: user.foto_url || null,
                curso: user.curso || null,
                interesses: user.interesses ? JSON.parse(user.interesses) : [],
                questionario_respondido: user.questionario_respondido || false
            }
        });
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// =====================================================
// PERFIL
// =====================================================
const getProfile = async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, name, email, foto_url, curso, interesses, questionario_respondido, created_at FROM users WHERE id = ?',
            [req.user.id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        const user = users[0];
        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                foto_url: user.foto_url || null,
                curso: user.curso || null,
                interesses: user.interesses ? JSON.parse(user.interesses) : [],
                questionario_respondido: user.questionario_respondido || false,
                created_at: user.created_at
            }
        });
        
    } catch (error) {
        console.error('Erro no perfil:', error);
        res.status(500).json({ error: 'Erro interno' });
    }
};

// =====================================================
// MARCAR QUESTIONÁRIO COMO RESPONDIDO
// =====================================================
const marcarQuestionario = async (req, res) => {
    try {
        await pool.query('UPDATE users SET questionario_respondido = TRUE WHERE id = ?', [req.user.id]);
        res.json({ success: true, message: 'Questionário marcado como respondido' });
    } catch (error) {
        console.error('Erro ao marcar questionário:', error);
        res.status(500).json({ error: 'Erro ao marcar questionário' });
    }
};

// =====================================================
// UPLOAD FOTO DE PERFIL
// =====================================================
const uploadFotoPerfil = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada' });
        }
        
        const fotoUrl = `/uploads/perfil/${req.file.filename}`;
        
        const [oldFoto] = await pool.query('SELECT foto_url FROM users WHERE id = ?', [req.user.id]);
        if (oldFoto[0] && oldFoto[0].foto_url) {
            const oldPath = path.join(__dirname, '../frontend', oldFoto[0].foto_url);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }
        
        await pool.query('UPDATE users SET foto_url = ? WHERE id = ?', [fotoUrl, req.user.id]);
        
        res.json({
            success: true,
            foto_url: fotoUrl,
            message: 'Foto atualizada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        res.status(500).json({ error: 'Erro ao fazer upload da foto' });
    }
};

// =====================================================
// ATUALIZAR PERFIL
// =====================================================
const atualizarPerfil = async (req, res) => {
    try {
        const { curso, interesses } = req.body;
        
        if (curso) {
            await pool.query('UPDATE users SET curso = ? WHERE id = ?', [curso, req.user.id]);
        }
        
        if (interesses) {
            await pool.query('UPDATE users SET interesses = ? WHERE id = ?', [JSON.stringify(interesses), req.user.id]);
        }
        
        res.json({ success: true, message: 'Perfil atualizado com sucesso!' });
        
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
};

// =====================================================
// RECUPERAÇÃO DE SENHA
// =====================================================
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email é obrigatório' });
        }
        
        const [users] = await pool.query('SELECT id, name, email FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.json({ 
                success: true, 
                message: 'Se o email estiver cadastrado, você receberá as instruções.' 
            });
        }
        
        const user = users[0];
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000);
        
        await pool.query(
            'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
            [resetToken, resetTokenExpires, user.id]
        );
        
        await emailService.sendResetPasswordEmail(user.email, user.name, resetToken);
        
        res.json({ 
            success: true, 
            message: 'Se o email estiver cadastrado, você receberá as instruções.' 
        });
        
    } catch (error) {
        console.error('Erro no forgot password:', error);
        res.status(500).json({ error: 'Erro ao processar solicitação' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
        }
        
        const [users] = await pool.query(
            `SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()`,
            [token]
        );
        
        if (users.length === 0) {
            return res.status(400).json({ error: 'Token inválido ou expirado' });
        }
        
        const user = users[0];
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await pool.query(
            `UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?`,
            [hashedPassword, user.id]
        );
        
        await emailService.sendPasswordChangedEmail(user.email, user.name);
        
        res.json({ success: true, message: 'Senha alterada com sucesso!' });
        
    } catch (error) {
        console.error('Erro no reset password:', error);
        res.status(500).json({ error: 'Erro ao redefinir senha' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    forgotPassword,
    resetPassword,
    uploadFotoPerfil,
    atualizarPerfil,
    marcarQuestionario,
    upload
};