import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, TextField } from "@mui/material"
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { NumericFormat, PatternFormat } from "react-number-format"

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { DoNotDisturb } from '@mui/icons-material';
import axios from "axios";

import DialogInativar from "./Dialogs/DialogInativar";

import './styles/Produtos.css'

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL


export default function Clientes() {
  const { id } = useParams()
  const [razaoSocial, setRazaoSocial] = useState('')
  const [nome, setNome] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [cpf, setCpf] = useState('')
  const [inscricaoEstadual, setInscricaoEstadual] = useState('')
  const [telefoneFixo, setTelefoneFixo] = useState('')
  const [telefoneCelular, setTelefoneCelular] = useState('')
  const [email, setEmail] = useState('')
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [inativo, setInativo] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [btnInativarText, setBtnInativarText] = useState('Inativar')

  useEffect(() => {
    if (id) {
      axios.get(`${backendBaseURL}/api/clientes/${id}`)
        .then(response => {
          if (response.data.length > 0) {
            const {
              razao_social,
              nome,
              cnpj,
              cpf,
              inscricao_estadual,
              telefone_fixo,
              telefone_celular,
              email,
              cep,
              logradouro,
              numero,
              bairro,
              cidade,
              estado,
              inativo
            } = response.data[0]

            setRazaoSocial(razao_social)
            setNome(nome)
            setCpf(cpf)
            setCnpj(cnpj)
            setInscricaoEstadual(inscricao_estadual)
            setTelefoneFixo(telefone_fixo)
            setTelefoneCelular(telefone_celular)
            setEmail(email)
            setCep(cep)
            setLogradouro(logradouro)
            setNumero(numero)
            setBairro(bairro)
            setCidade(cidade)
            setEstado(estado)
            setInativo(inativo)
          }
        })
        .catch(error => {
          console.log('Não foi possível carregar dados do produto: ', error)
        })
    }
  }, [id])

  const handleSubmit = () => {
    const formData = {
      razao_social: razaoSocial,
      nome,
      cpf,
      cnpj,
      inscricao_estadual: inscricaoEstadual,
      telefone_fixo: telefoneFixo,
      telefone_celular: telefoneCelular,
      email,
      cep,
      logradouro,
      numero,
      bairro,
      cidade,
      estado,
      inativo
    }

    if (id) {
      axios.put(`${backendBaseURL}/api/clientes/${id}`, formData)
        .then(() => {
          handleAbrirSnack('Cliente atualizado com sucesso!')
        })
        .catch(() => {
          handleAbrirSnack('Ocorreu um erro ao atualizar o cliente.')
        })
    } else {
      axios.put(`${backendBaseURL}/api/clientes/`, formData)
        .then(() => {
          handleAbrirSnack('Cliente cadastrado com sucesso.')
        
          setRazaoSocial('')
          setNome('')
          setCnpj('')
          setCpf('')
          setInscricaoEstadual('')
          setTelefoneFixo('')
          setTelefoneCelular('')
          setEmail('')
          setCep('')
          setLogradouro('')
          setNumero('')
          setBairro('')
          setCidade('')
          setEstado('')
          setInativo(false)
        })
        .catch((error) => {
          handleAbrirSnack('Não foi possível cadastrar o cliente.')
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
    axios.patch(`${backendBaseURL}/api/produtos/${id}/alterarStatus`, { inativo: newInativo })
      .then(response => {
        handleAbrirSnack(response.data);
        setInativo(newInativo);
        setDialogOpen(false);
      })
      .catch(error => {
        console.error('Ocorreu um erro ao inativar o produto: ', error);
        handleAbrirSnack('Ocorreu um erro ao inativar o produto.');
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
        Cadastro de Clientes
        <hr />
      </div>
      <Link to='/cadastros'>
        <Button startIcon={<ArrowBackIcon />} color='error'>Voltar</Button>
      </Link>
      <div>
        <TextField
          id="txtNome"
          label="Nome"
          defaultValue=""
          value={nome}
          onChange={event => setNome(event.target.value)}
        />
        <TextField
          id="txtRazaoSocial"
          label="Razão Social"
          defaultValue=""
          value={razaoSocial}
          onChange={event => setRazaoSocial(event.target.value)}
        />
        <PatternFormat
          id="txtCpf"
          label="CPF"
          value={cpf}
          customInput={TextField}
          format="###.###.###-##"
          mask="_"
          onValueChange={(values) => {
            const floatValue = values.floatValue;
            setCpf(floatValue !== undefined ? floatValue.toString() : '');
          }}
          
        />
        <PatternFormat
          id="txtCnpj"
          label="CNPJ"
          value={cnpj}
          customInput={TextField}
          format="##.###.###/####-##"
          mask="_"
          onValueChange={(values) => {
            const floatValue = values.floatValue;
            setCnpj(floatValue !== undefined ? floatValue.toString() : '');
          }}
          
        />
        <TextField 
          id="txtIE"
          label="Inscrição Estadual"
          value={inscricaoEstadual}
          defaultValue=""
          onChange={event => setInscricaoEstadual(event.target.value)}
        />
        <PatternFormat
          id="txtTelefoneFixo"
          label="Telefone Fixo"
          value={telefoneFixo}
          customInput={TextField}
          format="(##) ####-####"
          mask="_"
          onValueChange={(values) => {
            const floatValue = values.floatValue;
            setTelefoneFixo(floatValue !== undefined ? floatValue.toString() : '');
          }}
          
        />
        <PatternFormat
          id="txtTelefoneCelular"
          label="Telefone Celular"
          value={telefoneCelular}
          customInput={TextField}
          format="(##) # ####-####"
          mask="_"
          onValueChange={(values) => {
            const floatValue = values.floatValue;
            setTelefoneCelular(floatValue !== undefined ? floatValue.toString() : '');
          }}
          
        />
        <TextField 
          id="txtEmail"
          label="E-mail"
          value={email}
          defaultValue=""
          onChange={event => setEmail(event.target.value)}
        />
        <PatternFormat
          id="txtCep"
          label="CEP"
          value={cep}
          customInput={TextField}
          format="#####-###"
          mask="_"
          onValueChange={(values) => {
            const floatValue = values.floatValue;
            setCep(floatValue !== undefined ? floatValue.toString() : '');
          }}
          
        />
        <TextField 
          id="txtLogradouro"
          label="Logradouro"
          value={logradouro}
          defaultValue=""
          onChange={event => setLogradouro(event.target.value)}
        />
        <TextField 
          id="txtNumero"
          label="Número"
          value={numero}
          defaultValue=""
          onChange={event => setNumero(event.target.value)}
        />
        <TextField 
          id="txtBairro"
          label="Bairro"
          value={bairro}
          defaultValue=""
          onChange={event => setBairro(event.target.value)}
        />
        <TextField 
          id="txtCidade"
          label="Cidade"
          value={cidade}
          defaultValue=""
          onChange={event => setCidade(event.target.value)}
        />
        <TextField 
          id="txtEstado"
          label="Estado"
          value={estado}
          defaultValue=""
          onChange={event => setEstado(event.target.value)}
        />
        
      </div>
      <div className='FormButtons'>
        <Button startIcon={<SaveIcon />}
          variant='contained'
          color='success'
          onClick={() => { handleSubmit() }}
        >{id ? 'Atualizar' : 'Gravar'}</Button>
        <Button startIcon={<DoNotDisturb />}
          variant='contained'
          color='error'
          onClick={handleAbrirDialogInativar}>{btnInativarText}</Button>
      </div>
      <DialogInativar
        open={dialogOpen}
        handleClose={handleFecharDialogInativar}
        handleConfirm={handleConfirmarDialogInativar} />
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleFecharSnack}
        message={snackMessage}
      />
    </Box>
  )
}
