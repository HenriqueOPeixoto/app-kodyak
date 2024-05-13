import './App.css'
import './components/Sidebar/Sidebar.css'
import Sidebar from './components/Sidebar/Sidebar'
import Cadastro from './components/Content/Cadastros';
import Dashboard from './components/Content/Dashboard';
import Clientes from './components/Content/Cadastros/Clientes';


import '@fontsource/roboto/400.css';
import { Route, Routes } from 'react-router-dom'


function App() {

  return (
    <>
      <div className='App'>
        <div className='Sidebar'><Sidebar /></div>
        <div className='Main'>
          {/* O conteúdo da página atual será carregado aqui */}
          <Routes>
            <Route path='/cadastros' Component={Cadastro}></Route>
            <Route path='/dashboard' Component={Dashboard}></Route>
            <Route path='/cadastros/novo_cliente' Component={Clientes}></Route>
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
