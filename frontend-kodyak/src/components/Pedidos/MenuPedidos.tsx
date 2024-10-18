import { Button } from '@mui/material'
import { useState } from 'react';

import AddCircleIcon from '@mui/icons-material/AddCircle';

import './styles/Pedidos.css'



function MenuPedidos() {

  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };
  
  return (
    <>
      <div className="Title">
        Pedidos
        <hr />
      </div>
      <div className='Pedidos'>
        <div className='BotoesPedidos'>
          {/* Ao clicar em um botão, muda o estado de activeButton, fazendo com que outra tabela seja renderizada */}
          <Button startIcon={<AddCircleIcon />} onClick={() => {handleButtonClick('criado')}}>Criado</Button>
        </div>
        <div className='ListaPedidos'>
          {/* As linhas abaixo controlam qual tabela de pedido deve ser exibida 
            baseando-se no estado dos botões, ou seja, o botão atual ativo pelo useState. */}
          {activeButton === 'criado' && <p>Pedidos criados</p>}
        </div>
      </div>
    </>
  )
}

export default MenuPedidos