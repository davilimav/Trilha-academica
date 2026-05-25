// controllers/cursoController.js - GERENCIAMENTO DE CURSOS
const { cursosConteudo } = require('../data/cursosConteudo');

// Dados das áreas e subáreas
const areasConhecimento = {
    "Tecnologia da Informação": {
        icone: "💻",
        subareas: {
            "Banco de Dados": {
                icone: "🗄️",
                cursos: {
                    "Iniciante": ["Introdução a Banco de Dados", "SQL Básico"],
                    "Intermediário": ["SQL Avançado"],
                    "Avançado": ["Administração de Banco de Dados", "Performance Tuning"]
                }
            },
            "Desenvolvimento Web Front-end": {
                icone: "🎨",
                cursos: {
                    "Iniciante": ["HTML5 e CSS3", "JavaScript Básico"],
                    "Intermediário": ["React.js", "TypeScript", "Next.js"],
                    "Avançado": ["React Avançado"]
                }
            },
            "Backend Development": {
                icone: "⚙️",
                cursos: {
                    "Iniciante": ["Node.js Fundamentos"],
                    "Intermediário": ["Node.js com TypeScript"],
                    "Avançado": ["Arquitetura de Microsserviços"]
                }
            },
            "Ciência de Dados": {
                icone: "📊",
                cursos: {
                    "Iniciante": ["Python para Dados"],
                    "Intermediário": ["Machine Learning com Python"],
                    "Avançado": ["Deep Learning"]
                }
            },
            "DevOps": {
                icone: "🔧",
                cursos: {
                    "Iniciante": ["Docker Fundamentos"],
                    "Intermediário": ["Kubernetes Básico"],
                    "Avançado": ["DevOps na Prática"]
                }
            },
            "Cybersegurança": {
                icone: "🔒",
                cursos: {
                    "Iniciante": ["Fundamentos de Segurança"],
                    "Intermediário": ["Ethical Hacking"],
                    "Avançado": ["DevSecOps"]
                }
            }
        }
    },
    "Design e UX": {
        icone: "🎨",
        subareas: {
            "UI Design": {
                icone: "🎨",
                cursos: {
                    "Iniciante": ["Figma Básico"],
                    "Intermediário": ["UX/UI Design"],
                    "Avançado": ["Design System Avançado"]
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
                    "Iniciante": ["SEO On-page"],
                    "Intermediário": ["SEO Avançado"],
                    "Avançado": ["SEO Strategy"]
                }
            },
            "Mídia Paga": {
                icone: "💰",
                cursos: {
                    "Iniciante": ["Google Ads"],
                    "Intermediário": ["Facebook Ads"],
                    "Avançado": ["Media Buying"]
                }
            }
        }
    }
};

// Listar todas as áreas
const listarAreas = async (req, res) => {
    try {
        const areas = Object.keys(areasConhecimento).map(nome => ({
            nome,
            icone: areasConhecimento[nome].icone,
            subareas: Object.keys(areasConhecimento[nome].subareas)
        }));
        res.json(areas);
    } catch (error) {
        console.error('Erro ao listar áreas:', error);
        res.status(500).json({ error: 'Erro ao listar áreas' });
    }
};

// Listar subáreas
const listarSubareas = async (req, res) => {
    try {
        const { area } = req.params;
        const areaDecodificada = decodeURIComponent(area);

        if (!areasConhecimento[areaDecodificada]) {
            return res.status(404).json({ error: 'Área não encontrada' });
        }

        const subareas = Object.keys(areasConhecimento[areaDecodificada].subareas).map(nome => ({
            nome,
            icone: areasConhecimento[areaDecodificada].subareas[nome].icone
        }));

        res.json(subareas);
    } catch (error) {
        console.error('Erro ao listar subáreas:', error);
        res.status(500).json({ error: 'Erro ao listar subáreas' });
    }
};

// Listar cursos
const listarCursos = async (req, res) => {
    try {
        const { area, subarea } = req.params;
        const areaDecodificada = decodeURIComponent(area);
        const subareaDecodificada = decodeURIComponent(subarea);

        if (!areasConhecimento[areaDecodificada] ||
            !areasConhecimento[areaDecodificada].subareas[subareaDecodificada]) {
            return res.status(404).json({ error: 'Subárea não encontrada' });
        }

        const cursos = areasConhecimento[areaDecodificada].subareas[subareaDecodificada].cursos;
        res.json(cursos);
    } catch (error) {
        console.error('Erro ao listar cursos:', error);
        res.status(500).json({ error: 'Erro ao listar cursos' });
    }
};

// Detalhes do curso (simples)
const getCursoDetalhes = async (req, res) => {
    try {
        const { area, subarea, nivel, curso } = req.params;
        const areaDecodificada = decodeURIComponent(area);
        const subareaDecodificada = decodeURIComponent(subarea);
        const cursoDecodificado = decodeURIComponent(curso);

        const conteudo = cursosConteudo[cursoDecodificado] || {
            descricao: `Curso de ${cursoDecodificado} na área de ${areaDecodificada}`,
            duracao: nivel === 'Iniciante' ? '20h' : nivel === 'Intermediário' ? '40h' : '60h',
            certificado: true
        };

        res.json({
            nome: cursoDecodificado,
            area: areaDecodificada,
            subarea: subareaDecodificada,
            nivel: nivel,
            descricao: conteudo.descricao,
            duracao: conteudo.duracao,
            certificado: conteudo.certificado
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro ao obter detalhes' });
    }
};

// Detalhes do curso com conteúdo completo
const getCursoDetalhesCompleto = async (req, res) => {
    try {
        const { area, subarea, nivel, curso } = req.params;
        const cursoDecodificado = decodeURIComponent(curso);

        const conteudo = cursosConteudo[cursoDecodificado] || {
            descricao: `Curso de ${cursoDecodificado}. Aprenda tudo sobre esta tecnologia com exercícios práticos e projetos reais.`,
            duracao: nivel === 'Iniciante' ? '20h' : nivel === 'Intermediário' ? '40h' : '60h',
            topicos: ["Fundamentos", "Prática", "Projetos", "Certificação"],
            projetos: ["Projeto prático", "Portfólio profissional"],
            pre_requisitos: ["Conhecimentos básicos da área"],
            certificado: true,
            video_aulas: 10,
            exercicios: 15
        };

        res.json({
            nome: cursoDecodificado,
            area: decodeURIComponent(area),
            subarea: decodeURIComponent(subarea),
            nivel: nivel,
            ...conteudo
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro ao obter detalhes' });
    }
};

module.exports = {
    listarAreas,
    listarSubareas,
    listarCursos,
    getCursoDetalhes,
    getCursoDetalhesCompleto
};