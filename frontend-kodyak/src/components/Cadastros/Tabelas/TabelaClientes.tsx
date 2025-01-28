import { Button, Card, CardActionArea, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material"

import '../styles/Cadastros.css'
import './styles/TabelaClientes.css'
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "axios"

interface Cliente {
  id: number
  nome: string
  cnpj: string
  cpf: string
  inativo: boolean
}

const CardCliente: React.FC<{ cliente: Cliente }> = ({ cliente }) => {
  return (
    <Card variant="outlined">
      <Link to={`/cadastros/editar_cliente/${cliente.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardActionArea style={{height: '100%'}}>
          <CardContent>
            <Typography variant="subtitle2">#{cliente.id}</Typography>
            <Typography variant="h6">{cliente.nome}</Typography>
            <Typography component={"div"}><hr/></Typography>
            <Typography>CNPJ: {cliente.cnpj}</Typography>
            <Typography>CPF: {cliente.cpf}</Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const TabelaClientes: React.FC = () => {

  const [cliente, setCliente] = useState<Cliente[]>([])
  const [nome, setNome] = useState<string>('')
  const [inativo, setInativo] = useState<boolean>(false)

  useEffect(() => {
    axios.get<Cliente[]>(`${backendBaseURL}/api/clientes`, {
        params: {
          "nome": nome,
          "inativo": inativo
        }
      }
    )
      .then(response => {
        setCliente(response.data);
      })
      .catch(error => {
        console.error("Erro ao listar os clientes: ", error);
      });
  }, [nome, inativo]);

  const handleTxtPesquisarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value)
  }

  const handleInativoRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInativo(event.target.value === 'true')
  }

    return (
      <div className="TabelaClientes">
        <div className="ContainerFiltros">
          <TextField className="TxtPesquisarCliente" id="pesquisar-cliente" label="Nome" variant="standard" onChange={handleTxtPesquisarChange} />
          <FormControl>
            <FormLabel id="ativo-radio-button">Filtros</FormLabel>
            <RadioGroup defaultValue="ativo" row onChange={handleInativoRadioButtonChange}>
              <FormControlLabel value="false" control={<Radio />} label="Ativo"/>
              <FormControlLabel value="true" control={<Radio />} label="Inativo" />
            </RadioGroup>
          </FormControl>
          <div className="Botoes">
            {/* <Button className="BtnPesquisar" variant="contained">Pesquisar</Button> */}
          <Link to='/cadastros/novo_cliente'>
            <Button className="BtnIncluir" variant="contained" color="success">Incluir</Button>
          </Link>
          </div>
        </div>
        <Grid container spacing={2} style={{ overflowY: 'auto', height: '80vh' }}>
          {cliente.map((cliente) => (
            <Grid item xs={12} key={cliente.id}>
              <CardCliente cliente={cliente} />
            </Grid>
          ))}
        </Grid>
      </div>
    )
  }

export default TabelaClientes