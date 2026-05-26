const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.criar = async (req, res) => {
    try {
        const { cliente_nome, cliente_email, servico_nome, regiao_nome, valor_total, data_hora } = req.body;
        
        const { data, error } = await supabase
            .from('agendamentos')
            .insert([{ cliente_nome, cliente_email, servico_nome, regiao_nome, valor_total, data_hora }]);

        if (error) throw error;
        res.status(201).json({ message: "Agendamento criado com sucesso!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.listar = async (req, res) => {
    try {
        const { data, error } = await supabase.from('agendamentos').select('*');
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};