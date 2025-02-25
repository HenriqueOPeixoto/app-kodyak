import { Box, Button, Tab, Tabs } from "@mui/material"
import { Link, useParams } from "react-router-dom"
import { useState } from "react";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import CadastroPrincipal from "./Clientes/CadastroPrincipal";
import TabelaEnderecos from "./Clientes/TabelaEnderecos";

export default function Clientes() {
  const { id } = useParams()

  const [currentTabIndex, setCurrentTabIndex] = useState(0)


  const handleTabChange = (_e: React.SyntheticEvent, tabIndex: number) => {
    setCurrentTabIndex(tabIndex)
  }

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '50%' },
      }}
      noValidate
      autoComplete="off"
    >
      <div className="Title">
        Cadastro de Clientes
        <hr />
      </div>
      <Link to='/cadastros' state={{ paginaAtual: 'clientes' }}>
        <Button startIcon={<ArrowBackIcon />} color='error'>Voltar</Button>
      </Link>
      <div>
        <Box className='ContainerAbas' sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTabIndex}
            onChange={handleTabChange}
            variant='scrollable'
          >
            <Tab label="Cliente" />
            <Tab label="Endereços" />
          </Tabs>
        </Box>

        {currentTabIndex === 0 && <CadastroPrincipal />}
        {/* Somente irá renderizar a tabela de endereços se o cliente já exisitr no banco de dados */}
        {currentTabIndex === 1 && id && <TabelaEnderecos clienteId={id}/>}
      </div>
    </Box>
  )
}
