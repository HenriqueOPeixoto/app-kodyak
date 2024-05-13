import './App.css'
import './components/Sidebar/Sidebar.css'
import Sidebar from './components/Sidebar/Sidebar';
import '@fontsource/roboto/400.css';

import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const Cadastro = lazy(() => import('./components/Cadastros/Cadastros'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const Clientes = lazy(() => import('./components/Cadastros/Clientes'));

function App() {
  return (
    <div className='App'>
      <div className='Sidebar'><Sidebar /></div>
      <div className='Main'>
        {/* O conteúdo da página atual será carregado aqui */}
        <Suspense fallback={<div><CircularProgress /></div>}>
          <Routes>
            <Route path='/cadastros' element={<Cadastro />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/cadastros/novo_cliente' element={<Clientes />} />
            {/* Add more routes here */}
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
