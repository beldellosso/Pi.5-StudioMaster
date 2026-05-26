const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const agendamentosRoutes = require('./agendamentosRoutes');
const estoqueRoutes = require('./estoqueRoutes');

router.use('/agendamentos', require('./agendamentosRoutes')); 
router.use('/estoque', require('./estoqueRoutes'));           
router.use('/usuarios', authRoutes);
module.exports = router;

