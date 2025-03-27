import { Box, Button, Card, CardActionArea, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material"

import '../styles/Cadastros.css'
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import useAxiosInstance from "../../../service/AxiosInstance";

interface Frete {
  id: number,
  id_uf: number,
  nome_uf: string,
  id_municipio: number,
  nome_municipio: string,
  valor_frete: number,
  icms_frete: number,
  icms_venda: number
}

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

const CardFrete: React.FC<{ frete: Frete }> = ({ frete: frete }) => {
  return (
    <Card variant="outlined">
      <Link to={`/cadastros/editar_frete/${frete.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardActionArea>
          <CardContent>
            <Typography variant="subtitle2">#{frete.id}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{frete.nome_uf} - {frete.nome_municipio}</Typography>
            <Typography>
              <Box>Valor frete: {formatter.format(frete.valor_frete)}</Box>
              <Box>ICMS Frete: {frete.icms_frete}%</Box>
              <Box>ICMS Venda: {frete.icms_venda}%</Box>
            </Typography>
            
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const TabelaFretes: React.FC = () => {
  const axios = useAxiosInstance()
  
  const [fretes, setFretes] = useState<Frete[]>([])
  const [inativo, setInativo] = useState<boolean>(false)

  useEffect(() => {
    axios.get<Frete[]>(`${backendBaseURL}/api/fretes/view`, {
        params: {
          "inativo": inativo
        }
      }
    )
      .then(response => {
        setFretes(response.data);
      })
      .catch(error => {
        console.error("Erro ao listar os fretes: ", error);
      });
  }, [inativo]);


  const handleInativoRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInativo(event.target.value === 'true')
  }

    return (
      <div className="TabelaFretes">
        <div className="ContainerFiltros">
          <FormControl>
            <FormLabel id="ativo-radio-button">Filtros</FormLabel>
            <RadioGroup defaultValue="false" row onChange={handleInativoRadioButtonChange}>
              <FormControlLabel value="false" control={<Radio />} label="Ativo"/>
              <FormControlLabel value="true" control={<Radio />} label="Inativo" />
            </RadioGroup>
          </FormControl>
          <div className="Botoes">
            {/* <Button className="BtnPesquisar" variant="contained">Pesquisar</Button> */}
          <Link to='/cadastros/novo_frete'>
            <Button className="BtnIncluir" variant="contained" color="success">Incluir</Button>
          </Link>
          </div>
        </div>
        <Grid container spacing={2} style={{ overflowY: 'auto', height: '80vh' }}>
          {fretes.map((frete) => (
            <Grid item xs={12} key={frete.id}>
              <CardFrete frete={frete} />
            </Grid>
          ))}
        </Grid>
      </div>
    )
  }

export default TabelaFretes