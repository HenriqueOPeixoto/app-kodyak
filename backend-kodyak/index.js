const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

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
const localidadesRoutes = require('./routes/LocalidadesRoutes')
const freteRoutes = require('./routes/FreteRoutes')
const statusPedidoRoutes = require('./routes/StatusPedidoRoutes')
const authRoutes = require('./routes/AuthRoutes');
const authenticateToken = require('./middleware/Authorization');

const app = express();

dotenv.config({ path: './.env'})

const corsOptions = { credentials: true, origin: process.env.URL };
app.use(cors(corsOptions));

const port = process.env.PORT || 5174;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser())

app.use('/api/bancos', authenticateToken, bancoRoutes)
app.use('/api/clientes', authenticateToken, clienteRoutes)
app.use('/api/clientes_enderecos', authenticateToken, clientesEnderecosRoutes)
app.use('/api/produtos', authenticateToken, produtoRoutes)
app.use('/api/familia_produtos', authenticateToken, familiaProdutosRoutes)
app.use('/api/nivel_acesso', authenticateToken, nivelAcessoRoutes)
app.use('/api/motoristas', authenticateToken, motoristaRoutes);
app.use('/api/usuarios', authenticateToken, usuarioRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/representantes', authenticateToken, representanteRoutes)
app.use('/api/pedidos', authenticateToken, pedidoRoutes)
app.use('/api/pedidos_itens', authenticateToken, pedidoItensRoutes)
app.use('/api/localidades', authenticateToken, localidadesRoutes)
app.use('/api/fretes', authenticateToken, freteRoutes)
app.use('/api/status_pedido', authenticateToken, statusPedidoRoutes)

app.listen(port, '0.0.0.0')