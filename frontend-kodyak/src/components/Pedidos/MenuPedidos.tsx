import { Button } from '@mui/material'
import { useState } from 'react';

import AddCircleIcon from '@mui/icons-material/AddCircle';

import './styles/MenuPedidos.css'
import TabelaPedidos from './TabelaPedidos';


function MenuPedidos() {

  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const getButtonVariant = (buttonName: string) => {
    return activeButton === buttonName ? 'contained' : 'text'
  }
  
  return (
    <>
      <div className="Title">
        Pedidos
        <hr />
      </div>
      <div className='Pedidos'>
        <div className='BotoesPedidos'>
          {/* Ao clicar em um botão, muda o estado de activeButton, fazendo com que outra tabela seja renderizada */}
          <Button startIcon={<AddCircleIcon />} variant={getButtonVariant('criado')} onClick={() => {handleButtonClick('criado')}}>Criado</Button>
          <Button startIcon={<AddCircleIcon />} variant={getButtonVariant('pendente')} onClick={() => {handleButtonClick('pendente')}}>Pendente</Button>
          <Button startIcon={<AddCircleIcon />} variant={getButtonVariant('analise_financeira')} onClick={() => {handleButtonClick('analise_financeira')}}>Análise Financeira</Button>
          <Button startIcon={<AddCircleIcon />} variant={getButtonVariant('aprovado')} onClick={() => {handleButtonClick('aprovado')}}>Aprovado</Button>
          <Button startIcon={<AddCircleIcon />} variant={getButtonVariant('faturado')} onClick={() => {handleButtonClick('faturado')}}>Faturado</Button>
          <Button startIcon={<AddCircleIcon />} variant={getButtonVariant('em_rota')} onClick={() => {handleButtonClick('em_rota')}}>Em Rota</Button>
          <Button startIcon={<AddCircleIcon />} variant={getButtonVariant('entregue')} onClick={() => {handleButtonClick('entregue')}}>Entregue</Button>
          <Button startIcon={<AddCircleIcon />} variant={getButtonVariant('pagamento_em_atraso')} onClick={() => {handleButtonClick('pagamento_em_atraso')}}>Pagto em Atraso</Button>
          <Button startIcon={<AddCircleIcon />} variant={getButtonVariant('recusado')} onClick={() => {handleButtonClick('recusado')}}>Recusado</Button>
        </div>
        <div className='ListaPedidos'>
          {/* As linhas abaixo controlam qual tabela de pedido deve ser exibida 
            baseando-se no estado dos botões, ou seja, o botão atual ativo pelo useState. */}
          {/*activeButton === 'criado' && <Link to={'/pedidos/novo_pedido'}>Novo Pedido</Link>*/}
          {activeButton === 'criado' && <TabelaPedidos statusPedido='0' />}
          {activeButton === 'pendente' && <TabelaPedidos statusPedido='1' />}
          {activeButton === 'analise_financeira' && <TabelaPedidos statusPedido='2' />}
          {activeButton === 'aprovado' && <TabelaPedidos statusPedido='3' />}
          {activeButton === 'faturado' && <TabelaPedidos statusPedido='4' />}
          {activeButton === 'em_rota' && <TabelaPedidos statusPedido='5' />}
          {activeButton === 'entregue' && <TabelaPedidos statusPedido='6' />}
          {activeButton === 'pagamento_em_atraso' && <TabelaPedidos statusPedido='7' />}
          {activeButton === 'recusado' && <TabelaPedidos statusPedido='8' />}
        </div>
      </div>
    </>
  )
}

export default MenuPedidos