// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { testConnection } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const recomendacaoRoutes = require('./routes/recommendationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend e uploads
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'frontend', 'uploads')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/recomendacao', recomendacaoRoutes);
app.use('/api/admin', adminRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'API Trilha Acadêmica funcionando!' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📁 Frontend: http://localhost:${PORT}/login.html`);
    await testConnection();
});