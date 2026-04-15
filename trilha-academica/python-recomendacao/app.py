# =====================================================
# SERVIDOR DE RECOMENDAÇÃO - TRILHA ACADÊMICA
# =====================================================
# Este arquivo contém o algoritmo de Machine Learning
# para recomendação de trilhas baseado no perfil do usuário
# =====================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import json

app = Flask(__name__)
CORS(app)

# =====================================================
# 1. CATÁLOGO DE CURSOS (5 áreas × 3 níveis × 10 cursos)
# =====================================================
# Cada área tem 30 cursos: 10 iniciante, 10 intermediário, 10 avançado
# Total: 150 posições no vetor

areas_conhecimento = {
    "Programação": {
        "inicio": 0,
        "fim": 30,
        "niveis": {
            1: "Iniciante",
            2: "Intermediário", 
            3: "Avançado"
        }
    },
    "Ciência de Dados": {
        "inicio": 30,
        "fim": 60,
        "niveis": {
            1: "Iniciante",
            2: "Intermediário",
            3: "Avançado"
        }
    },
    "Design UX/UI": {
        "inicio": 60,
        "fim": 90,
        "niveis": {
            1: "Iniciante",
            2: "Intermediário",
            3: "Avançado"
        }
    },
    "Cybersegurança": {
        "inicio": 90,
        "fim": 120,
        "niveis": {
            1: "Iniciante",
            2: "Intermediário",
            3: "Avançado"
        }
    },
    "Marketing Digital": {
        "inicio": 120,
        "fim": 150,
        "niveis": {
            1: "Iniciante",
            2: "Intermediário",
            3: "Avançado"
        }
    }
}

# =====================================================
# 2. DEFINIÇÃO DAS TRILHAS (15 trilhas)
# =====================================================
# Cada trilha é um vetor de 150 posições
# 1 = curso incluído na trilha, 0 = não incluído

def criar_vetor_trilha(areas, niveis_por_area, pesos=None):
    """Cria vetor de 150 posições para uma trilha"""
    vetor = [0] * 150
    
    for area, config in areas_conhecimento.items():
        inicio = config["inicio"]
        fim = config["fim"]
        
        if area in areas:
            nivel = niveis_por_area.get(area, 0)
            if nivel > 0:
                # Marcar cursos até o nível especificado
                cursos_por_nivel = 10
                posicoes = inicio + (nivel * cursos_por_nivel)
                for i in range(inicio, posicoes):
                    vetor[i] = 1
                    
            # Aplicar pesos se existirem
            if pesos and area in pesos:
                peso = pesos[area]
                for i in range(inicio, fim):
                    if vetor[i] == 1:
                        vetor[i] = peso
    
    return vetor

# Definindo as 15 trilhas
trilhas_config = {
    "Desenvolvedor Full Stack": {
        "areas": ["Programação"],
        "niveis": {"Programação": 3},
        "pesos": None,
        "descricao": "Domine front-end, back-end e banco de dados para criar aplicações web completas",
        "duracao": "8 meses",
        "cursos_chave": ["JavaScript", "React.js", "Node.js", "Banco de Dados SQL"],
        "nivel_medio": 2.2
    },
    "Frontend Developer": {
        "areas": ["Programação", "Design UX/UI"],
        "niveis": {"Programação": 2, "Design UX/UI": 2},
        "pesos": {"Programação": 1.0, "Design UX/UI": 0.8},
        "descricao": "Crie interfaces web modernas e responsivas com foco na experiência do usuário",
        "duracao": "5 meses",
        "cursos_chave": ["HTML5/CSS3", "React.js", "UX/UI Fundamentals", "Figma"],
        "nivel_medio": 1.8
    },
    "Backend Developer": {
        "areas": ["Programação"],
        "niveis": {"Programação": 3},
        "pesos": None,
        "descricao": "Construa APIs robustas, sistemas escaláveis e banco de dados",
        "duracao": "6 meses",
        "cursos_chave": ["Node.js", "Python", "APIs RESTful", "Banco de Dados SQL"],
        "nivel_medio": 2.0
    },
    "Cientista de Dados": {
        "areas": ["Ciência de Dados", "Programação"],
        "niveis": {"Ciência de Dados": 3, "Programação": 2},
        "pesos": {"Ciência de Dados": 1.0, "Programação": 0.7},
        "descricao": "Extraia insights e construa modelos preditivos com Machine Learning",
        "duracao": "10 meses",
        "cursos_chave": ["Python para Dados", "Machine Learning", "Estatística", "SQL"],
        "nivel_medio": 2.3
    },
    "Engenheiro de ML": {
        "areas": ["Ciência de Dados", "Programação"],
        "niveis": {"Ciência de Dados": 3, "Programação": 3},
        "pesos": {"Ciência de Dados": 1.0, "Programação": 1.0},
        "descricao": "Coloque modelos de Machine Learning em produção",
        "duracao": "9 meses",
        "cursos_chave": ["MLOps", "Deep Learning", "Cloud Computing", "Docker"],
        "nivel_medio": 2.5
    },
    "Analista de Dados": {
        "areas": ["Ciência de Dados"],
        "niveis": {"Ciência de Dados": 2},
        "pesos": None,
        "descricao": "Analise dados e crie dashboards para tomada de decisão",
        "duracao": "4 meses",
        "cursos_chave": ["SQL", "Power BI", "Python", "Estatística"],
        "nivel_medio": 1.5
    },
    "UX/UI Designer": {
        "areas": ["Design UX/UI"],
        "niveis": {"Design UX/UI": 3},
        "pesos": None,
        "descricao": "Crie experiências digitais centradas no usuário",
        "duracao": "6 meses",
        "cursos_chave": ["Figma", "UX Research", "Design System", "Prototipagem"],
        "nivel_medio": 2.0
    },
    "Product Designer": {
        "areas": ["Design UX/UI", "Marketing Digital"],
        "niveis": {"Design UX/UI": 3, "Marketing Digital": 2},
        "pesos": {"Design UX/UI": 1.0, "Marketing Digital": 0.6},
        "descricao": "Una design e estratégia de produto para criar soluções inovadoras",
        "duracao": "7 meses",
        "cursos_chave": ["UX Design", "Product Strategy", "User Research", "Prototipagem"],
        "nivel_medio": 2.1
    },
    "Especialista em Cybersegurança": {
        "areas": ["Cybersegurança", "Programação"],
        "niveis": {"Cybersegurança": 3, "Programação": 2},
        "pesos": {"Cybersegurança": 1.0, "Programação": 0.8},
        "descricao": "Proteja sistemas, redes e dados contra ameaças cibernéticas",
        "duracao": "9 meses",
        "cursos_chave": ["Ethical Hacking", "Segurança de Rede", "Criptografia", "Pentest"],
        "nivel_medio": 2.3
    },
    "Security Analyst": {
        "areas": ["Cybersegurança"],
        "niveis": {"Cybersegurança": 2},
        "pesos": None,
        "descricao": "Monitore e responda a incidentes de segurança",
        "duracao": "5 meses",
        "cursos_chave": ["SIEM", "Análise de Vulnerabilidades", "Forensics", "Incident Response"],
        "nivel_medio": 1.6
    },
    "Marketing Digital Avançado": {
        "areas": ["Marketing Digital"],
        "niveis": {"Marketing Digital": 3},
        "pesos": None,
        "descricao": "Domine estratégias digitais de crescimento e aquisição",
        "duracao": "7 meses",
        "cursos_chave": ["SEO", "Google Ads", "Social Media", "Analytics"],
        "nivel_medio": 2.0
    },
    "Growth Hacker": {
        "areas": ["Marketing Digital", "Ciência de Dados"],
        "niveis": {"Marketing Digital": 3, "Ciência de Dados": 2},
        "pesos": {"Marketing Digital": 1.0, "Ciência de Dados": 0.7},
        "descricao": "Combine marketing e dados para acelerar o crescimento",
        "duracao": "8 meses",
        "cursos_chave": ["Growth Hacking", "A/B Testing", "Analytics", "SEO Avançado"],
        "nivel_medio": 2.2
    },
    "DevOps Engineer": {
        "areas": ["Programação", "Cybersegurança"],
        "niveis": {"Programação": 3, "Cybersegurança": 2},
        "pesos": {"Programação": 1.0, "Cybersegurança": 0.7},
        "descricao": "Automatize infraestrutura e deployment com práticas DevOps",
        "duracao": "7 meses",
        "cursos_chave": ["Docker", "Kubernetes", "CI/CD", "Cloud Computing"],
        "nivel_medio": 2.4
    },
    "Cloud Architect": {
        "areas": ["Programação", "Cybersegurança"],
        "niveis": {"Programação": 3, "Cybersegurança": 3},
        "pesos": {"Programação": 1.0, "Cybersegurança": 0.9},
        "descricao": "Projete e implemente arquiteturas escaláveis na nuvem",
        "duracao": "9 meses",
        "cursos_chave": ["AWS/Azure", "Kubernetes", "Terraform", "Cloud Security"],
        "nivel_medio": 2.6
    },
    "Product Manager Digital": {
        "areas": ["Marketing Digital", "Design UX/UI", "Programação"],
        "niveis": {"Marketing Digital": 3, "Design UX/UI": 2, "Programação": 1},
        "pesos": {"Marketing Digital": 1.0, "Design UX/UI": 0.8, "Programação": 0.5},
        "descricao": "Gerencie produtos digitais de ponta a ponta",
        "duracao": "8 meses",
        "cursos_chave": ["Product Strategy", "UX Research", "Agile", "Data Analysis"],
        "nivel_medio": 2.1
    }
}

# Construir vetores das trilhas
trilhas = {}
for nome, config in trilhas_config.items():
    vetor = criar_vetor_trilha(
        config["areas"], 
        config["niveis"], 
        config.get("pesos")
    )
    trilhas[nome] = {
        "vetor": vetor,
        "descricao": config["descricao"],
        "duracao": config["duracao"],
        "cursos_chave": config["cursos_chave"],
        "nivel_medio": config["nivel_medio"]
    }

# =====================================================
# 3. FUNÇÕES DO ALGORITMO
# =====================================================

def respostas_para_vetor(respostas):
    """
    Converte as respostas do questionário em vetor de 150 posições
    
    Args:
        respostas: dict com campos programacao_nivel, dados_nivel, etc.
                   valores: 0=Não sabe, 1=Iniciante, 2=Intermediário, 3=Avançado
    
    Returns:
        list: vetor de 150 posições (0 ou 1)
    """
    vetor = [0] * 150
    
    mapeamento = {
        "programacao_nivel": "Programação",
        "dados_nivel": "Ciência de Dados",
        "design_nivel": "Design UX/UI",
        "seguranca_nivel": "Cybersegurança",
        "marketing_nivel": "Marketing Digital"
    }
    
    for campo, area in mapeamento.items():
        nivel = respostas.get(campo, 0)
        if nivel > 0 and area in areas_conhecimento:
            config = areas_conhecimento[area]
            inicio = config["inicio"]
            # Cada nível adiciona 10 cursos
            cursos_por_nivel = 10
            fim = inicio + (nivel * cursos_por_nivel)
            for i in range(inicio, fim):
                vetor[i] = 1
    
    return vetor

def calcular_nivel_usuario(respostas):
    """Calcula o nível médio do usuário baseado nas respostas"""
    niveis = []
    for campo in ["programacao_nivel", "dados_nivel", "design_nivel", 
                  "seguranca_nivel", "marketing_nivel"]:
        nivel = respostas.get(campo, 0)
        if nivel > 0:
            niveis.append(nivel)
    
    if not niveis:
        return 1
    
    return round(sum(niveis) / len(niveis), 1)

def recomendar_trilhas(respostas, top_n=5):
    """
    Recomenda as melhores trilhas baseado nas respostas do usuário
    
    Args:
        respostas: dict com os níveis do usuário
        top_n: número de recomendações a retornar
    
    Returns:
        list: trilhas recomendadas com similaridade
    """
    # 1. Converter respostas em vetor
    vetor_usuario = respostas_para_vetor(respostas)
    
    # 2. Preparar matriz de trilhas
    nomes_trilhas = list(trilhas.keys())
    matriz_trilhas = np.array([trilhas[nome]["vetor"] for nome in nomes_trilhas])
    
    # 3. Calcular similaridade de cosseno
    vetor_usuario_np = np.array(vetor_usuario).reshape(1, -1)
    similaridades = cosine_similarity(vetor_usuario_np, matriz_trilhas)[0]
    
    # 4. Criar lista de recomendações
    recomendacoes = []
    for i, nome in enumerate(nomes_trilhas):
        if similaridades[i] > 0:
            recomendacoes.append({
                "trilha": nome,
                "similaridade": round(similaridades[i] * 100, 2),
                "descricao": trilhas[nome]["descricao"],
                "duracao": trilhas[nome]["duracao"],
                "cursos_chave": trilhas[nome]["cursos_chave"],
                "nivel_medio": trilhas[nome]["nivel_medio"]
            })
    
    # 5. Ordenar por similaridade (maior para menor)
    recomendacoes.sort(key=lambda x: x["similaridade"], reverse=True)
    
    return recomendacoes[:top_n]

# =====================================================
# 4. ENDPOINTS DA API
# =====================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Verifica se o servidor está rodando"""
    return jsonify({
        "status": "ok",
        "cursos_total": 150,
        "trilhas_total": len(trilhas),
        "versao": "2.0"
    })

@app.route('/questionario/perguntas', methods=['GET'])
def get_perguntas():
    """Retorna as perguntas do questionário para o frontend"""
    perguntas = [
        {
            "id": "programacao_nivel",
            "area": "Programação",
            "icone": "💻",
            "pergunta": "Qual seu nível de conhecimento em Programação?",
            "opcoes": [
                {"valor": 0, "label": "Não tenho conhecimento"},
                {"valor": 1, "label": "Iniciante (já vi lógica básica)"},
                {"valor": 2, "label": "Intermediário (já desenvolvi projetos)"},
                {"valor": 3, "label": "Avançado (trabalho/estudo há anos)"}
            ]
        },
        {
            "id": "dados_nivel",
            "area": "Ciência de Dados",
            "icone": "📊",
            "pergunta": "Qual seu nível de conhecimento em Ciência de Dados?",
            "opcoes": [
                {"valor": 0, "label": "Não tenho conhecimento"},
                {"valor": 1, "label": "Iniciante (conheço conceitos básicos)"},
                {"valor": 2, "label": "Intermediário (já fiz análises)"},
                {"valor": 3, "label": "Avançado (uso ML/produção)"}
            ]
        },
        {
            "id": "design_nivel",
            "area": "Design UX/UI",
            "icone": "🎨",
            "pergunta": "Qual seu nível de conhecimento em Design UX/UI?",
            "opcoes": [
                {"valor": 0, "label": "Não tenho conhecimento"},
                {"valor": 1, "label": "Iniciante (conheço ferramentas básicas)"},
                {"valor": 2, "label": "Intermediário (já criei protótipos)"},
                {"valor": 3, "label": "Avançado (trabalho com design)"}
            ]
        },
        {
            "id": "seguranca_nivel",
            "area": "Cybersegurança",
            "icone": "🔒",
            "pergunta": "Qual seu nível de conhecimento em Cybersegurança?",
            "opcoes": [
                {"valor": 0, "label": "Não tenho conhecimento"},
                {"valor": 1, "label": "Iniciante (conheço conceitos)"},
                {"valor": 2, "label": "Intermediário (já fiz cursos)"},
                {"valor": 3, "label": "Avançado (trabalho na área)"}
            ]
        },
        {
            "id": "marketing_nivel",
            "area": "Marketing Digital",
            "icone": "📈",
            "pergunta": "Qual seu nível de conhecimento em Marketing Digital?",
            "opcoes": [
                {"valor": 0, "label": "Não tenho conhecimento"},
                {"valor": 1, "label": "Iniciante (conheço redes sociais)"},
                {"valor": 2, "label": "Intermediário (já gerenciei campanhas)"},
                {"valor": 3, "label": "Avançado (trabalho com marketing)"}
            ]
        }
    ]
    
    return jsonify({"perguntas": perguntas})

@app.route('/questionario/recomendar', methods=['POST'])
def recomendar():
    """Recebe respostas e retorna recomendações de trilhas"""
    try:
        respostas = request.json
        print(f"📥 Recebidas respostas: {respostas}")
        
        # Validar respostas
        for campo in ["programacao_nivel", "dados_nivel", "design_nivel", 
                      "seguranca_nivel", "marketing_nivel"]:
            if campo not in respostas:
                respostas[campo] = 0
        
        # Calcular nível do usuário
        nivel_usuario = calcular_nivel_usuario(respostas)
        
        # Gerar recomendações
        recomendacoes = recomendar_trilhas(respostas)
        
        print(f"📤 Geradas {len(recomendacoes)} recomendações")
        
        return jsonify({
            "success": True,
            "nivel_usuario": nivel_usuario,
            "recomendacoes": recomendacoes
        })
        
    except Exception as e:
        print(f"❌ Erro: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/trilhas', methods=['GET'])
def listar_trilhas():
    """Lista todas as trilhas disponíveis"""
    trilhas_lista = []
    for nome, info in trilhas.items():
        trilhas_lista.append({
            "nome": nome,
            "descricao": info["descricao"],
            "duracao": info["duracao"],
            "nivel_medio": info["nivel_medio"]
        })
    return jsonify(trilhas_lista)

# =====================================================
# 5. INICIALIZAÇÃO
# =====================================================

if __name__ == "__main__":
    print("=" * 60)
    print("🎓 SISTEMA DE RECOMENDAÇÃO - TRILHA ACADÊMICA")
    print("=" * 60)
    print(f"📚 Total de posições no vetor: 150")
    print(f"🎯 Total de trilhas disponíveis: {len(trilhas)}")
    print(f"📊 Algoritmo: Cosine Similarity")
    print("=" * 60)
    print("🚀 Servidor rodando em http://localhost:5000")
    print("📋 Endpoints disponíveis:")
    print("   GET  /health")
    print("   GET  /questionario/perguntas")
    print("   POST /questionario/recomendar")
    print("   GET  /trilhas")
    print("=" * 60)
    
    app.run(host="0.0.0.0", port=5000, debug=True)