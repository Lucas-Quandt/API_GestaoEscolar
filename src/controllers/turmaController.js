const TurmaRepository = require('../repositories/turmaRepository');

const listarTurmas = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const turmas = await PedidoRepository.getAllTurmas(limit, offset);
        
        res.json({
            paginaAtual: page,
            itensPorPagina: limit,
            quantidadeRetornada: pedidos.length,
            dados: pedidos
        });
    } catch (erro) {
        console.error('Erro ao buscar turmas:', erro.message);
        res.status(500).json({ mensagem: 'Erro interno ao buscar turma' });
    }
};

const buscarTurmaPorAluno = async (req, res) => {
    try {
        const aluno_id = req.params.pessoa_id;
        const turmas = await TurmaRepository.getTurmasByAlunoId(aluno_id);
        
        if (tumas.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhuma turma encontrado para esta aluno.' });
        }
        
        res.json(alunos);
    } catch (erro) {
        console.error('Erro ao buscar turma por aluno:', erro.message);
        res.status(500).json({ mensagem: 'Erro interno ao buscar turmas' });
    }
};

const criarTurma = async (req, res) => {
    try {
        const { aluno_id, curso_id, data_matricula } = req.body;
        
        // Valida se os dados chegaram
        if (!aluno_id || !curso_id || !data_matricula) {
            return res.status(400).json({ mensagem: 'aluno_id, curso_id e data_matricula são obrigatórios' });
        }

        // Valida a quantidade
        if (data_matricula <= 0) {
            return res.status(400).json({ mensagem: 'A quantidade deve ser maior que zero' });
        }

        const novoTurma = await TurmaRepository.createTurma(aluno_id, curso_id, data_matricula);
        res.status(201).json(novoTurma);
    } catch (erro) {
        console.error('Erro ao criar turma:', erro.message);
        
        // O código 23503 é o erro do PostgreSQL para Violação de Chave Estrangeira
        // Isso acontece se o usuário tentar comprar com um pessoa_id ou produto_id que não existe.
        if (erro.code === '23503') {
            return res.status(404).json({ mensagem: 'o aluno ou o curso informado não existe.' });
        }
        res.status(500).json({ mensagem: 'Erro ao cadastrar turma' });
    }
};

module.exports = {
    listarTurmas,
    buscarTurmaPorAluno,
    criarTurma
};