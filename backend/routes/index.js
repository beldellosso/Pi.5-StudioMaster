const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
router.use('/usuarios', authRoutes);
module.exports = router;