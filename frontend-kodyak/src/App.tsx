import './App.css'
import './components/Sidebar/Sidebar.css'
import Sidebar from './components/Sidebar/Sidebar'
import Cadastro from './components/Content/Cadastro';
import Dashboard from './components/Content/Dashboard';

import '@fontsource/roboto/400.css';



function App() {

  return (
    <>
      <div className='App'>
        <div className='Sidebar'><Sidebar /></div>
        <div className='Main'>
          {/* O conteúdo da página atual será carregado aqui */}
          <Dashboard />
        </div>
      </div>
    </>
  )
}

export default App
