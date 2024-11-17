import { Box, Button, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { PatternFormat } from "react-number-format";
import { useParams } from "react-router-dom";
import DialogInativar from "../Dialogs/DialogInativar";
import { DoNotDisturb } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save"

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

export default function CadastroPrincipal() {
    const { id } = useParams()
    const [razaoSocial, setRazaoSocial] = useState('')
    const [nome, setNome] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [cpf, setCpf] = useState('')
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
                            inativo
                        } = response.data[0]

                        setRazaoSocial(razao_social)
                        setNome(nome)
                        setCpf(cpf)
                        setCnpj(cnpj)
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
                    setInativo(false)
                })
                .catch(() => {
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
        axios.patch(`${backendBaseURL}/api/clientes/${id}/alterarStatus`, { inativo: newInativo })
            .then(response => {
                handleAbrirSnack(response.data);
                setInativo(newInativo);
                setDialogOpen(false);
            })
            .catch(error => {
                console.error('Ocorreu um erro ao inativar o cliente: ', error);
                handleAbrirSnack('Ocorreu um erro ao inativar o cliente.');
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
        <Box>
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