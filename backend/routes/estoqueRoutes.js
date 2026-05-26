const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');

router.get('/', estoqueController.listar);
router.post('/', estoqueController.adicionar);

module.exports = router;