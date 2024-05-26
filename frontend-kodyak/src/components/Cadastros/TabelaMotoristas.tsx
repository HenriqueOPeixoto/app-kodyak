import { Button, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material"

import './styles/Cadastros.css'
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "axios"

interface Motorista {
  id: number
  nome:string
  telefone: string
  placa: string
  vinculo: string
  tp_caminhao: number
}

const CardMotorista: React.FC<{ motorista:Motorista }> = ({ motorista }) => {
  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Typography>#{motorista.id}</Typography>
          <Typography variant="h5">{motorista.nome}</Typography>
          <Typography>{motorista.placa}</Typography>
          <Typography>{motorista.telefone}</Typography>
          <Typography>{motorista.vinculo}</Typography>
          <Typography>{motorista.tp_caminhao}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

const TabelaMotoristas: React.FC = () => {

  const [motorista, setMotoristas] = useState<Motorista[]>([])

  useEffect(() => {
    axios.get<Motorista[]>('http://localhost:5174/api/motoristas')
      .then(response => {
        setMotoristas(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the drivers!", error);
      });
  }, []);

  return (
    <div className="TabelaMotoristas">
      <div className="ContainerBtnIncluir">
        <Link to='/cadastros/novo_motorista'>
          <Button className="BtnIncluir" variant="contained" color="success">Incluir</Button>
        </Link>
      </div>
      <Grid container spacing={2} style={{ overflowY: 'auto', height: '80vh' }}>
        {motorista.map((motorista) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={motorista.id}>
            <CardMotorista motorista={motorista} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default TabelaMotoristas