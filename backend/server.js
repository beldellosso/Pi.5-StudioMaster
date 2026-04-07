const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// --- CONEXÃO COM MONGODB ---
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("☁️ StudioMaster conectado ao MongoDB Atlas"))
.catch(err => console.error("❌ Erro ao conectar na Cloud:", err.message));

// --- MODELOS DE DADOS ---
const Servico = mongoose.model('Servico', new mongoose.Schema({
    nome: String,
    preco: Number,
    duracao_minutos: Number
}));

const Regiao = mongoose.model('Regiao', new mongoose.Schema({
    nome: String,
    adicional: Number
}));

const Agendamento = mongoose.model('Agendamento', new mongoose.Schema({
    cliente: { nome: String, email: String },
    servico: { nome: String, valor_base: Number },
    regiao: { nome: String, adicional: Number },
    data_hora: Date,
    valor_total: Number,
    status: { type: String, default: 'pendente' }, 
    observacoes: String
}));


const Usuario = mongoose.model('Usuario', new mongoose.Schema({
    nome: String,
    email: { type: String, unique: true, required: true },
    senha: { type: String, required: true },
    tipo: { type: String, enum: ['cliente', 'tatuador'], default: 'cliente' },
    telefone: String
}));

// --- POPULAÇÃO INICIAL (Seed) ---
mongoose.connection.once('open', async () => {
    if (await Servico.countDocuments() === 0) {
        await Servico.create([
            { nome: 'Blackwork', preco: 300, duracao_minutos: 120 },
            { nome: 'Fine Line', preco: 200, duracao_minutos: 60 },
            { nome: 'Old School', preco: 450, duracao_minutos: 180 },
            { nome: 'Realismo', preco: 800, duracao_minutos: 300 }
        ]);
    }
    if (await Regiao.countDocuments() === 0) {
        await Regiao.create([
            { nome: 'Braço', adicional: 0 },
            { nome: 'Perna', adicional: 50 },
            { nome: 'Costas', adicional: 200 },
            { nome: 'Pescoço', adicional: 150 }
        ]);
    }
});

// --- ROTAS ---

// ROTA DE REGISTRO (Faltava esta aqui!)
app.post('/api/usuarios/registrar', async (req, res) => {
    try {
        const { nome, email, senha, tipo, telefone } = req.body;

        // Verifica se usuário já existe
        const usuarioExiste = await Usuario.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ error: "Este e-mail já está cadastrado." });
        }

        // Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha: senhaCriptografada,
            tipo: tipo || 'cliente',
            telefone
        });

        res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
        console.error("Erro no registro:", error);
        res.status(500).json({ error: "Erro ao registrar usuário." });
    }
});

// Login
app.post('/api/usuarios/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const user = await Usuario.findOne({ email });
        
        if (user && await bcrypt.compare(senha, user.senha)) {
            res.json({ 
                user: { 
                    nome: user.nome, 
                    email: user.email, 
                    tipo: user.tipo 
                } 
            });
        } else {
            res.status(401).json({ error: "E-mail ou senha incorretos." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro no servidor." });
    }
});

// Agendar
app.post('/api/agendar', async (req, res) => {
    try {
        const novo = await Agendamento.create(req.body);
        res.status(201).json(novo);
    } catch (error) { res.status(500).json({ error: "Erro ao agendar" }); }
});

// Listar Agendamentos
app.get('/api/agendamentos', async (req, res) => {
    try {
        const lista = await Agendamento.find().sort({ data_hora: 1 });
        res.json(lista);
    } catch (error) { res.status(500).json({ error: "Erro ao buscar" }); }
});

// Atualizar Status (Pagar)
app.put('/api/agendamentos/:id', async (req, res) => {
    try {
        let { id } = req.params;
        const { status } = req.body;

        if (id.includes(':')) id = id.split(':')[0];

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID Inválido" });
        }

        const atualizado = await Agendamento.findByIdAndUpdate(id, { status }, { new: true });
        if (!atualizado) return res.status(404).json({ error: "Não encontrado" });

        res.json(atualizado);
    } catch (error) { res.status(500).json({ error: "Erro no servidor" }); }
});

// Auxiliares
app.get('/api/servicos', async (req, res) => res.json(await Servico.find()));
app.get('/api/regioes', async (req, res) => res.json(await Regiao.find()));

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));