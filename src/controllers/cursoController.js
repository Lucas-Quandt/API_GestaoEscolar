const CursoRepository = require('../repositories/cursoRepository');

const listarCursos = async (req, res) => {
    try {
        // Captura da URL: http://localhost:3000/produtos?page=1&limit=10
        // Se o usuário não mandar nada, o padrão será página 1, com 10 itens.
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        // Matemática da paginação: (página - 1) * limite
        const offset = (page - 1) * limit;

        const cursos = await CursoRepository.getAllCursos(limit, offset);
        
        // Retornamos um objeto mais rico, avisando o usuário em qual página ele está
        res.json({
            paginaAtual: page,
            itensPorPagina: limit,
            quantidadeRetornada: produtos.length,
            dados: cursos
        });
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: 'Erro interno' });
    }
};

// Buscar por ID
const buscarCursoPorId = async (request, response) => {
    try {
        const { id } = request.params;
        const curso = await ProdutoRepository.getCursosByID(id);

        if (!curso) {
            return response.status(404).json({ mensagem: 'Curso não encontrado.' });
        }

        return response.json(curso);
    } catch (erro) {
        console.error(erro.message);
        return response.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
};

// Criar produto 
const criarCurso = async (request, response) => {
    try {
        const { nome, vaga} = request.body;

        if (!nome || vaga === undefined) {
            return response.status(400).json({ mensagem: 'Nome e vaga são obrigatórios.' });
        }

        const novoCurso = await CursoRepository.createCurso(nome, vaga);
        return response.status(201).json(novoCurso);
    } catch (erro) {
        console.error(erro.message);
        return response.status(500).json({ mensagem: 'Erro interno ao cadastrar curso.' });
    }
};

const atualizarCurso = async (req, res) => {
    try {
        const id = parseInt(req.params.id); // Tenta converter o ID da URL para número
        
        // 1ª Barreira: Verifica se o ID é realmente um número válido
        if (isNaN(id)) {
            return res.status(400).json({ mensagem: 'O ID informado na URL é inválido.' });
        }

        const { nome, vaga } = req.body;
        
        // 2ª Barreira: Impede a atualização incompleta
        if (!nome || !vaga) {
            return res.status(400).json({ 
                mensagem: 'Para atualizar, você deve enviar nome, vaga obrigatoriamente.' 
            });
        }
        
        const resultado = await CursoRepository.updateCurso(id, nome, vaga);
        
        // 3ª Barreira: Verifica se o produto realmente existia no banco
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Curso não encontrado no banco de dados.' });
        }
        
        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: 'Erro ao atualizar' });
    }
};

const deletarCurso = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ mensagem: 'O ID informado na URL é inválido.' });

        const resultado = await CursoRepository.deleteCurso(id);
        
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Curso não encontrado para exclusão' });
        }
        
        res.json({ 
            mensagem: 'Curso deletado com sucesso', 
            deletado: resultado.rows[0] 
        });
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: 'Erro ao deletar' });
    }
};

module.exports = {
    listarCursos,
    buscarCursoPorId,
    criarCurso,
    atualizarCurso,
    deletarCurso
};