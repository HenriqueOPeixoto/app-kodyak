import { Button, Card, CardActionArea, CardContent, Grid, TextField, Typography } from "@mui/material"

import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { PatternFormat } from "react-number-format"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { debounce } from 'lodash'

dayjs.extend(customParseFormat)

interface Pedido {
    id: number,
    data: string,
    status: string,
    razao_social: number,
    documento: string
}

interface TabelaPedidosProps {
  statusPedido: string
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

const TabelaPedidos: React.FC<TabelaPedidosProps> = ({ statusPedido }) => {

  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [razao_social, setRazaoSocial] = useState<string>('')
  const [id, setId] = useState<string>('')
  const [dataInicio, setDataInicio] = useState<string>('')
  const [dataFim, setDataFim] = useState<string>('')

  const fetchPedidos = debounce(() => {
    axios.get<Pedido[]>(`${backendBaseURL}/api/pedidos/view`, {
      params: {
        razao_social: razao_social,
        id: id,
        status: statusPedido,
        data_inicio: dayjs(dataInicio, 'DD/MM/YYYY', true).isValid() ? dataInicio : '',
        data_fim: dayjs(dataFim, 'DD/MM/YYYY', true).isValid() ? dataFim : ''
    }})
      .then(response => {
        setPedidos(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, 500);

  useEffect(() => {
    fetchPedidos();

    return () => {
      fetchPedidos.cancel()
    }
  }, [id, razao_social, dataInicio, dataFim]);

  const handleTxtPesquisarIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value)
  }
  const handleTxtPesquisarClienteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRazaoSocial(event.target.value)
  }

  const handleTxtPesquisarDataInicioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDataInicio(event.target.value)
  }
  const handleTxtPesquisarDataFimChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDataFim(event.target.value)
  }

    return (
      <div className="TabelaPedidos">
        <div style={{display: 'flex', gap: '20px'}} className="ContainerFiltros">
          <TextField sx={{maxWidth: '60px'}} className="TxtPesquisarPedidosPorID" id="pesquisar-pedidos-por-id" label="ID" variant="outlined" onChange={handleTxtPesquisarIDChange} />
          <TextField sx={{flexGrow: '1'}} className="TxtPesquisarPedidosPorCliente" id="pesquisar-pedidos-por-cliente" label="Nome Cliente" variant="outlined" onChange={handleTxtPesquisarClienteChange} />
          <PatternFormat 
            id="pesquisar-pedidos-por-data"
            customInput={TextField}
            label="Data Inicío" 
            variant="outlined" 
            onChange={handleTxtPesquisarDataInicioChange} 
            format="##/##/####" 
            mask="_"
          />
          <PatternFormat 
            id="pesquisar-pedidos-por-data"
            customInput={TextField}
            label="Data Fim" 
            variant="outlined" 
            onChange={handleTxtPesquisarDataFimChange} 
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
        <Grid container spacing={2} style={{ overflowY: 'auto', height: '80vh', marginTop: '20px', maxHeight: '100%' }}>
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