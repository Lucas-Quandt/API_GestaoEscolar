const AlunoRepository = require('../repositories/alunoRepository');

const listarAlunos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const alunos = await PessoaRepository.getAllAlunos(limit, offset);
        
        res.json({
            paginaAtual: page,
            itensPorPagina: limit,
            quantidadeRetornada: alunos.length,
            dados: alunos
        });
    } catch (erro) {
        console.error('Erro ao buscar alunos:', erro.message);
        res.status(500).json({ mensagem: 'Erro interno ao buscar alunos' });
    }
};

const buscarAlunoPorId = async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await AlunoRepository.getAlunoById(id);
        
        // Verifica se o banco encontrou alguém
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Aluno não encontrado pelo ID' });
        }
        
        res.json(resultado.rows[0]); 
    } catch (erro) {
        console.error('Erro ao buscar aluno por ID:', erro.message);
        res.status(500).json({ mensagem: 'Erro interno' });
    }
};

const criarAluno = async (req, res) => {
    try {
        // Extrai os dados do corpo da requisição
        const { nome, email} = req.body;
        
        // Validação simples
        if (!nome || !email) {
            return res.status(400).json({ mensagem: 'Nome, email são obrigatórios' });
        }

        const novaAluno = await AlunoRepository.createAluno(nome, email);
        res.status(201).json(novaAluno);
    } catch (erro) {
        console.error('Erro ao criar aluno:', erro.message);
        
        // O código 23505 é o erro padrão do PostgreSQL para violação de regra UNIQUE
        if (erro.code === '23505') {
            return res.status(400).json({ mensagem: 'Este email já está cadastrado' });
        }
        res.status(500).json({ mensagem: 'Erro ao cadastrar Aluno' });
    }
};

// ACOPLAMENTO: Exporta o controlador
module.exports = {
    listarAlunos,
    buscarAlunoPorId,
    criarAluno
};