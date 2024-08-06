import { Button, Card, CardActionArea, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material"

import '../styles/Cadastros.css'
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "axios"

interface Usuario {
  id: number
  nome: string
  email: string
  representante: number
  nivel_acesso: number
}

const CardUsuario: React.FC<{ usuario: Usuario }> = ({ usuario }) => {
  return (
    <Card variant="outlined">
      <Link to={`/cadastros/editar_usuario/${usuario.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardActionArea>
          <CardContent>
            <Typography variant="subtitle2">#{usuario.id}</Typography>
            <Typography variant="h6">{usuario.nome}</Typography>
            <Typography>E-mail: {usuario.email}</Typography>
            <Typography>Representante: {usuario.representante}</Typography>
            <Typography>Nível Acesso: {usuario.nivel_acesso}</Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}

const TabelaUsuarios: React.FC = () => {

  const [usuario, setUsuarios] = useState<Usuario[]>([])
  const [nome, setNome] = useState<string>('')
  const [inativo, setInativo] = useState<boolean>(false)

  useEffect(() => {
    axios.get<Usuario[]>('http://localhost:5174/api/usuarios', {
        params: {
          "nome": nome,
          "inativo": inativo
        }
      }
    )
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error("Erro ao listar os usuários: ", error);
      });
  }, [nome, inativo]);

  const handleTxtPesquisarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value)
  }

  const handleInativoRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInativo(event.target.value === 'true')
  }

    return (
      <div className="TabelaUsuarios">
        <div className="ContainerFiltros">
          <TextField className="TxtPesquisarUsuario" id="pesquisar-usuario" label="Nome" variant="standard" onChange={handleTxtPesquisarChange} />
          <FormControl>
            <FormLabel id="ativo-radio-button">Filtros</FormLabel>
            <RadioGroup defaultValue="ativo" row onChange={handleInativoRadioButtonChange}>
              <FormControlLabel value="false" control={<Radio />} label="Ativo"/>
              <FormControlLabel value="true" control={<Radio />} label="Inativo" />
            </RadioGroup>
          </FormControl>
          <div className="Botoes">
            {/* <Button className="BtnPesquisar" variant="contained">Pesquisar</Button> */}
          <Link to='/cadastros/novo_usuario'>
            <Button className="BtnIncluir" variant="contained" color="success">Incluir</Button>
          </Link>
          </div>
        </div>
        <Grid container spacing={2} style={{ overflowY: 'auto', height: '80vh' }}>
          {usuario.map((usuario) => (
            <Grid item xs={12} key={usuario.id}>
              <CardUsuario usuario={usuario} />
            </Grid>
          ))}
        </Grid>
      </div>
    )
  }

export default TabelaUsuarios