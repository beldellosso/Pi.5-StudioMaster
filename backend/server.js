require('dotenv').config();
const express = require('express');
const cors = require('cors');


const routes = require('./routes/index'); 

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('🚀 StudioMaster API está online!');
});

// Inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});