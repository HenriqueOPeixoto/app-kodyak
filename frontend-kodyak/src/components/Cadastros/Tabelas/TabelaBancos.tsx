import { Button, Card, CardActionArea, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material"

import '../styles/Cadastros.css'
import './styles/TabelaBancos.css'
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "axios"

interface Bancos {
  id: number
  nome: string
  cod_banco: string
  sigla: string
}

const CardBancos: React.FC<{ bancos: Bancos }> = ({ bancos }) => {
  return (
    <Card className="CardBanco" variant="outlined">
      <Link to={`/cadastros/editar_banco/${bancos.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardActionArea>
          <CardContent>
            <Typography variant="h6">{bancos.cod_banco} - {bancos.nome} ({bancos.sigla})</Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const TabelaBancos: React.FC = () => {

  const [bancos, setBancos] = useState<Bancos[]>([])
  const [nome, setNome] = useState<string>('')
  const [inativo, setInativo] = useState<boolean>(false)

  useEffect(() => {
    axios.get<Bancos[]>(`${backendBaseURL}/api/bancos`, {
        params: {
          "nome": nome,
          "inativo": inativo
        }
      }
    )
      .then(response => {
        setBancos(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [nome, inativo]);

  const handleTxtPesquisarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value)
  }

  const handleInativoRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInativo(event.target.value === 'true')
  }

    return (
      <div className="TabelaBancos">
        <div className="ContainerFiltros">
          <TextField className="TxtPesquisarBancos" id="pesquisar-bancos" label="Nome" variant="standard" onChange={handleTxtPesquisarChange} />
          <FormControl>
            <FormLabel id="ativo-radio-button">Filtros</FormLabel>
            <RadioGroup defaultValue="ativo" row onChange={handleInativoRadioButtonChange}>
              <FormControlLabel value="false" control={<Radio />} label="Ativo"/>
              <FormControlLabel value="true" control={<Radio />} label="Inativo" />
            </RadioGroup>
          </FormControl>
          <div className="Botoes">
            {/* <Button className="BtnPesquisar" variant="contained">Pesquisar</Button> */}
          <Link to='/cadastros/novo_banco'>
            <Button className="BtnIncluir" variant="contained" color="success">Incluir</Button>
          </Link>
          </div>
        </div>
        <Grid container spacing={2} style={{ overflowY: 'auto', height: '80vh' }}>
          {bancos.map((bancos) => (
            <Grid item xs={12} key={bancos.id}>
              <CardBancos bancos={bancos} />
            </Grid>
          ))}
        </Grid>
      </div>
    )
  }

export default TabelaBancos