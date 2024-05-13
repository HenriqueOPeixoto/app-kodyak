import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './styles/Motoristas.css'
import axios from 'axios';

export default function Motoristas() {
  const [nome, setNome] = useState('')
  const [placa, setPlaca] = useState('')
  const [telefone, setTelefone] = useState('')
  const [vinculo, setVinculo] = useState('')
  const [tipoCaminhao, setTipoCaminhao] = useState('')

  const handleChangeTipo = (event: SelectChangeEvent) => {
    setTipoCaminhao(event.target.value as string)
  }

  const handleSubmit = () => {
    const formData = {
      nome,
      placa,
      telefone,
      vinculo,
      tipoCaminhao
    }
   
    axios.post('backend', formData)
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
      <Button startIcon={<ArrowBackIcon />}  color='error'>Voltar</Button>
      <div>
        <TextField
          required
          id="outlined-required"
          label="Nome Completo"
          defaultValue=""
        />
        <TextField
          required
          id="filled-required"
          label="Placa"
          defaultValue=""
        />
        <TextField
          required
          id="standard-required"
          label="Telefone"
          defaultValue=""
        />
        <TextField 
            required
            id='vinculo'
            label='Vínculo com o tipo de caminhão'
        />
        </div>
        <div className='ContainerTipoCaminhao'>
          <FormControl fullWidth>
              <InputLabel id="lblTipoCaminhao">Selecione o tipo de caminhão</InputLabel>
              <Select labelId='lblTipoCaminhao' id='tipoCaminhao' autoWidth label="Selecione o tipo de caminhão">
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