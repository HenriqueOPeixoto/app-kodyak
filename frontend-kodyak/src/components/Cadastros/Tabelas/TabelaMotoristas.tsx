import { Button, Card, CardActionArea, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material"

import '../styles/Cadastros.css'
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "axios"

interface Motorista {
  id: number
  nome: string
  telefone: string
  placa: string
  vinculo: string
  tp_caminhao: number
}

const CardMotorista: React.FC<{ motorista: Motorista }> = ({ motorista }) => {
  return (
    <Card variant="outlined">
      <Link to={`/cadastros/editar_motorista/${motorista.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardActionArea>
          <CardContent>
            <Typography variant="subtitle2">#{motorista.id}</Typography>
            <Typography variant="h6">{motorista.nome}</Typography>
            <Typography>Placa: {motorista.placa}</Typography>
            <Typography>Telefone: {motorista.telefone}</Typography>
            <Typography>Vinculo: {motorista.vinculo}</Typography>
            <Typography>Caminhão: {motorista.tp_caminhao}</Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const TabelaMotoristas: React.FC = () => {

  const [motorista, setMotoristas] = useState<Motorista[]>([])
  const [nome, setNome] = useState<string>('')
  const [inativo, setInativo] = useState<boolean>(false)

  useEffect(() => {
    axios.get<Motorista[]>(`${backendBaseURL}/api/motoristas`, {
        params: {
          "nome": nome,
          "inativo": inativo
        }
      }
    )
      .then(response => {
        setMotoristas(response.data);
      })
      .catch(error => {
        console.error("Erro ao listar os motoristas: ", error);
      });
  }, [nome, inativo]);

  const handleTxtPesquisarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value)
  }

  const handleInativoRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInativo(event.target.value === 'true')
  }

    return (
      <div className="TabelaMotoristas">
        <div className="ContainerFiltros">
          <TextField className="TxtPesquisarMotorista" id="pesquisar-motorista" label="Nome" variant="standard" onChange={handleTxtPesquisarChange} />
          <FormControl>
            <FormLabel id="ativo-radio-button">Filtros</FormLabel>
            <RadioGroup defaultValue="ativo" row onChange={handleInativoRadioButtonChange}>
              <FormControlLabel value="false" control={<Radio />} label="Ativo"/>
              <FormControlLabel value="true" control={<Radio />} label="Inativo" />
            </RadioGroup>
          </FormControl>
          <div className="Botoes">
            {/* <Button className="BtnPesquisar" variant="contained">Pesquisar</Button> */}
          <Link to='/cadastros/novo_motorista'>
            <Button className="BtnIncluir" variant="contained" color="success">Incluir</Button>
          </Link>
          </div>
        </div>
        <Grid container spacing={2} style={{ overflowY: 'auto', height: '80vh' }}>
          {motorista.map((motorista) => (
            <Grid item xs={12} key={motorista.id}>
              <CardMotorista motorista={motorista} />
            </Grid>
          ))}
        </Grid>
      </div>
    )
  }

export default TabelaMotoristas