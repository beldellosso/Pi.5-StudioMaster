const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// --- CONEXÃO COM SUPABASE ---
// Substituindo o Mongoose para garantir que o banco não pause
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- ROTAS DE USUÁRIOS ---

// Registro de Usuário (Cliente ou Tatuador)
app.post('/api/usuarios/registrar', async (req, res) => {
    try {
        const { nome, email, senha, tipo, telefone } = req.body;

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const { data, error } = await supabase
            .from('usuarios')
            .insert([{ 
                nome, 
                email, 
                senha: senhaHash, 
                tipo: tipo || 'cliente', 
                telefone 
            }])
            .select();

        if (error) return res.status(400).json({ error: "E-mail já cadastrado ou erro no banco." });
        res.status(201).json({ message: "Usuário criado com sucesso!", user: data[0] });
    } catch (error) {
        res.status(500).json({ error: "Erro interno no servidor." });
    }
});

// Login
app.post('/api/usuarios/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const { data: user, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single();

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

// --- ROTAS DE AGENDAMENTO ---

// Criar Agendamento
app.post('/api/agendar', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('agendamentos')
            .insert([req.body])
            .select();
            
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) { 
        res.status(500).json({ error: "Erro ao agendar" }); 
    }
});

// Listar Agendamentos
app.get('/api/agendamentos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('agendamentos')
            .select('*')
            .order('data_hora', { ascending: true });
            
        if (error) throw error;
        res.json(data);
    } catch (error) { 
        res.status(500).json({ error: "Erro ao buscar agendamentos" }); 
    }
});

// Atualizar Status (Pagamento/Conclusão)
app.put('/api/agendamentos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from('agendamentos')
            .update({ status })
            .eq('id', id)
            .select();

        if (error) return res.status(400).json({ error: "Erro ao atualizar" });
        res.json(data[0]);
    } catch (error) { 
        res.status(500).json({ error: "Erro no servidor" }); 
    }
});

// --- NOVAS FUNCIONALIDADES (PORTFÓLIO E ÁREA DO CLIENTE) ---

// Listar Portfólio (Para a galeria de artes)
app.get('/api/portfolio', async (req, res) => {
    const { data, error } = await supabase.from('portfolio').select('*');
    if (error) return res.status(500).json(error);
    res.json(data);
});

// Listar Favoritos do Cliente
app.get('/api/favoritos/:clienteId', async (req, res) => {
    const { clienteId } = req.params;
    const { data, error } = await supabase
        .from('favoritos')
        .select('tatuador_id, usuarios!inner(nome)')
        .eq('cliente_id', clienteId);
    
    if (error) return res.status(500).json(error);
    res.json(data);
});

// --- ROTAS AUXILIARES ---
app.get('/api/servicos', async (req, res) => {
    const { data } = await supabase.from('servicos').select('*');
    res.json(data);
});

app.get('/api/regioes', async (req, res) => {
    const { data } = await supabase.from('regioes').select('*');
    res.json(data);
});

// Configuração da Porta
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 StudioMaster Online no Supabase (Porta ${PORT})`));