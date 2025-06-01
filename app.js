const express = require('express');
const app = express()
const PORTA = 3002

app.get('/', (req, res) => {
  res.send('Bem-vindo à casa PCAC! Ainda estamos arrumando as coisas por dentro!');
});

app.listen(PORTA, () => {
  console.log(` oba! A casa PCAC abriu na porta ${PORTA}! Visite em http://localhost:${PORTA}`);
});