import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './styles/Motoristas.css'
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

export default function Motoristas() {
  const { id } = useParams() // Trazer id do motorista para atualizar, se houver
  const [nome, setNome] = useState('')
  const [placa, setPlaca] = useState('')
  const [telefone, setTelefone] = useState('')
  const [vinculo, setVinculo] = useState('')
  const [tp_caminhao, setTpCaminhao] = useState(id ? '' : '1')

  useEffect(() => {
    if (id) {
      // Buscar os dados do motorista para atualizar
      axios.get(`http://localhost:5174/api/motoristas/${id}`)
      .then(response => {
        console.log(response.data)
        if (response.data.length > 0) { // Checar se response não é vazio
            // response.data retorna um array, mas somente preciso do primeiro valor, pois getById só
            // retorna um registro.
            const { nome, placa, telefone, vinculo, tp_caminhao } = response.data[0]
            setNome(nome)
            setPlaca(placa)
            setTelefone(telefone)
            setVinculo(vinculo)
            setTpCaminhao(tp_caminhao)
        }
      })
      .catch(error => {
        console.log('Não foi possível carregar dados do motorista: ', error)
      })
    }
  }, [id])

  const handleChangeTipo = (event: SelectChangeEvent) => {
    setTpCaminhao(event.target.value as string)
  }

  const handleSubmit = () => {
    const formData = {
      nome,
      placa,
      telefone,
      vinculo,
      tp_caminhao: tp_caminhao
    }
   
    axios.post('http://localhost:5174/api/cadastro/motorista', formData)
    .then(response => {
      console.log('Motorista cadastrado com sucesso.')

    })
    .catch(error => {
      console.error('Não foi possível cadastrar o motorista: ', error)
    })
  }

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '50%' },
      }}
      noValidate
      autoComplete="off"
    >
      <Link to='/cadastros'>
        <Button startIcon={<ArrowBackIcon />}  color='error'>Voltar</Button>
      </Link>
      <div>
        <TextField
          required
          id="outlined-required"
          label="Nome Completo"
          value={nome}
          defaultValue=""
          onChange={event => setNome(event.target.value)}
        />
        <TextField
          required
          id="filled-required"
          label="Placa"
          value={placa}
          defaultValue=""
          onChange={event => setPlaca(event.target.value)}
        />
        <TextField
          required
          id="standard-required"
          label="Telefone"
          value={telefone}
          defaultValue=""
          onChange={event => setTelefone(event.target.value)}
        />
        <TextField 
            required
            id='vinculo'
            value={vinculo}
            label='Vínculo com o tipo de caminhão'
            onChange={event => setVinculo(event.target.value)}
        />
        </div>
        <div className='ContainerTipoCaminhao'>
          <FormControl fullWidth>
              <InputLabel id="lblTipoCaminhao">Selecione o tipo de caminhão</InputLabel>
              <Select
                labelId='lblTipoCaminhao'
                id='tipoCaminhao' 
                value={tp_caminhao}
                autoWidth 
                label="Selecione o tipo de caminhão"
                onChange={handleChangeTipo}>
                  <MenuItem value={1}>Truck - 14500</MenuItem>
                  <MenuItem value={2}>Bi-Truck - 18500</MenuItem>
                  <MenuItem value={3}>Carreta Is - 32000</MenuItem>
                  <MenuItem value={4}>Carreta Bi-Trem - 37500</MenuItem>
                  <MenuItem value={5}>Rodo-Trem - 50000</MenuItem>
              </Select>
          </FormControl>
        </div>
        <div className='BtnGravar'>
          <Button startIcon={<SaveIcon />}
            variant='contained'
            color='success'
            onClick={() => {handleSubmit()}}
          >Gravar</Button>
        </div>
    </Box>
  );
}