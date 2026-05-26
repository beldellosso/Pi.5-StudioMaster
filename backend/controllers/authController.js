const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.registrar = async (req, res) => {
    try {
        const { nome, email, senha, tipo, telefone, cnpj, nome_studio, especialidade } = req.body;
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const { data, error } = await supabase
            .from('usuarios')
            .insert([{ nome, email, senha: senhaHash, tipo: tipo || 'cliente', telefone, cnpj: cnpj || null, nome_studio: nome_studio || null, especialidade: especialidade || null }])
            .select();

        if (error) return res.status(400).json({ error: "Erro ao cadastrar. Verifique o e-mail." });
        res.status(201).json({ message: "Usuário criado com sucesso!", user: data[0] });
    } catch (error) {
        res.status(500).json({ error: "Erro interno no servidor." });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const { data: user, error } = await supabase
            .from('usuarios')
            .select('*').eq('email', email).single();

        if (user && await bcrypt.compare(senha, user.senha)) {
            const token = jwt.sign({ id: user.id, tipo: user.tipo }, process.env.JWT_SECRET, { expiresIn: '8h' });
            res.json({ token, user: { id: user.id, nome: user.nome, tipo: user.tipo } });
        } else {
            res.status(401).json({ error: "E-mail ou senha incorretos." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro no servidor." });
    }
};


exports.registrarFuncionario = async (req, res) => {
    try {
        const { nome, email, senha, donoId } = req.body;
        
        // Adicione este log para ver no terminal do servidor se os dados estão chegando
        console.log("Dados recebidos no backend:", { nome, email, donoId });

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const { data, error } = await supabase
            .from('usuarios')
            .insert([{ 
                nome, 
                email, 
                senha: senhaHash, 
                tipo: 'funcionario', 
                dono_id: donoId 
            }])
            .select();

       if (error) {
    console.error(
        "ERRO COMPLETO SUPABASE:",
        JSON.stringify(error, null, 2)
    );

    return res.status(400).json({
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
    });
}
        
        res.status(201).json({ message: "Funcionário cadastrado com sucesso!", user: data[0] });
    } catch (error) {
        console.error("Erro interno:", error);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
};