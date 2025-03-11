import { Autocomplete, Button, Card, CardActionArea, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material"

import '../styles/Cadastros.css'
import './styles/TabelaProdutos.css'
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import useAxiosInstance from "../../../service/AxiosInstance";

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

interface FamiliaProdutos {
  id: number
  nome: string
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
  const axios = useAxiosInstance()
  
  const [produto, setProdutos] = useState<Produto[]>([])
  const [nome, setNome] = useState<string>('')
  const [familiaProdutos, setFamiliaProdutos] = useState<FamiliaProdutos | null>(null)
  const [familiasProdutos, setFamiliasProdutos] = useState<FamiliaProdutos[]>([])
  const [inativo, setInativo] = useState<boolean>(false)

  useEffect(() => {
    axios.get<FamiliaProdutos[]>(`${backendBaseURL}/api/familia_produtos`, {
      params: {
        "inativo": false
      }
    })
      .then((response) => { setFamiliasProdutos(response.data) })
      .catch((error) => { console.error('Não foi possível listar as famílias de produtos: ' + error) })
  }, [])

  useEffect(() => {
    axios.get<Produto[]>(`${backendBaseURL}/api/produtos`, {
        params: {
          "nome": nome,
          "familia_produtos": familiaProdutos?.id,
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
  }, [nome, familiaProdutos, inativo]);

  const handleTxtPesquisarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value)
  }

  const handleInativoRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInativo(event.target.value === 'true')
  }

    return (
      <div className="TabelaProdutos">
        <div className="ContainerFiltros">
          <TextField className="TxtPesquisarProduto" id="pesquisar-produto" label="Produto" variant="standard" onChange={handleTxtPesquisarChange} />
          <div>
              <Autocomplete
                className='TxtFamiliaProduto'
                disablePortal
                options={familiasProdutos}
                sx={{ width: 300, marginLeft: '20px', marginRight: '20px' }}
                value={familiaProdutos}
                getOptionLabel={(option) => option.nome} // Como exibir cada opção
                onChange={(_event, buscaFamilia) => {
                    setFamiliaProdutos(buscaFamilia)
                }}
                renderInput={(params) => <TextField {...params} label="Família de Produtos" />}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
            />
          </div>
          <FormControl>
            <FormLabel id="ativo-radio-button">Filtros</FormLabel>
            <RadioGroup defaultValue="false" row onChange={handleInativoRadioButtonChange}>
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