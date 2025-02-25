import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar } from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './styles/Motoristas.css'
import './styles/Cadastros.css'
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { DoNotDisturb } from '@mui/icons-material';

import DialogInativar from './Dialogs/DialogInativar';

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

export default function Motoristas() {
  const { id } = useParams() // Trazer id do motorista para atualizar, se houver
  const [nome, setNome] = useState('')
  const [placa, setPlaca] = useState('')
  const [telefone, setTelefone] = useState('')
  const [vinculo, setVinculo] = useState('')
  const [tp_caminhao, setTpCaminhao] = useState(id ? '' : '1')
  const [inativo, setInativo] = useState(false)
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)
  
  const [snackMessage, setSnackMessage] = useState('')

  const [btnInativarText, setBtnInativarText] = useState('Inativar')

  useEffect(() => {
    if (id) {
      // Buscar os dados do motorista para atualizar
      axios.get(`${backendBaseURL}/api/motoristas/${id}`)
      .then(response => {
        if (response.data.length > 0) { // Checar se response não é vazio
            // response.data retorna um array, mas somente preciso do primeiro valor, pois getById só
            // retorna um registro.
            const { nome, placa, telefone, vinculo, tp_caminhao, inativo } = response.data[0]
            setNome(nome)
            setPlaca(placa)
            setTelefone(telefone)
            setVinculo(vinculo)
            setTpCaminhao(tp_caminhao)
            setInativo(inativo)
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
   
    if (id) {
      axios.put(`${backendBaseURL}/api/motoristas/${id}`, formData)
      .then(() => {
        handleAbrirSnack('Motorista atualizado com sucesso!')
      })
      .catch(error => {
        console.log('Ocorreu um erro ao atualizar o motorista: ', error)
        handleAbrirSnack('Ocorreu um erro ao atualizar o motorista.')
      })
    } else {
      axios.post(`${backendBaseURL}/api/motorista/cadastro`, formData)
      .then(() => {
        handleAbrirSnack('Motorista cadastrado com sucesso.')
        
      })
      .catch(error => {
        console.error('Não foi possível cadastrar o motorista: ', error)
        handleAbrirSnack('Não foi possível cadastrar o motorista.')
      })
    }
  }

  const handleAbrirDialogInativar = () => {
    setDialogOpen(true)
  }

  const handleFecharDialogInativar = () => {
    setDialogOpen(false)
  }

  const handleAbrirSnack = (message: string) => {
    setSnackMessage(message)
    setSnackOpen(true)
  }

  const handleFecharSnack = () => {
    setSnackOpen(false)
  }

  const handleConfirmarDialogInativar = () => {
    const newInativo = !inativo; // Toggle inativo status
    axios.put(`${backendBaseURL}/api/motoristas/${id}/alterarStatus`, { inativo: newInativo })
      .then(response => {
        handleAbrirSnack(response.data); 
        setInativo(newInativo);
        //setBtnInativarText(newInativo ? 'Ativar' : 'Inativar'); Não é necessário, o useEffect atualiza automático
        setDialogOpen(false);
      })
      .catch(error => {
        console.log('Ocorreu um erro ao inativar o motorista: ', error);
        handleAbrirSnack('Ocorreu um erro ao inativar o motorista.');
      });
  };

  useEffect(() => {
    if (inativo) {
      setBtnInativarText('Ativar')
    } else {
      setBtnInativarText('Inativar')
    }
  }, [inativo])

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '50%' },
      }}
      noValidate
      autoComplete="off"
    >
      <div className="Title">
        Motoristas
        <hr />
      </div>
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
          onChange={event => setNome(event.target.value.toUpperCase())}
        />
        <TextField
          required
          id="filled-required"
          label="Placa"
          value={placa}
          defaultValue=""
          onChange={event => setPlaca(event.target.value.toUpperCase())}
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
            onChange={event => setVinculo(event.target.value.toUpperCase())}
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
        <div className='FormButtons'>
          <Button startIcon={<SaveIcon />}
            variant='contained'
            color='success'
            onClick={() => {handleSubmit()}}
          >{id ? 'Atualizar' : 'Gravar'}</Button>
          <Button startIcon={<DoNotDisturb/>}
            variant='contained'
            color='error'
            onClick={handleAbrirDialogInativar}>{btnInativarText}</Button>
        </div>
        <DialogInativar
          open={dialogOpen}
          handleClose={handleFecharDialogInativar}
          handleConfirm={handleConfirmarDialogInativar}/>
        <Snackbar
          open={snackOpen}
          autoHideDuration={6000}
          onClose={handleFecharSnack}
          message={snackMessage}
        />
    </Box>
  );
}