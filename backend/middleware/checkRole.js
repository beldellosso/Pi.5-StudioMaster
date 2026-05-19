const checkRole = (rolePermitido) => {
  return (req, res, next) => {
    // Verifica se o 'tipo' dentro do token bate com o papel necessário
    if (!req.user || req.user.tipo !== rolePermitido) {
      return res.status(403).json({ message: 'Acesso negado: você não tem permissão' });
    }
    next();
  };
};

module.exports = checkRole;