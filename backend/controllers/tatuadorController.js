exports.atualizarPerfil = async (req, res) => {
    const { id } = req.params;
    const { nomeFantasia, especialidade, endereco } = req.body;
    
    const { data, error } = await supabase
        .from('usuarios')
        .update({ nome_studio: nomeFantasia, especialidade, endereco })
        .eq('id', id);
        
    if (error) return res.status(400).json({ error: "Erro ao atualizar" });
    res.json({ message: "Perfil atualizado!" });
};