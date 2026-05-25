const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { testConnection } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const recomendacaoRoutes = require('./routes/recommendationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cursoRoutes = require('./routes/cursoRoutes');
const progressoRoutes = require('./routes/progressoRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'frontend', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/recomendacao', recomendacaoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/progresso', progressoRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📁 Frontend: http://localhost:${PORT}/login.html`);
    await testConnection();
});