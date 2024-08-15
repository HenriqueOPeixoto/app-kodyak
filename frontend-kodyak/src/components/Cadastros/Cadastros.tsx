import { Button } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import './styles/Cadastros.css'
import TabelaClientes from './Tabelas/TabelaClientes';
import TabelaBancos from './Tabelas/TabelaBancos';
import { useState } from 'react';
import TabelaMotoristas from './Tabelas/TabelaMotoristas';
import { Person } from '@mui/icons-material';
import TabelaUsuarios from './Tabelas/TabelaUsuarios';
import TabelaFamiliaProdutos from './Tabelas/TabelaFamiliaProdutos';
import TabelaProdutos from './Tabelas/TabelaProdutos';

function Cadastros() {

  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };
  
  return (
    <>
      <div className="Title">
        Cadastros
        <hr />
      </div>
      <div className='Cadastros'>
        <div className='BotoesCadastro'>
          {/* Ao clicar em um botão, muda o estado de activeButton, fazendo com que outra tabela seja renderizada */}
          <Button startIcon={<AccountBalanceIcon />} onClick={() => {handleButtonClick('bancos')}}>Bancos</Button>
          <Button startIcon={<PeopleIcon />} onClick={() => {handleButtonClick('clientes')}}>Clientes</Button>
          <Button startIcon={<ShoppingBagIcon />} onClick={() => {handleButtonClick('familia_produtos')}}>Família de Produtos</Button>
          <Button startIcon={<ShoppingBagIcon />} onClick={() => {handleButtonClick('produtos')}}>Produtos</Button>
          <Button startIcon={<LocalShippingIcon />} onClick={() => {handleButtonClick('motoristas')}}>Motoristas</Button>
          <Button startIcon={<Person />} onClick={() => {handleButtonClick('usuarios')}}>Usuários</Button>
        </div>
        <div className='ListaCadastros'>
          {/* As linhas abaixo controlam qual tabela de cadastro deve ser exibida 
            baseando-se no estado dos botões, ou seja, o botão atual ativo pelo useState. */}
          {activeButton === 'bancos' && <TabelaBancos />}
          {activeButton === 'clientes' && <TabelaClientes />}
          {activeButton === 'motoristas' && <TabelaMotoristas />}
          {activeButton === 'usuarios' && <TabelaUsuarios/>}
          {activeButton === 'familia_produtos' && <TabelaFamiliaProdutos/>}
          {activeButton === 'produtos' && <TabelaProdutos/>}
        </div>
      </div>
    </>
  )
}

export default Cadastros