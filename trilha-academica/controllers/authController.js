const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../config/database');
const emailService = require('../services/emailService');

// CADASTRO
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            r
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

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }
        
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }
        
        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        
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
            message: 'Login realizado com sucesso!',
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// PERFIL
const getProfile = async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, name, email, created_at FROM users WHERE id = ?',
            [req.user.id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        res.json({ user: users[0] });
        
    } catch (error) {
        console.error('Erro no perfil:', error);
        res.status(500).json({ error: 'Erro interno' });
    }
};

// ==================== RECUPERAÇÃO DE SENHA ====================

// SOLICITAR RECUPERAÇÃO
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email é obrigatório' });
        }
        
        // Buscar usuário
        const [users] = await pool.query(
            'SELECT id, name, email FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            // Por segurança, não informar que o email não existe
            return res.json({ 
                success: true, 
                message: 'Se o email estiver cadastrado, você receberá as instruções.' 
            });
        }
        
        const user = users[0];
        
        // Gerar token único
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora
        
        // Salvar token no banco
        await pool.query(
            'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
            [resetToken, resetTokenExpires, user.id]
        );
        
        // Enviar email
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

// REDEFINIR SENHA
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
        }
        
        // Buscar usuário pelo token válido
        const [users] = await pool.query(
            `SELECT * FROM users 
             WHERE reset_token = ? 
             AND reset_token_expires > NOW()`,
            [token]
        );
        
        if (users.length === 0) {
            return res.status(400).json({ error: 'Token inválido ou expirado' });
        }
        
        const user = users[0];
        
        // Criptografar nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Atualizar senha e limpar token
        await pool.query(
            `UPDATE users 
             SET password = ?, reset_token = NULL, reset_token_expires = NULL 
             WHERE id = ?`,
            [hashedPassword, user.id]
        );
        
        // Enviar email de confirmação
        await emailService.sendPasswordChangedEmail(user.email, user.name);
        
        res.json({ 
            success: true, 
            message: 'Senha alterada com sucesso!' 
        });
        
    } catch (error) {
        console.error('Erro no reset password:', error);
        res.status(500).json({ error: 'Erro ao redefinir senha' });
    }
};

module.exports = { register, login, getProfile, forgotPassword, resetPassword };