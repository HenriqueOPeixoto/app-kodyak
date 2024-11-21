import './App.css'
import './components/Sidebar/Sidebar.css'
import Sidebar from './components/Sidebar/Sidebar';
import '@fontsource/roboto/400.css';

import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import Bancos from './components/Cadastros/Bancos';

const Cadastro = lazy(() => import('./components/Cadastros/Cadastros'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const Clientes = lazy(() => import('./components/Cadastros/Clientes'));
const Enderecos = lazy(() => import('./components/Cadastros/Clientes/CadastroEndereco'));
const Motoristas = lazy(() => import('./components/Cadastros/Motoristas'));
const Usuarios = lazy(() => import('./components/Cadastros/Usuarios'));
const FamiliaProdutos = lazy(() => import('./components/Cadastros/FamiliaProdutos'));
const Produtos = lazy(() => import('./components/Cadastros/Produtos'));
const Representantes = lazy(() => import('./components/Cadastros/Representantes'));

const MenuPedidos = lazy(() => import('./components/Pedidos/MenuPedidos'));

function App() {
  return (
    <div className='App'>
      <div className='Sidebar'><Sidebar /></div>
      <div className='Main'>
        {/* O conteúdo da página atual será carregado aqui */}
        <Suspense fallback={<div><CircularProgress /></div>}>
          <Routes>
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
            {/* Novas rotas aqui */}
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
