import { Button, Card, CardActionArea, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material"

import '../styles/Cadastros.css'
import './styles/TabelaFamiliaProdutos.css'
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "axios"

interface FamiliaProdutos {
  id: number
  nome: string
}

const CardFamiliaProdutos: React.FC<{ familiaProdutos: FamiliaProdutos }> = ({ familiaProdutos }) => {
  return (
    <Card variant="outlined">
      <Link to={`/cadastros/editar_familia_produtos/${familiaProdutos.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardActionArea>
          <CardContent>
            <Typography variant="subtitle2">#{familiaProdutos.id}</Typography>
            <Typography variant="h6">{familiaProdutos.nome}</Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const TabelaFamiliaProdutos: React.FC = () => {

  const [familiaProdutos, setFamiliaProdutos] = useState<FamiliaProdutos[]>([])
  const [nome, setNome] = useState<string>('')
  const [inativo, setInativo] = useState<boolean>(false)

  useEffect(() => {
    axios.get<FamiliaProdutos[]>(`${backendBaseURL}/api/familia_produtos`, {
        params: {
          "nome": nome,
          "inativo": inativo
        }
      }
    )
      .then(response => {
        setFamiliaProdutos(response.data);
      })
      .catch(error => {
        console.error("Erro ao listar as Famílias de Produtos: ", error);
      });
  }, [nome, inativo]);

  const handleTxtPesquisarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value)
  }

  const handleInativoRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInativo(event.target.value === 'true')
  }

    return (
      <div className="TabelaFamiliaProdutos">
        <div className="ContainerFiltros">
          <TextField className="TxtPesquisarFamiliaProdutos" id="pesquisar-familia-produtos" label="Nome" variant="standard" onChange={handleTxtPesquisarChange} />
          <FormControl>
            <FormLabel id="ativo-radio-button">Filtros</FormLabel>
            <RadioGroup defaultValue="ativo" row onChange={handleInativoRadioButtonChange}>
              <FormControlLabel value="false" control={<Radio />} label="Ativo"/>
              <FormControlLabel value="true" control={<Radio />} label="Inativo" />
            </RadioGroup>
          </FormControl>
          <div className="Botoes">
            {/* <Button className="BtnPesquisar" variant="contained">Pesquisar</Button> */}
          <Link to='/cadastros/novo_familia_produtos'>
            <Button className="BtnIncluir" variant="contained" color="success">Incluir</Button>
          </Link>
          </div>
        </div>
        <Grid container spacing={2} style={{ overflowY: 'auto', height: '80vh' }}>
          {familiaProdutos.map((familiaProdutos) => (
            <Grid item xs={12} key={familiaProdutos.id}>
              <CardFamiliaProdutos familiaProdutos={familiaProdutos} />
            </Grid>
          ))}
        </Grid>
      </div>
    )
  }

export default TabelaFamiliaProdutos