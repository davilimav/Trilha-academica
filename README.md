
# 🚀 Trilha Acadêmica

<p align="center">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow" />
  <img src="https://img.shields.io/badge/backend-Node.js-green" />
  <img src="https://img.shields.io/badge/frontend-JavaScript-blue" />
  <img src="https://img.shields.io/badge/machine%20learning-Python-red" />
  <img src="https://img.shields.io/badge/database-MySQL-orange" />
  <img src="https://img.shields.io/badge/license-MIT-lightgrey" />
</p>

<p align="center">
  Plataforma inteligente de recomendação de cursos com base em perfil e nível de conhecimento.
</p>

---

## 🎯 Visão Geral

O **Trilha Acadêmica** é uma plataforma fullstack que utiliza **Machine Learning** para sugerir trilhas de aprendizado personalizadas.

A proposta é transformar dados do usuário em **decisões inteligentes de aprendizado**, entregando recomendações precisas e progressivas.

---

## 🧠 Arquitetura

```mermaid
flowchart TD
    A[Frontend] --> B[Backend API - Node.js]
    B --> C[Machine Learning API - Python]
    B --> D[(MySQL Database)]
````

---

## ✨ Funcionalidades

| Feature         | Descrição                         |
| --------------- | --------------------------------- |
| 🔐 Autenticação | Sistema seguro com JWT            |
| 📊 Dashboard    | Progresso e métricas do usuário   |
| 🎓 Catálogo     | Cursos organizados por área       |
| 🤖 Recomendação | Algoritmo baseado em similaridade |
| 🏆 Gamificação  | Pontos, níveis e conquistas       |
| 📄 Currículo    | Exportação em PDF                 |
| 👑 Admin        | Painel com estatísticas           |

---

## 🛠️ Stack Tecnológica

### Frontend

* HTML5
* CSS3 (variáveis globais)
* JavaScript
* Chart.js
* html2pdf.js

### Backend

* Node.js
* Express
* JWT
* bcryptjs
* multer
* nodemailer

### Machine Learning

* Python
* Flask
* scikit-learn
* NumPy

### Banco de Dados

* MySQL (Clever Cloud)

### Deploy

* Render
* Clever Cloud

---

## 📁 Estrutura do Projeto

```bash
trilha-academica/
├── config/
├── controllers/
├── frontend/
├── middlewares/
├── routes/
├── services/
├── ml_api.py
├── server.js
├── package.json
└── README.md
```

---

## ⚙️ Setup Local

### Pré-requisitos

* Node.js 18+
* Python 3.11+
* MySQL

---

### Instalação

```bash
git clone https://github.com/Caiogomes4567/trilha_academica.git
cd trilha_academica/trilha-academica/trilha-academica
npm install
```

---

### Configuração

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=usuario
DB_PASSWORD=senha
DB_NAME=trilha_academica
JWT_SECRET=secret
NODE_ENV=development
```

---

### Execução

```bash
# Backend
node server.js

# Machine Learning API
pip install -r requirements.txt
python ml_api.py
```

---

## 🌐 Endpoints Principais

```http
POST   /api/auth/login
GET    /api/auth/me
GET    /api/cursos/areas
POST   /api/progresso/concluir-curso
GET    /api/recomendacao/recomendacoes
GET    /api/admin/dashboard/stats
```

---

## 🤖 Sistema de Recomendação

O modelo utiliza:

* Vetorização de perfil
* Similaridade de cosseno
* Classificação de nível

Resultado:

* Recomendações personalizadas
* Percentual de compatibilidade
* Evolução progressiva do usuário

---

## 🚀 Deploy

* API Principal:
  [https://trilha-academica-api.onrender.com](https://trilha-academica-api.onrender.com)

* API ML:
  [https://trilha-academica-ml.onrender.com](https://trilha-academica-ml.onrender.com)

---

## ⚠️ Troubleshooting

| Problema          | Solução            |
| ----------------- | ------------------ |
| Banco não conecta | Verificar `.env`   |
| ML não responde   | Validar API Python |
| Token expirado    | Reautenticar       |

---

## 🔮 Roadmap

* [ ] Refresh Token
* [ ] OAuth (Google/GitHub)
* [ ] Certificados automáticos
* [ ] Avaliações de cursos
* [ ] Dark Mode
* [ ] PWA
* [ ] Mobile App

---

## 📄 Licença

MIT License

---

## 💎 Diferenciais

* Arquitetura desacoplada (Node + Python)
* Integração real com Machine Learning
* Estrutura escalável
* Aplicação pronta para produção

```
