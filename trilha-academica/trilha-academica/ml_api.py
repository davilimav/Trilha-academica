from flask import Flask, request, jsonify
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Base de usuários (simulada)
usuarios = [
    [1,1,0,0],  # User 1
    [1,1,1,0],  # User 2
    [1,0,0,0],  # User 3
]

@app.route('/recomendar', methods=['POST'])
def recomendar():
    novo_usuario = request.json['perfil']

    matriz = np.array(usuarios)

    similaridades = cosine_similarity([novo_usuario], matriz)[0]

    idx = np.argmax(similaridades)

    recomendacao = matriz[idx]

    return jsonify({
        "usuario_mais_parecido": int(idx),
        "similaridade": similaridades.tolist(),
        "recomendacao": recomendacao.tolist()
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)