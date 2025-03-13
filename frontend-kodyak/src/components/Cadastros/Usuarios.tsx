import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar } from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './styles/Cadastros.css'
import './styles/Usuarios.css'
import useAxiosInstance from "../../service/AxiosInstance";
import { useParams, Link } from 'react-router-dom';
import { DoNotDisturb } from '@mui/icons-material';

import DialogInativar from './Dialogs/DialogInativar';

type NivelAcesso = {
  id: number,
  descricao: string
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

export default function Usuarios() {
  const axios = useAxiosInstance()
  const { id } = useParams() // Trazer id do usuário para atualizar, se houver
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [representante, setRepresentante] = useState('')
  const [nivel_acesso, setNivelAcesso] = useState('')
  const [inativo, setInativo] = useState(false)

  const [niveis_acesso, setNiveisAcesso] = useState([])
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)
  
  const [snackMessage, setSnackMessage] = useState('')

  const [btnInativarText, setBtnInativarText] = useState('Inativar')

  useEffect(() => {
    axios.get(`${backendBaseURL}/api/nivel_acesso`)
    .then((response) => {
      setNiveisAcesso(response.data)
    })

    if (id) {
      // Buscar os dados do usuário para atualizar
      axios.get(`${backendBaseURL}/api/usuarios/${id}`)
      .then(response => {
        if (response.data.length > 0) { // Checar se response não é vazio
            // response.data retorna um array, mas somente preciso do primeiro valor, pois getById só
            // retorna um registro.
            const { nome, email, representante, nivel_acesso, inativo } = response.data[0]
            setNome(nome)
            setEmail(email)
            setRepresentante(representante)
            setNivelAcesso(nivel_acesso)
            setInativo(inativo)
        }
      })
      .catch(error => {
        console.error('Não foi possível carregar dados do usuário: ', error)
      })
    }
  }, [id])

  const handleChangeNivel = (event: SelectChangeEvent) => {
    setNivelAcesso(event.target.value as string)
  }

  const handleSubmit = () => {
    const formData = {
      nome,
      email,
      senha,
      representante,
      nivel_acesso
    }

   
    if (id) {
      axios.put(`${backendBaseURL}/api/usuarios/${id}`, formData)
      .then(() => {
        handleAbrirSnack('Usuário atualizado com sucesso!')
      })
      .catch(error => {
        console.error('Ocorreu um erro ao atualizar o usuário: ', error)
        handleAbrirSnack('Ocorreu um erro ao atualizar o usuário: ' + error.response.data)
      })
    } else {
      axios.post(`${backendBaseURL}/api/usuarios/`, formData)
      .then(() => {
        handleAbrirSnack('Usuário cadastrado com sucesso.')
        
      })
      .catch(error => {
        console.error('Não foi possível cadastrar o usuário: ', error)
        handleAbrirSnack('Não foi possível cadastrar o usuário: ' + error.response.data)
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
    axios.patch(`${backendBaseURL}/api/usuarios/${id}/alterarStatus`, { inativo: newInativo })
      .then(response => {
        handleAbrirSnack(response.data); 
        setInativo(newInativo);
        setDialogOpen(false);
      })
      .catch(error => {
        console.error('Ocorreu um erro ao inativar o usuário: ', error);
        handleAbrirSnack('Ocorreu um erro ao inativar o usuário.');
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
        Usuário
        <hr />
      </div>
      <Link to='/cadastros' state={{ paginaAtual: 'usuarios' }}>
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
          label="E-mail"
          value={email}
          defaultValue=""
          onChange={event => setEmail(event.target.value)}
        />
        <TextField
          label="Senha"
          fullWidth
          required
          type="password"
          autoComplete="current-password"
          value={senha}
          sx={{mb: 2}}
          onChange={(event) => {
              setSenha(event.target.value)
          }}
        />
        <TextField
          required
          id="standard-required"
          label="Representante"
          value={representante}
          defaultValue=""
          onChange={event => setRepresentante(event.target.value)}
        />
        <div className='ContainerNivelAcesso'>
          <FormControl fullWidth>
            <InputLabel id='seleciona-nivel-acesso-lbl'>Nível de Acesso</InputLabel>
            <Select
              labelId='seleciona-nivel-acesso-lbl'
              id='seleciona-nivel-acesso'
              value={nivel_acesso}
              label="nivelAcesso"
              onChange={handleChangeNivel}
              >
                {niveis_acesso.map((nivel: NivelAcesso) => (
                  <MenuItem key={nivel.id} value={nivel.id}>{nivel.descricao}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
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