// =====================================================
// AUTH.JS - FUNÇÕES DE AUTENTICAÇÃO E PERFIL
// =====================================================

const API_URL = 'http://localhost:3000/api/auth';
const RECOMENDACAO_URL = 'http://localhost:3000/api/recomendacao';

// =====================================================
// AUTENTICAÇÃO
// =====================================================

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
            return { success: true, user: data.user };
        }
        return { success: false, error: data.error || 'Erro no login' };
    } catch (error) {
        return { success: false, error: 'Erro ao conectar com o servidor' };
    }
}

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

function sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function isLogado() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    } catch {
        return false;
    }
}

// =====================================================
// FOTO DE PERFIL
// =====================================================

async function uploadFotoPerfil(file) {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, error: 'Não logado' };
    
    const formData = new FormData();
    formData.append('foto', file);
    
    try {
        const response = await fetch(`${API_URL}/upload-foto`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Atualizar usuário no localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.foto_url = data.foto_url;
            localStorage.setItem('user', JSON.stringify(user));
            return { success: true, foto_url: data.foto_url };
        }
        return { success: false, error: data.error };
    } catch (error) {
        return { success: false, error: 'Erro de conexão' };
    }
}

async function atualizarPerfil(dados) {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, error: 'Não logado' };
    
    try {
        const response = await fetch(`${API_URL}/perfil`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });
        const data = await response.json();
        return { success: response.ok, message: data.message };
    } catch (error) {
        return { success: false, error: 'Erro de conexão' };
    }
}

// =====================================================
// RECOMENDAÇÕES
// =====================================================

async function carregarPerguntas() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${RECOMENDACAO_URL}/perguntas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar perguntas:', error);
        return { perguntas: [] };
    }
}

async function salvarRespostas(respostas) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${RECOMENDACAO_URL}/respostas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(respostas)
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: 'Erro ao salvar respostas' };
    }
}

async function obterRecomendacoes() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${RECOMENDACAO_URL}/recomendacoes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    } catch (error) {
        return { success: false, recomendacoes: [] };
    }
}