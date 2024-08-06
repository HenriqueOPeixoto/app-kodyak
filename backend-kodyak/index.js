const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')

const motoristaRoutes = require('./routes/MotoristaRoutes');
const usuarioRoutes = require('./routes/UsuarioRoutes');
const nivelAcessoDAO = require('./DAOs/PostgreSQL/NivelAcessoDAO');
const FamiliaProdutosDAO = require('./DAOs/PostgreSQL/FamiliaProdutosDAO');

const app = express();

dotenv.config({ path: './.env'})

app.use(cors());

const port = process.env.PORT || 5174;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/cadastro/familia', FamiliaProdutosDAO.createFamiliaProdutos)

app.get('/api/familia/:id', FamiliaProdutosDAO.getFamiliaProdutosById)
app.get('/api/familia/', FamiliaProdutosDAO.getFamiliaProdutos)

app.put('/api/familia/:id/alterarStatus', FamiliaProdutosDAO.alterarStatusFamiliaProdutos)

app.put('/api/familia/:id', FamiliaProdutosDAO.updateFamiliaProdutos)


app.get('/api/nivel_acesso', nivelAcessoDAO.getNivelAcesso)

app.get('/api/nivel_acesso/:id', nivelAcessoDAO.getNivelAcessoById)

app.use('/api/motoristas', motoristaRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.listen(port, () => {
    console.log(`Escutando no endereço localhost:${port}`)
})