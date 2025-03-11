import { Button, Card, CardActionArea, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material"

import '../styles/Cadastros.css'
import './styles/TabelaRepresentantes.css'
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import useAxiosInstance from "../../../service/AxiosInstance";

interface Representante {
  id: number
  nome: string
}

const CardRepresentante: React.FC<{ representante: Representante }> = ({ representante }) => {
  return (
    <Card variant="outlined">
      <Link to={`/cadastros/editar_representante/${representante.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardActionArea style={{height: '100%'}}>
          <CardContent>
            <Typography variant="subtitle2">#{representante.id}</Typography>
            <Typography variant="h6">{representante.nome}</Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const TabelaRepresentantes: React.FC = () => {
  const axios = useAxiosInstance()
  
  const [representante, setRepresentante] = useState<Representante[]>([])
  const [nome, setNome] = useState<string>('')
  const [inativo, setInativo] = useState<boolean>(false)

  useEffect(() => {
    axios.get<Representante[]>(`${backendBaseURL}/api/representantes`, {
        params: {
          "nome": nome,
          "inativo": inativo
        }
      }
    )
      .then(response => {
        setRepresentante(response.data);
      })
      .catch(error => {
        console.error("Erro ao listar os representantes: ", error);
      });
  }, [nome, inativo]);

  const handleTxtPesquisarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value)
  }

  const handleInativoRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInativo(event.target.value === 'true')
  }

    return (
      <div className="TabelaRepresentantes">
        <div className="ContainerFiltros">
          <TextField className="TxtPesquisarRepresentante" id="pesquisar-Representante" label="Nome" variant="standard" onChange={handleTxtPesquisarChange} />
          <FormControl>
            <FormLabel id="ativo-radio-button">Filtros</FormLabel>
            <RadioGroup defaultValue="false" row onChange={handleInativoRadioButtonChange}>
              <FormControlLabel value="false" control={<Radio />} label="Ativo"/>
              <FormControlLabel value="true" control={<Radio />} label="Inativo" />
            </RadioGroup>
          </FormControl>
          <div className="Botoes">
            {/* <Button className="BtnPesquisar" variant="contained">Pesquisar</Button> */}
          <Link to='/cadastros/novo_representante'>
            <Button className="BtnIncluir" variant="contained" color="success">Incluir</Button>
          </Link>
          </div>
        </div>
        <Grid container spacing={2} style={{ overflowY: 'auto', height: '80vh' }}>
          {representante.map((representante) => (
            <Grid item xs={12} key={representante.id}>
              <CardRepresentante representante={representante} />
            </Grid>
          ))}
        </Grid>
      </div>
    )
  }

export default TabelaRepresentantes