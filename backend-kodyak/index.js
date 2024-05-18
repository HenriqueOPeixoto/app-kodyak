const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./postgres')

const app = express();

app.use(cors());

const port = process.env.PORT || 5174;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/cadastro/motorista', async (req, res) => {
    console.log('Recebido: ' + JSON.stringify(req.body, null, 2));

    db.createMotorista(req, res)
    
  })

app.get('/api/motoristas', async (req, res) => {
})

app.listen(port, () => {
    console.log(`Escutando no endereço localhost:${port}`)
})