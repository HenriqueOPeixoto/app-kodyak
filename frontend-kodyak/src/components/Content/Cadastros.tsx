import { Button } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

import './Cadastros.css'

function Cadastros() {
  return (
    <>
      <div className="Title">
        Cadastros
        <hr />
      </div>
      <div className='BotoesCadastro'>
        <Button startIcon={<AccountBalanceIcon />}>Bancos</Button>
        <Button startIcon={<PeopleIcon />}>Clientes</Button>
        <Button startIcon={<ShoppingBagIcon />}>Família de Produtos</Button>
      </div>
      <div className='ListaCadastros'>
        
      </div>
    </>
  )
}

export default Cadastros