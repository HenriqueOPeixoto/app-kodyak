import { Box, Button, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Snackbar, TextField } from "@mui/material"
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { DoNotDisturb } from '@mui/icons-material';
import axios from "axios";

import DialogInativar from "./Dialogs/DialogInativar";
import { PatternFormat } from "react-number-format";

import './styles/Representantes.css'

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

type Bancos = {
  id: number,
  cod_banco: string,
  nome: string,
  sigla: string
}

export default function Representantes() {
  const { id } = useParams()
  const [nome, setNome] = useState('')
  const [tipoPessoa, setTipoPessoa] = useState('')
  const [documento, setDocumento] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [banco, setBanco] = useState('')
  const [conta, setConta] = useState('')
  const [agencia, setAgencia] = useState('')
  const [inativo, setInativo] = useState(false)

  const [bancos, setBancos] = useState<Bancos[]>([])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)

  const [snackMessage, setSnackMessage] = useState('')

  const [btnInativarText, setBtnInativarText] = useState('Inativar')

  const handleTipoPessoaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTipoPessoa(event.target.value)
    setDocumento(documento.substring(0, 11))
  }

  const formatTipoPessoa = tipoPessoa === 'J' ? '##.###.###/####-##' : '###.###.###-##'
  const formatTelefone = !telefone || telefone.length === 0
    ? ''
    : telefone.length <= 10
      ? '(##) ####-####' // Format for 10-digit phone numbers
      : '(##) # ####-####'; // Format for 11-digit phone numbers


  useEffect(() => {
    axios.get(`${backendBaseURL}/api/bancos`)
      .then((response) => { setBancos(response.data) })
      .catch((error) => { console.error('Ocorreu um erro ao listar os bancos: ' + error) })

    if (id) {
      // Buscar dados da família de produtos
      axios.get(`${backendBaseURL}/api/representantes/${id}`)
        .then(response => {
          console.log(response.data)
          if (response.data.length > 0) { // Checar se response não é vazio
            // response.data retorna um array, mas somente preciso do primeiro valor, pois getById só
            // retorna um registro.
            const {
              nome,
              tipo_pessoa,
              documento,
              telefone,
              email,
              cep,
              logradouro,
              numero,
              bairro,
              cidade,
              estado,
              banco,
              conta,
              agencia,
              inativo
            } = response.data[0]

            setNome(nome)
            setTipoPessoa(tipo_pessoa)
            setDocumento(documento)
            setTelefone(telefone)
            setEmail(email)
            setCep(cep)
            setLogradouro(logradouro)
            setNumero(numero)
            setBairro(bairro)
            setCidade(cidade)
            setEstado(estado)
            setBanco(banco)
            setConta(conta)
            setAgencia(agencia)
            setInativo(inativo)
          }
        })
        .catch(error => {
          console.log('Não foi possível carregar dados do representante: ', error)
        })
    }
  }, [id])

  const handleSubmit = () => {
    const formData = {
      nome,
      tipo_pessoa: tipoPessoa,
      documento,
      telefone,
      email,
      cep,
      logradouro,
      numero,
      bairro,
      cidade,
      estado,
      banco,
      conta,
      agencia,
      inativo
    }

    if (id) {
      axios.put(`${backendBaseURL}/api/representantes/${id}`, formData)
        .then(() => {
          handleAbrirSnack('Representante atualizada com sucesso!')
        })
        .catch(() => {
          handleAbrirSnack('Ocorreu um erro ao atualizar o representante.')
        })
    } else {
      axios.post(`${backendBaseURL}/api/representantes/`, formData)
        .then(() => {
          handleAbrirSnack('Representante cadastrada com sucesso.')

          setNome('')
          setNome('')
          setTipoPessoa('')
          setDocumento('')
          setTelefone('')
          setEmail('')
          setCep('')
          setLogradouro('')
          setNumero('')
          setBairro('')
          setCidade('')
          setEstado('')
          setBanco('')
          setConta('')
          setAgencia('')
          setInativo(false)
        })
        .catch(() => {
          handleAbrirSnack('Não foi possível cadastrar o representante.')
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

  const handleChangeBanco = (event: SelectChangeEvent) => {
    setBanco(event.target.value as string)
  }

  const handleConfirmarDialogInativar = () => {
    const newInativo = !inativo; // Toggle inativo status
    axios.patch(`${backendBaseURL}/api/representantes/${id}/alterarStatus`, { inativo: newInativo })
      .then(response => {
        handleAbrirSnack(response.data);
        setInativo(newInativo);
        //setBtnInativarText(newInativo ? 'Ativar' : 'Inativar'); Não é necessário, o useEffect atualiza automático
        setDialogOpen(false);
      })
      .catch(error => {
        console.error('Ocorreu um erro ao inativar o representante: ', error);
        handleAbrirSnack('Ocorreu um erro ao inativar o representante.');
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
        Representante
        <hr />
      </div>
      <Link to='/cadastros'>
        <Button startIcon={<ArrowBackIcon />} color='error'>Voltar</Button>
      </Link>
      <div>
        <TextField
          required
          id="txtNome"
          label="Nome"
          value={nome}
          defaultValue=""
          onChange={event => setNome(event.target.value)}
        />

        <div className="FormDocumento">

          <FormControl>
            <FormLabel id="tipo-pessoa-radio-label">Tipo Pessoa</FormLabel>
            <RadioGroup
              aria-labelledby="tipo-pessoa-radio-buttons-group-label"
              defaultValue="F"
              name="tipo-pessoa-radio-buttons-group"
              onChange={handleTipoPessoaChange}
              value={tipoPessoa}
            >
              <FormControlLabel value="F" control={<Radio />} label="Pessoa Física (CPF)" />
              <FormControlLabel value="J" control={<Radio />} label="Pessoa Jurídica (CNPJ)" />
            </RadioGroup>
          </FormControl>

          <PatternFormat
            id="txtDocumento"
            label="Documento"
            value={documento}
            customInput={TextField}
            format={formatTipoPessoa}
            mask="_"
            style={{ maxWidth: '200px' }}
            onValueChange={(values) => {
              setDocumento(values.value.toString());
            }}

          />
        </div>
        <PatternFormat
          id="txtTelefone"
          label="Telefone"
          value={telefone}
          customInput={TextField}
          format={formatTelefone}
          placeholder="(65) 1234-5678"
          onValueChange={(values) => {
            const floatValue = values.floatValue;
            setTelefone(floatValue !== undefined ? floatValue.toString() : '');
          }}

        />

        <TextField
          id="txtEmail"
          label="Email"
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
        <div className="ContainerSeletor">
          <FormControl className="SeletorBanco" >
            <InputLabel id="lblBanco">Banco</InputLabel>
            <Select
              labelId="lblBanco"
              id="selBanco"
              value={banco}
              label="Banco"
              onChange={handleChangeBanco}
            >
              {bancos.map((banco: Bancos) => (
                <MenuItem key={banco.id} value={banco.id}>{banco.cod_banco}: {banco.nome}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <TextField
          id="txtConta"
          label="Conta"
          value={conta}
          defaultValue=""
          onChange={event => setConta(event.target.value)}
        />
        <TextField
          id="txtAgencia"
          label="Agência"
          value={agencia}
          defaultValue=""
          onChange={event => setAgencia(event.target.value)}
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
