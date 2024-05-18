const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const motoristaDAO = require('./DAOs/PostgreSQL/MotoristaDAO')

const app = express();

app.use(cors());

const port = process.env.PORT || 5174;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/cadastro/motorista', async (req, res) => {
    console.log('Recebido: ' + JSON.stringify(req.body, null, 2));

    motoristaDAO.createMotorista(req, res)
    
  })

app.get('/api/motoristas', async (req, res) => {
  motoristaDAO.getMotoristas(req, res)
})

app.listen(port, () => {
    console.log(`Escutando no endereço localhost:${port}`)
})