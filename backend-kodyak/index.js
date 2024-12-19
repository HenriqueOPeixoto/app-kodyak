const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')

const bancoRoutes = require('./routes/BancoRoutes')
const motoristaRoutes = require('./routes/MotoristaRoutes');
const usuarioRoutes = require('./routes/UsuarioRoutes');
const nivelAcessoRoutes = require('./routes/NivelAcessoRoutes')
const familiaProdutosRoutes = require('./routes/FamiliaProdutosRoutes')
const produtoRoutes = require('./routes/ProdutoRoutes')
const clienteRoutes = require('./routes/ClienteRoutes')
const clientesEnderecosRoutes = require('./routes/ClientesEnderecosRoutes')
const representanteRoutes = require('./routes/RepresentanteRoutes')
const pedidoRoutes = require('./routes/PedidoRoutes')
const pedidoItensRoutes = require('./routes/PedidoItensRoutes')

const app = express();

dotenv.config({ path: './.env'})

app.use(cors());

const port = process.env.PORT || 5174;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/bancos', bancoRoutes)
app.use('/api/clientes', clienteRoutes)
app.use('/api/clientes_enderecos', clientesEnderecosRoutes)
app.use('/api/produtos', produtoRoutes)
app.use('/api/familia_produtos', familiaProdutosRoutes)
app.use('/api/nivel_acesso', nivelAcessoRoutes)
app.use('/api/motoristas', motoristaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/representantes', representanteRoutes)
app.use('/api/pedidos', pedidoRoutes)
app.use('/api/pedidos_itens', pedidoItensRoutes)

app.listen(port, () => {
    console.log(`Escutando no endereço localhost:${port}`)
})