const mysql = require('mysql2');
require('dotenv').config();

const { createApp } = require('./app');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'usuario', // Lembrar de alterar pra rodar na sua máquina!!
  port: 3306,
  password: '99766565',
  database: 'mars_cervejaria'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado ao MySQL');
});

const app = createApp(db);
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
