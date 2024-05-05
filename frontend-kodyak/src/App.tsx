import './App.css'
import './components/Sidebar/Sidebar.css'
import Sidebar from './components/Sidebar/Sidebar'


import '@fontsource/roboto/400.css';



function App() {

  return (
    <>
      <div className='App'>
        <div className='Sidebar'><Sidebar /></div>
        <div className='Main'>
          {/* O conteúdo da página atual será carregado aqui */}
        </div>
      </div>
    </>
  )
}

export default App
