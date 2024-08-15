import { Button, Card, CardActionArea, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material"

import '../styles/Cadastros.css'
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "axios"

interface Produto {
  id: number
  nome: string
  valor: number
  indicacoes: string
  modo_uso: string
  restricoes: number
  peso: number
  consumo_diario: number
  familia_produtos: number
  inativo: boolean
}

const CardProduto: React.FC<{ produto: Produto }> = ({ produto }) => {
  return (
    <Card variant="outlined" style={{height: '200px', width: '200px'}}>
      <Link to={`/cadastros/editar_produto/${produto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardActionArea style={{height: '100%'}}>
          <CardContent>
            <Typography variant="subtitle2">#{produto.id}</Typography>
            <Typography variant="h6">{produto.nome}</Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const TabelaProdutos: React.FC = () => {

  const [produto, setProdutos] = useState<Produto[]>([])
  const [nome, setNome] = useState<string>('')
  const [inativo, setInativo] = useState<boolean>(false)

  useEffect(() => {
    axios.get<Produto[]>(`${backendBaseURL}/api/produtos`, {
        params: {
          "nome": nome,
          "inativo": inativo
        }
      }
    )
      .then(response => {
        setProdutos(response.data);
      })
      .catch(error => {
        console.error("Erro ao listar os produtos: ", error);
      });
  }, [nome, inativo]);

  const handleTxtPesquisarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value)
  }

  const handleInativoRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInativo(event.target.value === 'true')
  }

    return (
      <div className="TabelaProdutos">
        <div className="ContainerFiltros">
          <TextField className="TxtPesquisarProduto" id="pesquisar-produto" label="Nome" variant="standard" onChange={handleTxtPesquisarChange} />
          <FormControl>
            <FormLabel id="ativo-radio-button">Filtros</FormLabel>
            <RadioGroup defaultValue="ativo" row onChange={handleInativoRadioButtonChange}>
              <FormControlLabel value="false" control={<Radio />} label="Ativo"/>
              <FormControlLabel value="true" control={<Radio />} label="Inativo" />
            </RadioGroup>
          </FormControl>
          <div className="Botoes">
            {/* <Button className="BtnPesquisar" variant="contained">Pesquisar</Button> */}
          <Link to='/cadastros/novo_produto'>
            <Button className="BtnIncluir" variant="contained" color="success">Incluir</Button>
          </Link>
          </div>
        </div>
        <Grid container spacing={2} style={{ overflowY: 'auto', height: '80vh' }}>
          {produto.map((produto) => (
            <Grid item xs={3} key={produto.id}>
              <CardProduto produto={produto} />
            </Grid>
          ))}
        </Grid>
      </div>
    )
  }

export default TabelaProdutos