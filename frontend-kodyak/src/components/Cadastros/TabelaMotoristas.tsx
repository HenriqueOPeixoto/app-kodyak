import { Button, Paper, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

import './styles/Cadastros.css'
import { Link } from "react-router-dom"

function TabelaMotoristas() {
  return (
    <div className="TabelaMotoristas">
      <div className="ContainerBtnIncluir">
        <Link to='/cadastros/novo_motorista'>
          <Button className="BtnIncluir" variant="contained" color="success">Incluir</Button>
        </Link>
      </div>
      <TableContainer component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Placa</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>Vínculo - Caminhão</TableCell>
          </TableRow>
          <TableRow>

            {/* TODO: Fazer scrollbar horizontal parar de aparecer. O conteúdo deve caber na página */}
            <TableCell>Teste da Silva</TableCell>
            <TableCell>AAA1A11</TableCell>
            <TableCell>(65) 91234-5678</TableCell>
            <TableCell>?????</TableCell>
          </TableRow>
        </TableHead>
      </TableContainer>
    </div>
  )
}

export default TabelaMotoristas