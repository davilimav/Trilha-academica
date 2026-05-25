// data/cursosConteudo.js
const cursosConteudo = {
    // ============ BANCO DE DADOS ============
    "Introdução a Banco de Dados": {
        descricao: "Aprenda os fundamentos de banco de dados relacionais, desde conceitos básicos até modelagem de dados. Ideal para quem está começando na área de dados.",
        duracao: "20h",
        nivel: "Iniciante",
        topicos: [
            "O que é um banco de dados?",
            "Modelo relacional",
            "Tipos de dados",
            "Chaves primárias e estrangeiras",
            "Normalização básica"
        ],
        projetos: ["Modelagem de um sistema de biblioteca", "CRUD básico"],
        pre_requisitos: ["Lógica de programação básica"],
        certificado: true,
        video_aulas: 8,
        exercicios: 15
    },
    "SQL Básico": {
        descricao: "Domine os comandos fundamentais do SQL para consultar e manipular dados em banco de dados relacionais.",
        duracao: "25h",
        nivel: "Iniciante",
        topicos: [
            "SELECT básico",
            "Filtros com WHERE",
            "ORDER BY",
            "INSERT, UPDATE, DELETE",
            "Funções agregadas (COUNT, SUM, AVG)"
        ],
        projetos: ["Consultas em base de vendas", "Relatórios simples"],
        pre_requisitos: ["Lógica básica"],
        certificado: true,
        video_aulas: 10,
        exercicios: 20
    },
    "SQL Avançado": {
        descricao: "Avançe no SQL com consultas complexas, joins avançados, subqueries e otimização de queries.",
        duracao: "35h",
        nivel: "Intermediário",
        topicos: [
            "Joins (INNER, LEFT, RIGHT, FULL)",
            "Subqueries",
            "CTE (Common Table Expressions)",
            "Window Functions",
            "Índices e performance"
        ],
        projetos: ["Data Warehouse", "Relatórios complexos", "Otimização de queries"],
        pre_requisitos: ["SQL Básico"],
        certificado: true,
        video_aulas: 14,
        exercicios: 25
    },

    // ============ DESENVOLVIMENTO WEB ============
    "HTML5 e CSS3": {
        descricao: "Aprenda do zero a criar websites modernos e responsivos com HTML5 e CSS3. Construa sua base para se tornar um desenvolvedor front-end.",
        duracao: "20h",
        nivel: "Iniciante",
        topicos: [
            "Estrutura HTML",
            "Semântica HTML5",
            "Flexbox",
            "Grid Layout",
            "Responsividade com Media Queries",
            "Animations e Transitions"
        ],
        projetos: ["Portfólio pessoal", "Landing page", "Clone de site"],
        pre_requisitos: ["Nenhum"],
        certificado: true,
        video_aulas: 12,
        exercicios: 18
    },
    "JavaScript Básico": {
        descricao: "Fundamentos do JavaScript: variáveis, funções, arrays, objetos e manipulação do DOM. Base para qualquer framework front-end.",
        duracao: "25h",
        nivel: "Iniciante",
        topicos: [
            "Variáveis e tipos (var, let, const)",
            "Funções e escopo",
            "Arrays e métodos",
            "Objetos",
            "Manipulação do DOM",
            "Eventos"
        ],
        projetos: ["Calculadora", "Lista de tarefas", "Jogo da velha"],
        pre_requisitos: ["HTML/CSS básico"],
        certificado: true,
        video_aulas: 12,
        exercicios: 22
    },
    "React.js": {
        descricao: "Desenvolva aplicações web modernas com React.js, o framework mais popular do mercado. Aprenda componentes, hooks e state management.",
        duracao: "40h",
        nivel: "Intermediário",
        topicos: [
            "Componentes funcionais",
            "Props e estado",
            "Hooks (useState, useEffect)",
            "Context API",
            "React Router DOM",
            "Custom Hooks"
        ],
        projetos: ["Todo App", "E-commerce básico", "Dashboard interativo"],
        pre_requisitos: ["JavaScript ES6+", "HTML/CSS"],
        certificado: true,
        video_aulas: 20,
        exercicios: 25
    },
    "TypeScript": {
        descricao: "Aprenda TypeScript e leve seu JavaScript para o próximo nível com tipagem estática e recursos avançados.",
        duracao: "25h",
        nivel: "Intermediário",
        topicos: [
            "Tipos básicos",
            "Interfaces e Types",
            "Classes e herança",
            "Generics",
            "Decorators",
            "Type Guards"
        ],
        projetos: ["API com TypeScript", "Aplicação React + TypeScript"],
        pre_requisitos: ["JavaScript avançado"],
        certificado: true,
        video_aulas: 12,
        exercicios: 20
    },
    "Next.js": {
        descricao: "Construa aplicações React full-stack com Next.js, incluindo SSR, SSG, API routes e mais.",
        duracao: "35h",
        nivel: "Intermediário",
        topicos: [
            "Pages Router vs App Router",
            "SSR e SSG",
            "API Routes",
            "Image Optimization",
            "Middleware",
            "Autenticação"
        ],
        projetos: ["Blog com CMS", "E-commerce completo", "Dashboard admin"],
        pre_requisitos: ["React.js", "JavaScript avançado"],
        certificado: true,
        video_aulas: 18,
        exercicios: 22
    },
    "React Avançado": {
        descricao: "Domine as técnicas avançadas de React para criar aplicações performáticas e escaláveis. Inclui Redux, Next.js e testes.",
        duracao: "50h",
        nivel: "Avançado",
        topicos: [
            "Redux Toolkit",
            "Next.js avançado",
            "Performance optimization",
            "Testes com Testing Library",
            "Custom Hooks avançados",
            "Server Components"
        ],
        projetos: ["Rede social", "Sistema de e-commerce completo", "Dashboard real-time"],
        pre_requisitos: ["React básico", "TypeScript"],
        certificado: true,
        video_aulas: 25,
        exercicios: 30
    },

    // ============ BACKEND ============
    "Node.js Fundamentos": {
        descricao: "Aprenda os fundamentos do Node.js para construir aplicações backend escaláveis.",
        duracao: "25h",
        nivel: "Iniciante",
        topicos: [
            "Event Loop",
            "Módulos",
            "File System",
            "HTTP nativo",
            "NPM",
            "Debugging"
        ],
        projetos: ["CLI tool", "Servidor HTTP básico"],
        pre_requisitos: ["JavaScript básico"],
        certificado: true,
        video_aulas: 12,
        exercicios: 18
    },
    "Node.js com TypeScript": {
        descricao: "Construa APIs robustas e escaláveis usando Node.js com TypeScript e as melhores práticas.",
        duracao: "45h",
        nivel: "Intermediário",
        topicos: [
            "TypeScript: tipos e interfaces",
            "Express.js",
            "JWT Autenticação",
            "Prisma ORM",
            "Testes com Jest",
            "Validação com Zod"
        ],
        projetos: ["API REST completa", "Sistema de autenticação", "Blog API"],
        pre_requisitos: ["JavaScript avançado", "Node.js básico"],
        certificado: true,
        video_aulas: 22,
        exercicios: 28
    },

    // ============ CIÊNCIA DE DADOS ============
    "Python para Dados": {
        descricao: "Aprenda Python focado em análise de dados. Domine as bibliotecas essenciais para ciência de dados.",
        duracao: "30h",
        nivel: "Iniciante",
        topicos: [
            "Python básico",
            "NumPy",
            "Pandas",
            "Visualização com Matplotlib",
            "Tratamento de dados"
        ],
        projetos: ["Análise exploratória de dados", "Limpeza de dataset"],
        pre_requisitos: ["Lógica de programação"],
        certificado: true,
        video_aulas: 15,
        exercicios: 20
    },
    "Machine Learning com Python": {
        descricao: "Aprenda os principais algoritmos de Machine Learning para criar modelos preditivos usando scikit-learn.",
        duracao: "50h",
        nivel: "Intermediário",
        topicos: [
            "Pandas e NumPy avançado",
            "Scikit-learn",
            "Regressão linear",
            "Classificação",
            "Clusterização",
            "Validação de modelos"
        ],
        projetos: ["Previsão de preços de imóveis", "Classificação de clientes", "Análise de churn"],
        pre_requisitos: ["Python básico", "Estatística básica"],
        certificado: true,
        video_aulas: 25,
        exercicios: 30
    },
    "Deep Learning": {
        descricao: "Avançe para deep learning com TensorFlow e PyTorch. Crie redes neurais para problemas complexos.",
        duracao: "60h",
        nivel: "Avançado",
        topicos: [
            "Redes neurais",
            "TensorFlow/Keras",
            "PyTorch",
            "CNN (Redes convolucionais)",
            "RNN/LSTM",
            "Transfer Learning"
        ],
        projetos: ["Classificação de imagens", "Processamento de texto", "Geração de imagens"],
        pre_requisitos: ["Machine Learning", "Python avançado"],
        certificado: true,
        video_aulas: 30,
        exercicios: 35
    },

    // ============ DEVOPS ============
    "Docker Fundamentos": {
        descricao: "Aprenda Docker do zero: containers, imagens, Dockerfile e docker-compose para ambientes isolados.",
        duracao: "20h",
        nivel: "Iniciante",
        topicos: [
            "O que são containers",
            "Imagens e Dockerfile",
            "Docker Compose",
            "Volumes",
            "Networking",
            "Registry"
        ],
        projetos: ["Containerizar aplicação Node.js", "Ambiente com Docker Compose"],
        pre_requisitos: ["Linux básico"],
        certificado: true,
        video_aulas: 10,
        exercicios: 15
    },
    "DevOps na Prática": {
        descricao: "Automatize infraestrutura e deployment com ferramentas modernas de DevOps: Docker, Kubernetes, CI/CD e mais.",
        duracao: "45h",
        nivel: "Avançado",
        topicos: [
            "Docker avançado",
            "Kubernetes",
            "CI/CD com GitHub Actions",
            "Terraform",
            "Monitoramento com Prometheus",
            "GitOps"
        ],
        projetos: ["Pipeline CI/CD completo", "Cluster Kubernetes", "Infra as Code"],
        pre_requisitos: ["Linux", "Git avançado", "Docker"],
        certificado: true,
        video_aulas: 22,
        exercicios: 25
    },

    // ============ SEGURANÇA ============
    "Ethical Hacking": {
        descricao: "Aprenda técnicas de hacking ético para identificar e corrigir vulnerabilidades em sistemas.",
        duracao: "45h",
        nivel: "Intermediário",
        topicos: [
            "Reconhecimento",
            "Scanning de redes",
            "Enumeração",
            "Exploração de vulnerabilidades",
            "Pós-execução",
            "Relatórios"
        ],
        projetos: ["Pentest em aplicação web", "CTF challenges", "Relatório de vulnerabilidades"],
        pre_requisitos: ["Redes", "Linux"],
        certificado: true,
        video_aulas: 22,
        exercicios: 28
    },

    // ============ DESIGN ============
    "Figma Básico": {
        descricao: "Aprenda a usar o Figma para criar interfaces modernas, protótipos e design systems.",
        duracao: "20h",
        nivel: "Iniciante",
        topicos: [
            "Interface do Figma",
            "Frames e componentes",
            "Auto Layout",
            "Prototipagem",
            "Variants",
            "Plugins úteis"
        ],
        projetos: ["Design de app mobile", "Design de dashboard", "Protótipo interativo"],
        pre_requisitos: ["Nenhum"],
        certificado: true,
        video_aulas: 10,
        exercicios: 15
    },
    "UX/UI Design": {
        descricao: "Domine os princípios de UX Research e UI Design para criar produtos centrados no usuário.",
        duracao: "35h",
        nivel: "Intermediário",
        topicos: [
            "UX Research",
            "Personas e jornada",
            "Wireframing",
            "UI Design",
            "Design System",
            "Testes de usabilidade"
        ],
        projetos: ["Projeto completo de UX/UI", "Redesign de app", "Design System"],
        pre_requisitos: ["Figma básico"],
        certificado: true,
        video_aulas: 18,
        exercicios: 22
    },

    // ============ MARKETING ============
    "SEO Avançado": {
        descricao: "Domine técnicas avançadas de SEO para rankear nos buscadores e aumentar o tráfego orgânico.",
        duracao: "30h",
        nivel: "Intermediário",
        topicos: [
            "Keyword Research",
            "On-page SEO",
            "Technical SEO",
            "Link Building",
            "SEO Analytics",
            "Local SEO"
        ],
        projetos: ["Auditoria SEO completa", "Estratégia de conteúdo", "Otimização de site"],
        pre_requisitos: ["Marketing digital básico"],
        certificado: true,
        video_aulas: 15,
        exercicios: 20
    },
    "Google Ads": {
        descricao: "Aprenda a criar e otimizar campanhas no Google Ads para gerar leads e vendas.",
        duracao: "25h",
        nivel: "Iniciante",
        topicos: [
            "Estrutura de campanhas",
            "Pesquisa de palavras-chave",
            "Anúncios de pesquisa",
            "Display e YouTube",
            "Remarketing",
            "Análise de resultados"
        ],
        projetos: ["Campanha Google Ads completa", "Otimização de campanha"],
        pre_requisitos: ["Marketing digital básico"],
        certificado: true,
        video_aulas: 12,
        exercicios: 18
    }
};

module.exports = { cursosConteudo };