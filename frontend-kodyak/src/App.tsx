import './App.css'
import './components/Sidebar/Sidebar.css'
import Sidebar from './components/Sidebar/Sidebar';
import '@fontsource/roboto/400.css';

import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import Bancos from './components/Cadastros/Bancos';
import Pedido from './components/Pedidos/Pedido';
import Login from './components/Login/Login';

const Avisos = lazy(() => import('./components/Avisos/Avisos'));
const Cadastro = lazy(() => import('./components/Cadastros/Cadastros'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const Clientes = lazy(() => import('./components/Cadastros/Clientes'));
const Enderecos = lazy(() => import('./components/Cadastros/Clientes/CadastroEndereco'));
const Motoristas = lazy(() => import('./components/Cadastros/Motoristas'));
const Usuarios = lazy(() => import('./components/Cadastros/Usuarios'));
const FamiliaProdutos = lazy(() => import('./components/Cadastros/FamiliaProdutos'));
const Produtos = lazy(() => import('./components/Cadastros/Produtos'));
const Representantes = lazy(() => import('./components/Cadastros/Representantes'));
const NaoImplementado = lazy(() => import('./components/Avisos/NaoImplementado'));

const MenuPedidos = lazy(() => import('./components/Pedidos/MenuPedidos'));

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const isPedidoRoute = location.pathname.startsWith('/pedidos/')
  const isLoginRoute = location.pathname.startsWith('/login')
  const isRootRoute = location.pathname.startsWith('/') && location.pathname.length === 1
  const showSidebar = isPedidoRoute || isLoginRoute

  useEffect(() => {
    if (isRootRoute) {
      console.log('root')
      navigate('/login')
    } 
  }, [isRootRoute, navigate])

  return (
    <div className='App'>
      {!isPedidoRoute && !isLoginRoute &&
        <div className='Sidebar'><Sidebar /></div>
      }
      <div className={`Main ${showSidebar ? 'sem-sidebar' : ''}`}>
        {/* O conteúdo da página atual será carregado aqui */}
        <Suspense fallback={<div><CircularProgress /></div>}>
          <Routes>
            <Route path='/avisos' element={<Avisos />} />

            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Login />}/>
            <Route path='/cadastros' element={<Cadastro />} />
            <Route path='/cadastros/novo_cliente' element={<Clientes />} />
            <Route path='/cadastros/editar_cliente/:id' element={<Clientes />} />
            <Route path='/cadastros/editar_cliente/:clienteId/novo_endereco' element={<Enderecos />} />
            <Route path='/cadastros/editar_cliente/:clienteId/editar_endereco/:enderecoId' element={<Enderecos />} />
            <Route path='/cadastros/novo_banco' element={<Bancos />} />
            <Route path='/cadastros/editar_banco/:id' element={<Bancos />} />
            <Route path='/cadastros/novo_motorista' element={<Motoristas />} />
            <Route path='/cadastros/editar_motorista/:id' element={<Motoristas />} />
            <Route path='/cadastros/novo_usuario' element={<Usuarios />} />
            <Route path='/cadastros/editar_usuario/:id' element={<Usuarios />} />
            <Route path='/cadastros/novo_familia_produtos' element={<FamiliaProdutos />} />
            <Route path='/cadastros/editar_familia_produtos/:id' element={<FamiliaProdutos />} />
            <Route path='/cadastros/novo_produto' element={<Produtos />} />
            <Route path='/cadastros/editar_produto/:id' element={<Produtos />} />
            <Route path='/cadastros/novo_representante' element={<Representantes />} />
            <Route path='/cadastros/editar_representante/:id' element={<Representantes />} />
            
            <Route path='/dashboard' element={<Dashboard />} />
            
            <Route path='/pedidos' element={<MenuPedidos />} />
            <Route path='/pedidos/novo_pedido' element={<Pedido />} />
            <Route path='/pedidos/editar_pedido/:id' element={<Pedido />} />

            <Route path='/nao_implementado' element={<NaoImplementado />} />
            {/* Novas rotas aqui */}
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
