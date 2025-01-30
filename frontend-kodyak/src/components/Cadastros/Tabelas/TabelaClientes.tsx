import { Button, Card, CardActionArea, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material"

import '../styles/Cadastros.css'
import './styles/TabelaClientes.css'
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "axios"

interface Cliente {
  id: number
  nome: string
  documento: string
  tipo_pessoa: string
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
            <Typography>{cliente.tipo_pessoa === 'F' ? 
              'CPF: ' + cliente.documento.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4") :
              'CNPJ: ' + cliente.documento.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2.$3")}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const TabelaClientes: React.FC = () => {

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [nome, setNome] = useState<string>('')
  const [documento, setDocumento] = useState<string>('')
  const [inativo, setInativo] = useState<boolean>(false)

  useEffect(() => {
    axios.get<Cliente[]>(`${backendBaseURL}/api/clientes`, {
        params: {
          "nome": nome,
          "documento": documento,
          "inativo": inativo
        }
      }
    )
      .then(response => {
        setClientes(response.data);
      })
      .catch(error => {
        console.error("Erro ao listar os clientes: ", error);
      });
  }, [nome, documento, inativo]);

  const handleTxtPesquisarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value)
  }
  const handleTxtDocumentoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocumento(event.target.value)
  }

  const handleInativoRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInativo(event.target.value === 'true')
  }

    return (
      <div className="TabelaClientes">
        <div className="ContainerFiltros">
          <TextField className="TxtPesquisarCliente" id="pesquisar-cliente" label="Nome" variant="standard" onChange={handleTxtPesquisarChange} />
          <TextField className="TxtPesquisarDocumento" id="pesquisar-documento" label="Documento" variant="standard" onChange={handleTxtDocumentoChange} />
          <FormControl>
            <FormLabel id="ativo-radio-button">Filtros</FormLabel>
            <RadioGroup defaultValue="false" row onChange={handleInativoRadioButtonChange}>
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
          {clientes.map((cliente) => (
            <Grid item xs={12} key={cliente.id}>
              <CardCliente cliente={cliente} />
            </Grid>
          ))}
        </Grid>
      </div>
    )
  }

export default TabelaClientes