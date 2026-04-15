const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

async function testConnection() {
    try {
        const conn = await pool.getConnection();
        console.log('✅ Banco de dados conectado!');
        conn.release();
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar:', error.message);
        return false;
    }
}

module.exports = { pool, testConnection };