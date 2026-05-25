from flask import Flask, request, jsonify
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import os

app = Flask(__name__)

# Base de usuários (simulada)
usuarios = [
    [1,1,0,0],  # User 1
    [1,1,1,0],  # User 2
    [1,0,0,0],  # User 3
]

@app.route('/recomendar', methods=['POST'])
def recomendar():
    try:
        novo_usuario = request.json.get('perfil', [0,0,0,0])
        
        matriz = np.array(usuarios)
        similaridades = cosine_similarity([novo_usuario], matriz)[0]
        idx = np.argmax(similaridades)
        recomendacao = matriz[idx]
        
        return jsonify({
            "usuario_mais_parecido": int(idx),
            "similaridade": similaridades.tolist(),
            "recomendacao": recomendacao.tolist()
        })
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/questionario/perguntas', methods=['GET'])
def get_perguntas():
    return jsonify({"perguntas": []})

@app.route('/questionario/recomendar', methods=['POST'])
def recomendar_questionario():
    try:
        dados = request.json
        
        perfil = [
            dados.get('programacao_nivel', 0),
            dados.get('dados_nivel', 0),
            dados.get('design_nivel', 0),
            dados.get('seguranca_nivel', 0),
            dados.get('marketing_nivel', 0)
        ]
        
        nivel_usuario = sum(perfil) / len(perfil) if perfil and sum(perfil) > 0 else 1
        
        recomendacoes = []
        if perfil[0] >= 2:
            recomendacoes.append({
                "trilha": "Programação Avançada", 
                "descricao": "Aprofunde seus conhecimentos em desenvolvimento de software",
                "similaridade": 85,
                "duracao": "40h"
            })
        if perfil[1] >= 2:
            recomendacoes.append({
                "trilha": "Ciência de Dados", 
                "descricao": "Análise e visualização de dados com Python",
                "similaridade": 80,
                "duracao": "50h"
            })
        if perfil[2] >= 2:
            recomendacoes.append({
                "trilha": "UX/UI Design", 
                "descricao": "Design de interfaces e experiência do usuário",
                "similaridade": 75,
                "duracao": "35h"
            })
        if perfil[3] >= 2:
            recomendacoes.append({
                "trilha": "Segurança Digital", 
                "descricao": "Fundamentos de cybersegurança",
                "similaridade": 70,
                "duracao": "45h"
            })
        if perfil[4] >= 2:
            recomendacoes.append({
                "trilha": "Marketing Digital", 
                "descricao": "Estratégias de marketing online",
                "similaridade": 65,
                "duracao": "30h"
            })
        
        # Se não tem nenhum nível >=2, recomenda cursos iniciantes
        if not recomendacoes:
            recomendacoes = [
                {
                    "trilha": "Introdução à Programação",
                    "descricao": "Comece sua jornada na programação",
                    "similaridade": 90,
                    "duracao": "20h"
                },
                {
                    "trilha": "Fundamentos de TI",
                    "descricao": "Conceitos básicos de tecnologia",
                    "similaridade": 85,
                    "duracao": "25h"
                }
            ]
        
        return jsonify({
            "success": True,
            "nivel_usuario": nivel_usuario,
            "recomendacoes": recomendacoes
        })
    except Exception as e:
        return jsonify({"success": False, "erro": str(e)}), 500

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "ML API is running"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
