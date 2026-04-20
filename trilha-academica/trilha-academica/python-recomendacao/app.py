# =====================================================
# SERVIDOR DE RECOMENDAÇÃO - TRILHA ACADÊMICA
# =====================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import json
from urllib.parse import unquote

app = Flask(__name__)
CORS(app)

# =====================================================
# 1. CATÁLOGO DE CURSOS (5 áreas × 3 níveis × 10 cursos)
# =====================================================

areas_conhecimento = {
    "Programação": {"inicio": 0, "fim": 30, "niveis": {1: "Iniciante", 2: "Intermediário", 3: "Avançado"}},
    "Ciência de Dados": {"inicio": 30, "fim": 60, "niveis": {1: "Iniciante", 2: "Intermediário", 3: "Avançado"}},
    "Design UX/UI": {"inicio": 60, "fim": 90, "niveis": {1: "Iniciante", 2: "Intermediário", 3: "Avançado"}},
    "Cybersegurança": {"inicio": 90, "fim": 120, "niveis": {1: "Iniciante", 2: "Intermediário", 3: "Avançado"}},
    "Marketing Digital": {"inicio": 120, "fim": 150, "niveis": {1: "Iniciante", 2: "Intermediário", 3: "Avançado"}}
}

# =====================================================
# 2. DEFINIÇÃO DAS TRILHAS
# =====================================================

def criar_vetor_trilha(areas, niveis_por_area, pesos=None):
    vetor = [0] * 150
    for area, config in areas_conhecimento.items():
        inicio = config["inicio"]
        fim = config["fim"]
        if area in areas:
            nivel = niveis_por_area.get(area, 0)
            if nivel > 0:
                cursos_por_nivel = 10
                posicoes = inicio + (nivel * cursos_por_nivel)
                for i in range(inicio, posicoes):
                    vetor[i] = 1
            if pesos and area in pesos:
                peso = pesos[area]
                for i in range(inicio, fim):
                    if vetor[i] == 1:
                        vetor[i] = peso
    return vetor

trilhas_config = {
    "Desenvolvedor Full Stack": {
        "areas": ["Programação"], "niveis": {"Programação": 3}, "pesos": None,
        "descricao": "Domine front-end, back-end e banco de dados",
        "duracao": "8 meses", "cursos_chave": ["JavaScript", "React.js", "Node.js", "SQL"],
        "nivel_medio": 2.2
    },
    "Frontend Developer": {
        "areas": ["Programação", "Design UX/UI"], "niveis": {"Programação": 2, "Design UX/UI": 2},
        "pesos": {"Programação": 1.0, "Design UX/UI": 0.8},
        "descricao": "Crie interfaces web modernas e responsivas",
        "duracao": "5 meses", "cursos_chave": ["HTML5/CSS3", "React.js", "UX/UI", "Figma"],
        "nivel_medio": 1.8
    },
    "Backend Developer": {
        "areas": ["Programação"], "niveis": {"Programação": 3}, "pesos": None,
        "descricao": "Construa APIs robustas e sistemas escaláveis",
        "duracao": "6 meses", "cursos_chave": ["Node.js", "Python", "APIs RESTful", "SQL"],
        "nivel_medio": 2.0
    },
    "Cientista de Dados": {
        "areas": ["Ciência de Dados", "Programação"], "niveis": {"Ciência de Dados": 3, "Programação": 2},
        "pesos": {"Ciência de Dados": 1.0, "Programação": 0.7},
        "descricao": "Extraia insights e construa modelos preditivos",
        "duracao": "10 meses", "cursos_chave": ["Python", "Machine Learning", "Estatística", "SQL"],
        "nivel_medio": 2.3
    },
    "Engenheiro de ML": {
        "areas": ["Ciência de Dados", "Programação"], "niveis": {"Ciência de Dados": 3, "Programação": 3},
        "pesos": {"Ciência de Dados": 1.0, "Programação": 1.0},
        "descricao": "Coloque modelos de Machine Learning em produção",
        "duracao": "9 meses", "cursos_chave": ["MLOps", "Deep Learning", "Cloud", "Docker"],
        "nivel_medio": 2.5
    },
    "Analista de Dados": {
        "areas": ["Ciência de Dados"], "niveis": {"Ciência de Dados": 2}, "pesos": None,
        "descricao": "Analise dados e crie dashboards",
        "duracao": "4 meses", "cursos_chave": ["SQL", "Power BI", "Python", "Estatística"],
        "nivel_medio": 1.5
    },
    "UX/UI Designer": {
        "areas": ["Design UX/UI"], "niveis": {"Design UX/UI": 3}, "pesos": None,
        "descricao": "Crie experiências digitais centradas no usuário",
        "duracao": "6 meses", "cursos_chave": ["Figma", "UX Research", "Design System"],
        "nivel_medio": 2.0
    },
    "Product Designer": {
        "areas": ["Design UX/UI", "Marketing Digital"], "niveis": {"Design UX/UI": 3, "Marketing Digital": 2},
        "pesos": {"Design UX/UI": 1.0, "Marketing Digital": 0.6},
        "descricao": "Una design e estratégia de produto",
        "duracao": "7 meses", "cursos_chave": ["UX Design", "Product Strategy", "User Research"],
        "nivel_medio": 2.1
    },
    "Especialista em Cybersegurança": {
        "areas": ["Cybersegurança", "Programação"], "niveis": {"Cybersegurança": 3, "Programação": 2},
        "pesos": {"Cybersegurança": 1.0, "Programação": 0.8},
        "descricao": "Proteja sistemas, redes e dados",
        "duracao": "9 meses", "cursos_chave": ["Ethical Hacking", "Segurança", "Criptografia"],
        "nivel_medio": 2.3
    },
    "Security Analyst": {
        "areas": ["Cybersegurança"], "niveis": {"Cybersegurança": 2}, "pesos": None,
        "descricao": "Monitore e responda a incidentes",
        "duracao": "5 meses", "cursos_chave": ["SIEM", "Vulnerabilidades", "Forensics"],
        "nivel_medio": 1.6
    },
    "Marketing Digital Avançado": {
        "areas": ["Marketing Digital"], "niveis": {"Marketing Digital": 3}, "pesos": None,
        "descricao": "Domine estratégias digitais de crescimento",
        "duracao": "7 meses", "cursos_chave": ["SEO", "Google Ads", "Social Media", "Analytics"],
        "nivel_medio": 2.0
    },
    "Growth Hacker": {
        "areas": ["Marketing Digital", "Ciência de Dados"], "niveis": {"Marketing Digital": 3, "Ciência de Dados": 2},
        "pesos": {"Marketing Digital": 1.0, "Ciência de Dados": 0.7},
        "descricao": "Combine marketing e dados para crescer",
        "duracao": "8 meses", "cursos_chave": ["Growth Hacking", "A/B Testing", "Analytics"],
        "nivel_medio": 2.2
    },
    "DevOps Engineer": {
        "areas": ["Programação", "Cybersegurança"], "niveis": {"Programação": 3, "Cybersegurança": 2},
        "pesos": {"Programação": 1.0, "Cybersegurança": 0.7},
        "descricao": "Automatize infraestrutura e deployment",
        "duracao": "7 meses", "cursos_chave": ["Docker", "Kubernetes", "CI/CD", "Cloud"],
        "nivel_medio": 2.4
    },
    "Cloud Architect": {
        "areas": ["Programação", "Cybersegurança"], "niveis": {"Programação": 3, "Cybersegurança": 3},
        "pesos": {"Programação": 1.0, "Cybersegurança": 0.9},
        "descricao": "Projete arquiteturas escaláveis na nuvem",
        "duracao": "9 meses", "cursos_chave": ["AWS/Azure", "Kubernetes", "Terraform"],
        "nivel_medio": 2.6
    },
    "Product Manager Digital": {
        "areas": ["Marketing Digital", "Design UX/UI", "Programação"],
        "niveis": {"Marketing Digital": 3, "Design UX/UI": 2, "Programação": 1},
        "pesos": {"Marketing Digital": 1.0, "Design UX/UI": 0.8, "Programação": 0.5},
        "descricao": "Gerencie produtos digitais",
        "duracao": "8 meses", "cursos_chave": ["Product Strategy", "UX Research", "Agile"],
        "nivel_medio": 2.1
    }
}

trilhas = {}
for nome, config in trilhas_config.items():
    vetor = criar_vetor_trilha(config["areas"], config["niveis"], config.get("pesos"))
    trilhas[nome] = {
        "vetor": vetor, "descricao": config["descricao"],
        "duracao": config["duracao"], "cursos_chave": config["cursos_chave"],
        "nivel_medio": config["nivel_medio"]
    }

# =====================================================
# 3. FUNÇÕES DO ALGORITMO
# =====================================================

def respostas_para_vetor(respostas):
    vetor = [0] * 150
    mapeamento = {
        "programacao_nivel": "Programação", "dados_nivel": "Ciência de Dados",
        "design_nivel": "Design UX/UI", "seguranca_nivel": "Cybersegurança",
        "marketing_nivel": "Marketing Digital"
    }
    for campo, area in mapeamento.items():
        nivel = respostas.get(campo, 0)
        if nivel > 0 and area in areas_conhecimento:
            config = areas_conhecimento[area]
            inicio = config["inicio"]
            fim = inicio + (nivel * 10)
            for i in range(inicio, fim):
                vetor[i] = 1
    return vetor

def calcular_nivel_usuario(respostas):
    niveis = [respostas.get(campo, 0) for campo in ["programacao_nivel", "dados_nivel", "design_nivel", "seguranca_nivel", "marketing_nivel"] if respostas.get(campo, 0) > 0]
    return round(sum(niveis) / len(niveis), 1) if niveis else 1

def recomendar_trilhas(respostas, top_n=5):
    vetor_usuario = respostas_para_vetor(respostas)
    nomes_trilhas = list(trilhas.keys())
    matriz_trilhas = np.array([trilhas[nome]["vetor"] for nome in nomes_trilhas])
    vetor_usuario_np = np.array(vetor_usuario).reshape(1, -1)
    similaridades = cosine_similarity(vetor_usuario_np, matriz_trilhas)[0]
    recomendacoes = []
    for i, nome in enumerate(nomes_trilhas):
        if similaridades[i] > 0:
            recomendacoes.append({
                "trilha": nome, "similaridade": round(similaridades[i] * 100, 2),
                "descricao": trilhas[nome]["descricao"], "duracao": trilhas[nome]["duracao"],
                "cursos_chave": trilhas[nome]["cursos_chave"], "nivel_medio": trilhas[nome]["nivel_medio"]
            })
    recomendacoes.sort(key=lambda x: x["similaridade"], reverse=True)
    return recomendacoes[:top_n]

# =====================================================
# 4. MATÉRIAS E ESPECIALIZAÇÕES
# =====================================================

materias = {
    "Programação": {
        "icone": "💻",
        "especializacoes": [
            "Desenvolvimento Web Front-end", "Desenvolvimento Web Back-end", "Desenvolvimento Mobile",
            "Desenvolvimento de Jogos", "Programação de Sistemas Embarcados", "Desenvolvimento Desktop",
            "Programação Funcional", "Programação Orientada a Objetos", "Desenvolvimento de APIs",
            "DevOps e Automação"
        ]
    },
    "Ciência de Dados": {
        "icone": "📊",
        "especializacoes": [
            "Análise de Dados", "Machine Learning", "Deep Learning", "Processamento de Linguagem Natural",
            "Visão Computacional", "Engenharia de Dados", "Business Intelligence", "Data Visualization",
            "Estatística Avançada", "Big Data Analytics"
        ]
    },
    "Design UX/UI": {
        "icone": "🎨",
        "especializacoes": [
            "UX Research", "UI Design", "Product Design", "Design de Interação",
            "Design de Serviços", "Design de Interfaces Mobile", "Design System", "Motion Design",
            "Acessibilidade Digital", "Design Thinking"
        ]
    },
    "Cybersegurança": {
        "icone": "🔒",
        "especializacoes": [
            "Ethical Hacking", "Segurança de Redes", "Segurança em Aplicações Web", "Criptografia",
            "Forensics Computacional", "Segurança em Nuvem", "Governança e Compliance",
            "Análise de Vulnerabilidades", "Resposta a Incidentes", "Segurança em IoT"
        ]
    },
    "Marketing Digital": {
        "icone": "📈",
        "especializacoes": [
            "SEO e SEM", "Social Media Marketing", "Email Marketing", "Content Marketing",
            "Inbound Marketing", "Marketing de Influência", "E-commerce Marketing", "Marketing Analytics",
            "Growth Hacking", "Marketing Automation"
        ]
    },
    "Cloud Computing": {
        "icone": "☁️",
        "especializacoes": [
            "AWS Solutions Architect", "Microsoft Azure", "Google Cloud Platform", "DevOps na Nuvem",
            "Serverless Architecture", "Cloud Security", "Kubernetes e Containers",
            "Infraestrutura como Código", "Migração para Nuvem", "Cloud FinOps"
        ]
    }
}

# =====================================================
# 5. ENDPOINTS DA API
# =====================================================

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "cursos_total": 150, "trilhas_total": len(trilhas), "versao": "2.0"})

@app.route('/questionario/perguntas', methods=['GET'])
def get_perguntas():
    perguntas = []
    for materia, dados in materias.items():
        perguntas.append({
            "id": f"{materia.lower().replace(' ', '_')}_nivel",
            "area": materia,
            "icone": dados["icone"],
            "pergunta": f"Qual seu nível de conhecimento em {materia}?",
            "opcoes": [
                {"valor": 0, "label": "Não tenho conhecimento"},
                {"valor": 1, "label": "Iniciante (conheço conceitos básicos)"},
                {"valor": 2, "label": "Intermediário (já apliquei em projetos)"},
                {"valor": 3, "label": "Avançado (trabalho/estudo há anos)"}
            ]
        })
    return jsonify({"perguntas": perguntas, "especializacoes": materias})

@app.route('/questionario/recomendar', methods=['POST'])
def recomendar():
    try:
        respostas = request.json
        for campo in ["programacao_nivel", "dados_nivel", "design_nivel", "seguranca_nivel", "marketing_nivel"]:
            if campo not in respostas:
                respostas[campo] = 0
        nivel_usuario = calcular_nivel_usuario(respostas)
        recomendacoes = recomendar_trilhas(respostas)
        return jsonify({"success": True, "nivel_usuario": nivel_usuario, "recomendacoes": recomendacoes})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/trilhas', methods=['GET'])
def listar_trilhas():
    return jsonify([{"nome": nome, "descricao": info["descricao"], "duracao": info["duracao"], "nivel_medio": info["nivel_medio"]} for nome, info in trilhas.items()])

# =====================================================
# 6. INICIALIZAÇÃO
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