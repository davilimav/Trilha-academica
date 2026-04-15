const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { testConnection } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api/auth', authRoutes);
app.use('/api/recomendacao', recommendationRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API Trilha Acadêmica funcionando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}/login.html`);
    await testConnection();
});