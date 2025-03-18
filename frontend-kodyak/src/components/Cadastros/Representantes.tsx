import { Autocomplete, Box, Button, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Snackbar, TextField } from "@mui/material"
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { DoNotDisturb } from '@mui/icons-material';
import useAxiosInstance from "../../service/AxiosInstance";

import DialogInativar from "./Dialogs/DialogInativar";
import { PatternFormat } from "react-number-format";

import './styles/Representantes.css'

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

type Banco = {
  id: string,
  cod_banco: string,
  nome: string,
  sigla: string
}

interface Estado {
  id: number,
  nome: string,
  sigla: string,
  regiao: string
}

interface Cidade {
  id_municipio: number,
  nome_municipio: string,
  id_uf: number
}

export default function Representantes() {
  const axios = useAxiosInstance()
  
  const { id } = useParams()
  const [nome, setNome] = useState('')
  const [tipoPessoa, setTipoPessoa] = useState('F')
  const [documento, setDocumento] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState<Cidade | null>(null)
  const [estado, setEstado] = useState<Estado | null>(null)
  const [banco, setBanco] = useState('')
  const [conta, setConta] = useState('')
  const [agencia, setAgencia] = useState('')
  const [inativo, setInativo] = useState(false)

  const [bancos, setBancos] = useState<Banco[]>([])

  const [listaEstados, setListaEstados] = useState<Estado[]>([])
  const [listaCidades, setListaCidades] = useState<Cidade[]>([])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)

  const [snackMessage, setSnackMessage] = useState('')

  const [btnInativarText, setBtnInativarText] = useState('Inativar')
  const [formatTelefone, setFormatTelefone] = useState<string>('(##) ####-#####')

  const handleTipoPessoaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTipoPessoa(event.target.value)
    setDocumento(documento.substring(0, 11))
  }

  const formatTipoPessoa = tipoPessoa === 'J' ? '##.###.###/####-##' : '###.###.###-##'

  useEffect(() => {
    // Busca UFs
    axios.get(`${backendBaseURL}/api/localidades/unidades_federativas`)
      .then((response) => { setListaEstados(response.data) })
      .catch((error) => { console.error('Não foi possível listar as UFs: ' + error)})

    axios.get(`${backendBaseURL}/api/bancos`)
      .then((response) => { setBancos(response.data) })
      .catch((error) => { console.error('Ocorreu um erro ao listar os bancos: ' + error) })

    if (id) {
      axios.get(`${backendBaseURL}/api/representantes/${id}`)
        .then(response => {
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
            setBanco(banco || '') // Como é inteiro no banco, pode vir nulo
            setConta(conta)
            setAgencia(agencia)
            setInativo(inativo)

            if (cidade) {
              axios.get(`${backendBaseURL}/api/localidades/municipios/${cidade}/view`)
                  .then((response) => { 
                      const cidadeData: Cidade = {
                          id_municipio: response.data[0].id_municipio,
                          nome_municipio: response.data[0].nome_municipio,
                          id_uf: response.data[0].id_uf
                      }
                      setCidade(cidadeData)

                      const estadoData: Estado = {
                          id: response.data[0].id_uf,
                          nome: response.data[0].nome_uf,
                          sigla: response.data[0].sigla_uf,
                          regiao: response.data[0].regiao_uf
                      }

                      setEstado(estadoData)

                  })
                  .catch((error) => { console.error('Não foi possível buscar a cidade representante: ' + error)})
          }

          }
        })
        .catch(error => {
          console.error('Não foi possível carregar dados do representante: ', error)
        })
    }
  }, [id])

  useEffect(() => {
    if (estado)
    {
      axios.get(`${backendBaseURL}/api/localidades/municipios/`, {
          params: {
              id_uf: estado.id
          }
        })
        .then((response) => { setListaCidades(response.data) })
        .catch((error) => { console.error('Não foi possível listar as cidades: ' + error)})
    }
  }, [estado])

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
      cidade: cidade?.id_municipio,
      banco: banco ? banco : null, // Para permitir prosseguir sem informar banco
      conta,
      agencia,
      inativo
    }

    if (id) {
      axios.put(`${backendBaseURL}/api/representantes/${id}`, formData)
        .then(() => {
          handleAbrirSnack('Representante atualizado com sucesso!')
        })
        .catch((error) => {
          handleAbrirSnack('Ocorreu um erro ao atualizar o representante. Verifique o console para mais detalhes.')
          console.error(error)
        })
    } else {
      axios.post(`${backendBaseURL}/api/representantes/`, formData)
        .then(() => {
          handleAbrirSnack('Representante cadastrado com sucesso.')

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
          setCidade(null)
          setEstado(null)
          setBanco('')
          setConta('')
          setAgencia('')
          setInativo(false)
        })
        .catch((error) => {
          handleAbrirSnack('Não foi possível cadastrar o representante. Verifique o console para mais detalhes.')
          console.error(error)
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
      <Link to='/cadastros' state={{ paginaAtual: 'representantes' }}>
        <Button startIcon={<ArrowBackIcon />} color='error'>Voltar</Button>
      </Link>
      <div>
        <TextField
          required
          id="txtNome"
          label="Nome"
          value={nome}
          onChange={event => setNome(event.target.value.toUpperCase())}
        />

        <div className="FormDocumento">

          <FormControl>
            <FormLabel id="tipo-pessoa-radio-label">Tipo Pessoa</FormLabel>
            <RadioGroup
              aria-labelledby="tipo-pessoa-radio-buttons-group-label"
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
          onValueChange={(values) => {
            const tamanhoTelefone = values.formattedValue.replace(/\s/g, '').length

            if (tamanhoTelefone > 13) {
              setFormatTelefone('(##) #####-####')
            } else if (tamanhoTelefone === 13) {
              setFormatTelefone('(##) ####-#####')
            }

            setTelefone(values.value);
          }}

        />

        <TextField
          id="txtEmail"
          label="Email"
          value={email}
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
            setCep(values.value);
          }}

        />

        <TextField
          id="txtLogradouro"
          label="Logradouro"
          value={logradouro}
          onChange={event => setLogradouro(event.target.value.toUpperCase())}
        />
        <TextField
          id="txtNumero"
          label="Número"
          value={numero}
          onChange={event => setNumero(event.target.value)}
        />
        <TextField
          id="txtBairro"
          label="Bairro"
          value={bairro}
          onChange={event => setBairro(event.target.value.toUpperCase())}
        />
        <Autocomplete
          className='TxtUF'
          disablePortal
          options={listaEstados}
          //sx={{ width: 100 }}
          value={estado}
          getOptionLabel={(option) => option.sigla} // Como exibir cada opção
          onChange={(_event, novoEstado) => {
              if (estado?.id !== novoEstado?.id) {
                  setEstado(novoEstado)
                  setCidade(null)
              }
          }}
          renderInput={(params) => <TextField required {...params} label="UF" />}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
      />
      <Autocomplete
          className='TxtCidade'
          disablePortal
          options={listaCidades}
          //sx={{ width: 300 }}
          value={cidade}
          getOptionLabel={(option) => option.nome_municipio} // Como exibir cada opção
          onChange={(_event, novaCidade) => {
              setCidade(novaCidade)
          }}
          renderInput={(params) => <TextField required {...params} label="Cidade" />}
          isOptionEqualToValue={(option, value) => option.id_municipio === value?.id_municipio}
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
              {bancos.map((banco: Banco) => (
                <MenuItem key={banco.id} value={banco.id}>{banco.cod_banco}: {banco.nome}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <TextField
          id="txtConta"
          label="Conta"
          value={conta}
          onChange={event => setConta(event.target.value)}
        />
        <TextField
          id="txtAgencia"
          label="Agência"
          value={agencia}
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
