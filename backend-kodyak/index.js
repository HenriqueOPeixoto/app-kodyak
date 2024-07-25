const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')

const motoristaDAO = require('./DAOs/PostgreSQL/MotoristaDAO')
const usuarioDAO = require('./DAOs/PostgreSQL/UsuarioDAO')

const app = express();

dotenv.config({ path: './.env'})

app.use(cors());

const port = process.env.PORT || 5174;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/auth/register', (req, res) => {
  const { nome, email, senha, confirmacao_senha, representante, nivel_acesso } = req.body

  usuarioDAO.validaCadastro(req, res)
})

app.post('/api/cadastro/motorista', async (req, res) => {
    console.log('Recebido: ' + JSON.stringify(req.body, null, 2));

    motoristaDAO.createMotorista(req, res)
    
  })

app.get('/api/motoristas', async (req, res) => {
  motoristaDAO.getMotoristas(req, res)
})

app.get('/api/motoristas/:id', motoristaDAO.getMotoristaById)

app.put('/api/motoristas/:id', motoristaDAO.updateMotorista)

app.put('/api/motoristas/:id/alterarStatus', motoristaDAO.alterarStatusMotorista)

app.listen(port, () => {
    console.log(`Escutando no endereço localhost:${port}`)
})