const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')


const app = express();

app.use(cors());

const port = process.env.PORT || 5174;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TODO: Separar as funções de banco em um arquivo separado

(async () => {
  // open the database
  const db = await open({
    filename: './db/database.db',
    driver: sqlite3.Database
  });
  await db.exec(`
  CREATE TABLE IF NOT EXISTS MOTORISTAS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    NOME TEXT,
    PLACA TEXT,
    TELEFONE TEXT,
    VINCULO TEXT,
    TP_CAMINHAO INTEGER
  )`)
})()

app.post('/api/cadastro/motorista', async (req, res) => {
    console.log('Recebido: ' + JSON.stringify(req.body, null, 2));

    const { nome, placa, telefone, vinculo, tp_caminhao } = req.body;

    try {
      const db = await open({
        filename: './db/database.db',
        driver: sqlite3.Database
      });

      await db.run(
        'INSERT INTO MOTORISTAS (NOME, PLACA, TELEFONE, VINCULO, TP_CAMINHAO) VALUES (?, ?, ?, ?, ?)',
        [
          nome,
          placa,
          telefone,
          vinculo,
          tp_caminhao
        ]
      )
      res.status(200).send('Motorista cadastrado com sucesso.');
    } catch (err) {
      console.error('Não foi possível cadastrar o motorista. Erro: ' + err);
    }
    
  })

app.get('/api/motoristas', async (req, res) => {
  try {
    const db = await open({
      filename: './db/database.db',
      driver: sqlite3.Database
    });

    const motoristas = await db.all('SELECT * FROM MOTORISTAS');

    res.status(200).send(motoristas);
} catch(err) {
  console.error('Ocorreu um erro ao listar os motoristas. Erro: ' + err);
}})

app.listen(port, () => {
    console.log(`Escutando no endereço localhost:${port}`)
})