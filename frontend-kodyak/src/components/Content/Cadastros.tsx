import { Button, Table } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

import { Link, Route, Routes } from 'react-router-dom';

import './Cadastros.css'
import TabelaClientes from './Cadastros/TabelaClientes';
import TabelaBancos from './Cadastros/TabelaBancos';
import { useState } from 'react';

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
        </div>
        <div className='ListaCadastros'>
          {/* As linhas abaixo controlam qual tabela de cadastro deve ser exibida 
            baseando-se no estado dos botões, ou seja, o botão atual ativo pelo useState. */}
          {activeButton === 'bancos' && <TabelaBancos />}
          {activeButton === 'clientes' && <TabelaClientes />}
        </div>
      </div>
    </>
  )
}

export default Cadastros