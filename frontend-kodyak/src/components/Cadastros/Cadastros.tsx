import { Button } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

import './styles/Cadastros.css'
import TabelaClientes from './Tabelas/TabelaClientes';
import TabelaBancos from './Tabelas/TabelaBancos';
import { useEffect, useState } from 'react';
import TabelaMotoristas from './Tabelas/TabelaMotoristas';
import { Person } from '@mui/icons-material';
import TabelaUsuarios from './Tabelas/TabelaUsuarios';
import TabelaFamiliaProdutos from './Tabelas/TabelaFamiliaProdutos';
import TabelaProdutos from './Tabelas/TabelaProdutos';
import TabelaRepresentantes from './Tabelas/TabelaRepresentantes';
import { useLocation } from 'react-router-dom';
import TabelaFretes from './Tabelas/TabelaFretes';

function Cadastros() {
  const location = useLocation()
  const [activeButton, setActiveButton] = useState<string | null>(null);

  useEffect(() => {
    if (location.state) {
      setActiveButton(location.state.paginaAtual)
    }
  }, [])

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const getButtonVariant = (buttonName: string) => {
    return activeButton === buttonName ? 'contained' : 'text'
  }
  
  return (
    <>
      <div className="Title">
        Cadastros
        <hr />
      </div>
      <div className='Cadastros'>
        <div className='BotoesCadastro'>
          {/* Ao clicar em um botão, muda o estado de activeButton, fazendo com que outra tabela seja renderizada */}
          <Button startIcon={<AccountBalanceIcon />}  variant={getButtonVariant('bancos')}           onClick={() => {handleButtonClick('bancos')}}>Bancos</Button>
          <Button startIcon={<PeopleIcon />}          variant={getButtonVariant('clientes')}         onClick={() => {handleButtonClick('clientes')}}>Clientes</Button>
          <Button startIcon={<ShoppingBagIcon />}     variant={getButtonVariant('familia_produtos')} onClick={() => {handleButtonClick('familia_produtos')}}>Família de Produtos</Button>
          <Button startIcon={<ShoppingBagIcon />}     variant={getButtonVariant('produtos')}         onClick={() => {handleButtonClick('produtos')}}>Produtos</Button>
          <Button startIcon={<LocalShippingIcon />}   variant={getButtonVariant('fretes')}           onClick={() => {handleButtonClick('fretes')}}>Fretes</Button>
          <Button startIcon={<LocalShippingIcon />}   variant={getButtonVariant('motoristas')}       onClick={() => {handleButtonClick('motoristas')}}>Motoristas</Button>
          <Button startIcon={<PersonAddAlt1Icon />}   variant={getButtonVariant('representantes')}   onClick={() => {handleButtonClick('representantes')}}>Representantes</Button>
          <Button startIcon={<Person />}              variant={getButtonVariant('usuarios')}         onClick={() => {handleButtonClick('usuarios')}}>Usuários</Button>
        </div>
        <div className='ListaCadastros'>
          {/* As linhas abaixo controlam qual tabela de cadastro deve ser exibida 
            baseando-se no estado dos botões, ou seja, o botão atual ativo pelo useState. */}
          {activeButton === 'bancos' && <TabelaBancos />}
          {activeButton === 'clientes' && <TabelaClientes />}
          {activeButton === 'fretes' && <TabelaFretes />}
          {activeButton === 'motoristas' && <TabelaMotoristas />}
          {activeButton === 'usuarios' && <TabelaUsuarios/>}
          {activeButton === 'familia_produtos' && <TabelaFamiliaProdutos/>}
          {activeButton === 'produtos' && <TabelaProdutos/>}
          {activeButton === 'representantes' && <TabelaRepresentantes />}
        </div>
      </div>
    </>
  )
}

export default Cadastros