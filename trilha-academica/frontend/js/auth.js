const API_URL = 'http://localhost:3000/api/auth';

// Função para fazer login
async function fazerLogin(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true };
        }
        
        return { success: false, error: data.error || 'Erro no login' };
        
    } catch (error) {
        return { success: false, error: 'Erro ao conectar com o servidor' };
    }
}

// Função para fazer cadastro
async function fazerCadastro(name, email, password) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            return { success: true };
        }
        
        return { success: false, error: data.error || 'Erro no cadastro' };
        
    } catch (error) {
        return { success: false, error: 'Erro ao conectar com o servidor' };
    }
}

// Função para solicitar recuperação de senha
async function solicitarRecuperacao(email) {
    try {
        const response = await fetch(`${API_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            return { success: true, message: data.message };
        }
        
        return { success: false, error: data.error || 'Erro na solicitação' };
        
    } catch (error) {
        return { success: false, error: 'Erro ao conectar com o servidor' };
    }
}

// Função para redefinir senha
async function redefinirSenha(token, newPassword) {
    try {
        const response = await fetch(`${API_URL}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            return { success: true, message: data.message };
        }
        
        return { success: false, error: data.error || 'Erro ao redefinir senha' };
        
    } catch (error) {
        return { success: false, error: 'Erro ao conectar com o servidor' };
    }
}