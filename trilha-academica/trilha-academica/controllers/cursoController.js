// cursoController.js - GERENCIAMENTO DE CURSOS

// Dados temporários para teste (até criar o arquivo de dados)
const areasConhecimento = {
    "Tecnologia da Informação": {
        icone: "💻",
        subareas: {
            "Banco de Dados": {
                icone: "🗄️",
                cursos: {
                    "Iniciante": ["Introdução a Banco de Dados", "SQL Básico"],
                    "Intermediário": ["Joins e Subconsultas", "Otimização de Queries"],
                    "Avançado": ["Administração de Banco de Dados", "Performance Tuning"]
                }
            },
            "Desenvolvimento Web": {
                icone: "🎨",
                cursos: {
                    "Iniciante": ["HTML5 e CSS3", "JavaScript Básico"],
                    "Intermediário": ["React.js", "TypeScript"],
                    "Avançado": ["React Avançado", "WebAssembly"]
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

// Detalhes do curso
const getCursoDetalhes = async (req, res) => {
    try {
        const { area, subarea, nivel, curso } = req.params;
        const areaDecodificada = decodeURIComponent(area);
        const subareaDecodificada = decodeURIComponent(subarea);
        const cursoDecodificado = decodeURIComponent(curso);
        
        res.json({
            nome: cursoDecodificado,
            area: areaDecodificada,
            subarea: subareaDecodificada,
            nivel: nivel,
            descricao: `Curso de ${cursoDecodificado} na área de ${areaDecodificada}`,
            duracao: nivel === 'Iniciante' ? '20h' : nivel === 'Intermediário' ? '40h' : '60h',
            certificado: true
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro ao obter detalhes' });
    }
};

module.exports = { listarAreas, listarSubareas, listarCursos, getCursoDetalhes };