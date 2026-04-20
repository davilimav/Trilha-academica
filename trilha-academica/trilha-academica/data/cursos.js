// =====================================================
// CATÁLOGO DE CURSOS POR ÁREA E SUBÁREA
// =====================================================

const areasConhecimento = {
    "Tecnologia da Informação": {
        icone: "💻",
        subareas: {
            "Banco de Dados": {
                icone: "🗄️",
                cursos: {
                    "Iniciante": [
                        "Introdução a Banco de Dados",
                        "SQL Básico",
                        "Modelagem de Dados",
                        "MySQL Fundamentos",
                        "Consultas Simples"
                    ],
                    "Intermediário": [
                        "Joins e Subconsultas",
                        "Otimização de Queries",
                        "Procedures e Functions",
                        "Triggers e Events",
                        "Backup e Recovery"
                    ],
                    "Avançado": [
                        "Administração de Banco de Dados",
                        "Performance Tuning",
                        "Replicação e Cluster",
                        "NoSQL e Big Data",
                        "Data Warehousing"
                    ]
                }
            },
            "Desenvolvimento Web Front-end": {
                icone: "🎨",
                cursos: {
                    "Iniciante": [
                        "HTML5 e CSS3",
                        "JavaScript Básico",
                        "Responsive Design",
                        "Figma para Devs",
                        "Git e GitHub"
                    ],
                    "Intermediário": [
                        "React.js",
                        "TypeScript",
                        "Next.js Fundamentos",
                        "Tailwind CSS",
                        "Testes com Jest"
                    ],
                    "Avançado": [
                        "React Avançado",
                        "WebAssembly",
                        "PWA",
                        "Web Components",
                        "Performance Web"
                    ]
                }
            },
            "Backend Development": {
                icone: "⚙️",
                cursos: {
                    "Iniciante": [
                        "Node.js Fundamentos",
                        "APIs RESTful",
                        "Express.js",
                        "Autenticação JWT",
                        "MongoDB Básico"
                    ],
                    "Intermediário": [
                        "Microservices",
                        "GraphQL",
                        "WebSockets",
                        "Docker Básico",
                        "Redis Cache"
                    ],
                    "Avançado": [
                        "Kubernetes",
                        "Arquitetura de Sistemas",
                        "Serverless",
                        "Message Queues",
                        "CI/CD Pipeline"
                    ]
                }
            },
            "Ciência de Dados": {
                icone: "📊",
                cursos: {
                    "Iniciante": [
                        "Python para Dados",
                        "Pandas e NumPy",
                        "Estatística Básica",
                        "Visualização com Matplotlib",
                        "SQL para Análise"
                    ],
                    "Intermediário": [
                        "Machine Learning Básico",
                        "Feature Engineering",
                        "Data Cleaning",
                        "Power BI",
                        "Tableau"
                    ],
                    "Avançado": [
                        "Deep Learning",
                        "NLP",
                        "Big Data com Spark",
                        "MLOps",
                        "Data Engineering"
                    ]
                }
            },
            "DevOps": {
                icone: "🔄",
                cursos: {
                    "Iniciante": [
                        "Linux Fundamentos",
                        "Shell Script",
                        "Git Avançado",
                        "CI/CD Conceitos",
                        "Docker Fundamentos"
                    ],
                    "Intermediário": [
                        "Kubernetes Básico",
                        "Terraform",
                        "Ansible",
                        "Prometheus e Grafana",
                        "AWS Cloud"
                    ],
                    "Avançado": [
                        "Kubernetes Avançado",
                        "Service Mesh",
                        "GitOps",
                        "Security DevOps",
                        "Multi-cloud"
                    ]
                }
            },
            "Cybersegurança": {
                icone: "🔒",
                cursos: {
                    "Iniciante": [
                        "Fundamentos de Segurança",
                        "Criptografia Básica",
                        "Segurança de Redes",
                        "OWASP Top 10",
                        "Gestão de Senhas"
                    ],
                    "Intermediário": [
                        "Ethical Hacking",
                        "Pentest Web",
                        "Security Headers",
                        "Firewall e IDS",
                        "Incident Response"
                    ],
                    "Avançado": [
                        "Red Teaming",
                        "Malware Analysis",
                        "Forensics",
                        "Cloud Security",
                        "DevSecOps"
                    ]
                }
            }
        }
    },
    "Design e UX": {
        icone: "🎨",
        subareas: {
            "UX Research": {
                icone: "🔍",
                cursos: {
                    "Iniciante": ["Introdução ao UX", "Pesquisa com Usuários", "Personas", "Jornada do Usuário", "Testes de Usabilidade"],
                    "Intermediário": ["Análise de Dados Quali/Quanti", "Heurísticas de Nielsen", "A/B Testing", "Card Sorting", "Entrevistas"],
                    "Avançado": ["UX Strategy", "Design Ops", "UX Metrics", "UX Leadership", "Service Design"]
                }
            },
            "UI Design": {
                icone: "🖌️",
                cursos: {
                    "Iniciante": ["Figma Básico", "Teoria das Cores", "Tipografia", "Grid e Layout", "Iconografia"],
                    "Intermediário": ["Design System", "Componentização", "Prototipagem Avançada", "Microinterações", "Acessibilidade"],
                    "Avançado": ["Motion Design", "UI Animation", "3D Design", "UI para AR/VR", "Design Tokens"]
                }
            },
            "Product Design": {
                icone: "📱",
                cursos: {
                    "Iniciante": ["Product Thinking", "MVP", "User Stories", "Wireframing", "MVP Validation"],
                    "Intermediário": ["Product Strategy", "OKRs", "Product Discovery", "Feature Prioritization", "Roadmap"],
                    "Avançado": ["Product Leadership", "Growth Product", "Metrics-driven Design", "Design Ops", "Product Analytics"]
                }
            }
        }
    },
    "Marketing Digital": {
        icone: "📈",
        subareas: {
            "SEO": {
                icone: "🔍",
                cursos: {
                    "Iniciante": ["SEO On-page", "Keyword Research", "Link Building", "SEO Técnico Básico", "Google Search Console"],
                    "Intermediário": ["SEO Avançado", "Local SEO", "E-commerce SEO", "SEO Internacional", "Analytics SEO"],
                    "Avançado": ["SEO Strategy", "Programmatic SEO", "SEO Automation", "SEO for AI", "Voice Search"]
                }
            },
            "Social Media": {
                icone: "📱",
                cursos: {
                    "Iniciante": ["Instagram Marketing", "Facebook Ads", "LinkedIn Strategy", "TikTok Marketing", "Conteúdo Visual"],
                    "Intermediário": ["Social Media Analytics", "Influencer Marketing", "Social Commerce", "Community Management", "Social Listening"],
                    "Avançado": ["Social Media Strategy", "Crisis Management", "Social ROI", "Platform Strategy", "Social Media Automation"]
                }
            },
            "Email Marketing": {
                icone: "✉️",
                cursos: {
                    "Iniciante": ["Email Marketing Básico", "Copywriting", "List Building", "Email Design", "A/B Testing"],
                    "Intermediário": ["Automação de Email", "Segmentação", "Email Analytics", "Deliverability", "Personalização"],
                    "Avançado": ["Email Strategy", "Lifecycle Marketing", "Email Ops", "Transactional Emails", "Email Compliance"]
                }
            }
        }
    }
};

module.exports = { areasConhecimento };