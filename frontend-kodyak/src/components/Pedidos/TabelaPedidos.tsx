import { Button, Card, CardActionArea, CardContent, Grid, TextField, Typography } from "@mui/material"

import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { PatternFormat } from "react-number-format"

interface Pedido {
    id: number,
    data: string,
    status: string,
    razao_social: number,
    documento: string
}

const CardPedidos: React.FC<{ pedidos: Pedido }> = ({ pedidos }) => {
  return (
    <Card className="CardPedido" variant="outlined">
      <Link to={`/pedidos/editar_pedido/${pedidos.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardActionArea>
          <CardContent>
            <Typography sx={{ fontWeight: 'bold' }}>Pedido {pedidos.id}</Typography>
            <Typography>Data: {pedidos.data}</Typography>
            <Typography>Cliente: {pedidos.razao_social}</Typography>
            <Typography>Documento: {pedidos.documento}</Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const TabelaPedidos: React.FC = () => {

  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [razao_social, setRazaoSocial] = useState<string>('')
  const [id, setId] = useState<string>('')
  const [data, setData] = useState<string>('')

  useEffect(() => {
    axios.get<Pedido[]>(`${backendBaseURL}/api/pedidos/view`, {
      params: {
        razao_social: razao_social,
        id: id,
        data: data
    }})
      .then(response => {
        setPedidos(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [id, razao_social, data]);

  const handleTxtPesquisarIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value)
  }
  const handleTxtPesquisarClienteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRazaoSocial(event.target.value)
  }
  const handleTxtPesquisarDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData(event.target.value)
  }

    return (
      <div className="TabelaPedidos">
        <div className="ContainerFiltros">
          <TextField className="TxtPesquisarPedidosPorID" id="pesquisar-pedidos-por-id" label="ID" variant="standard" onChange={handleTxtPesquisarIDChange} />
          <TextField className="TxtPesquisarPedidosPorCliente" id="pesquisar-pedidos-por-cliente" label="Cliente" variant="standard" onChange={handleTxtPesquisarClienteChange} />
          <PatternFormat 
            id="pesquisar-pedidos-por-data"
            customInput={TextField}
            label="Data" 
            variant="standard" 
            onChange={handleTxtPesquisarDataChange} 
            format="##/##/####" 
            mask="_"
          />
          <div className="Botoes">
            {/* <Button className="BtnPesquisar" variant="contained">Pesquisar</Button> */}
          <Link to='/pedidos/novo_pedido'>
            <Button className="BtnIncluir" variant="contained" color="success">Incluir</Button>
          </Link>
          </div>
        </div>
        <Grid container spacing={2} style={{ overflowY: 'auto', height: '80vh' }}>
          {pedidos.map((pedidos) => (
            <Grid item xs={12} key={pedidos.id}>
              <CardPedidos pedidos={pedidos} />
            </Grid>
          ))}
        </Grid>
      </div>
    )
  }

export default TabelaPedidos;