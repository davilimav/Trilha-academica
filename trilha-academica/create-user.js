const bcrypt = require('bcryptjs');
const { pool, testConnection } = require('./config/database');

async function createTestUser() {
    console.log('🔧 Criando usuário de teste...\n');
    
    await testConnection();
    
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    await pool.query(
        `INSERT INTO users (name, email, password) 
         VALUES ('Usuário Teste', 'teste@email.com', ?)
         ON DUPLICATE KEY UPDATE password = VALUES(password)`,
        [hashedPassword]
    );
    
    console.log('✅ Usuário de teste criado!');
    console.log('\n📧 Credenciais:');
    console.log('   Email: teste@email.com');
    console.log('   Senha: 123456\n');
    
    process.exit(0);
}

createTestUser();