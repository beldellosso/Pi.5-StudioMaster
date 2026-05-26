const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');

router.get('/', agendamentoController.listar);
router.post('/', agendamentoController.criar);

module.exports = router;