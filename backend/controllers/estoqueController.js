const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.listar = async (req, res) => {
    try {
        // O axios envia como query string (?donoId=...)
        const { donoId } = req.query; 
        
        console.log("DEBUG BACKEND: donoId recebido:", donoId); // Isso aparecerá no seu terminal Node

        if (!donoId) {
            return res.status(400).json({ error: "O ID do dono é obrigatório para listar o estoque." });
        }

        // Aqui vai a sua consulta ao banco de dados, ex:
        // const estoque = await Estoque.find({ tatuador_dono_id: donoId });
        
        // APENAS PARA TESTAR: se isso funcionar, o erro 400 desaparece
        res.status(200).json([]); 

    } catch (error) {
        console.error("Erro no servidor:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};
exports.adicionar = async (req, res) => {
    const { nome, quantidade } = req.body;
    const { data, error } = await supabase.from('estoque').insert([{ nome, quantidade }]);
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
};

