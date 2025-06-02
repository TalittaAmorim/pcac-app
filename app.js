const express = require('express');
const app = express();
const PORTA = 3002;
const vagasRoutes = require('./routes/vagasRotas'); 

const db = require('./config/conexao.js')

app.get('/', (req, res) => {
  res.send('Bem-vindo à casa PCAC! Ainda estamos arrumando as coisas por dentro!');
});

app.use('/vagas', vagasRoutes); // MONTA AS ROTAS DE VAGAS NO CAMINHO /vagas


app.listen(PORTA, () => {
  console.log(` oba! A casa PCAC abriu na porta ${PORTA}! Visite em http://localhost:${PORTA}`);
});

