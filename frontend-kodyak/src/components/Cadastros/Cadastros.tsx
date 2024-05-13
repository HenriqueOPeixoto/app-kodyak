import { Button } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import './styles/Cadastros.css'
import TabelaClientes from './TabelaClientes';
import TabelaBancos from './TabelaBancos';
import { useState } from 'react';
import TabelaMotoristas from './TabelaMotoristas';

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
          <Button startIcon={<ShoppingBagIcon />}>Família de Produtos</Button>
          <Button startIcon={<LocalShippingIcon />} onClick={() => {handleButtonClick('motoristas')}}>Motoristas</Button>
        </div>
        <div className='ListaCadastros'>
          {/* As linhas abaixo controlam qual tabela de cadastro deve ser exibida 
            baseando-se no estado dos botões, ou seja, o botão atual ativo pelo useState. */}
          {activeButton === 'bancos' && <TabelaBancos />}
          {activeButton === 'clientes' && <TabelaClientes />}
          {activeButton === 'motoristas' && <TabelaMotoristas />}
        </div>
      </div>
    </>
  )
}

export default Cadastros