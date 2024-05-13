import { Button, Paper, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

import '../Cadastros.css'
import { Link } from "react-router-dom"

function TabelaClientes() {
  return (
    <div className="TabelaClientes">
      <div className="ContainerBtnIncluir">
        <Link to='/cadastros/novo_cliente'>
          <Button className="BtnIncluirCliente" variant="contained" color="success">Incluir</Button>
        </Link>
      </div>
      <TableContainer component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>CPF</TableCell>
            <TableCell>Endereço</TableCell>
          </TableRow>
          <TableRow>

            {/* TODO: Fazer scrollbar horizontal parar de aparecer. O conteúdo deve caber na página */}
            <TableCell>Teste da Silva</TableCell>
            <TableCell>123.456.789-00</TableCell>
            <TableCell>Rua dos Testes, 123W</TableCell>
          </TableRow>
        </TableHead>
      </TableContainer>
    </div>
  )
}

export default TabelaClientes