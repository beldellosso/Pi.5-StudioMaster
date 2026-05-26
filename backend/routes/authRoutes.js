const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth'); 
const checkRole = require('../middleware/checkRole'); 

router.post('/registrar', authController.registrar);
router.post('/login', authController.login);

router.post(
    '/funcionario', 
    authMiddleware,           
    checkRole('tatuador'),    
    authController.registrarFuncionario
);

module.exports = router;