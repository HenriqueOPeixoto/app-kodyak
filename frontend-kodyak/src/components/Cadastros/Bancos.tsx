import { Box, Button, Snackbar, TextField } from "@mui/material"
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { DoNotDisturb } from '@mui/icons-material';
import useAxiosInstance from "../../service/AxiosInstance";

import DialogInativar from "./Dialogs/DialogInativar";

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

export default function Bancos() {
    const axios = useAxiosInstance()
    
    const { id } = useParams()
    const [codBanco, setCodBanco] = useState('')
    const [nome, setNome] = useState('')
    const [sigla, setSigla] = useState('')
    const [inativo, setInativo] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [snackOpen, setSnackOpen] = useState(false)

    const [snackMessage, setSnackMessage] = useState('')

    const [btnInativarText, setBtnInativarText] = useState('Inativar')

    useEffect(() => {
        if (id) {
            axios.get(`${backendBaseURL}/api/bancos/${id}`)
                .then(response => {
                    if (response.data.length > 0) {
                        const { cod_banco, nome, sigla, inativo } = response.data[0]
                        setCodBanco(cod_banco)
                        setNome(nome)
                        setSigla(sigla)
                        setInativo(inativo)
                    }
                })
                .catch(error => {
                    console.error('Não foi possível carregar dados da família de produtos: ', error)
                })
        }
    }, [id])

    const handleSubmit = () => {
        const formData = {
            cod_banco: codBanco,
            nome,
            sigla
        }

        if (id) {
            axios.put(`${backendBaseURL}/api/bancos/${id}`, formData)
                .then(() => {
                    handleAbrirSnack('Banco atualizado com sucesso!')
                })
                .catch(error => {
                    console.error(error)
                    handleAbrirSnack('Ocorreu um erro ao atualizar o cadastro do banco.')
                })
        } else {
            axios.post(`${backendBaseURL}/api/bancos/`, formData)
                .then(() => {
                    handleAbrirSnack('Banco cadastrado com sucesso.')

                })
                .catch((error) => {
                    console.error(error)
                    handleAbrirSnack('Não foi possível cadastrar o banco.')
                })

                setCodBanco('')
                setNome('')
                setSigla('')
                setInativo(false)
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
        const newInativo = !inativo;
        axios.patch(`${backendBaseURL}/api/bancos/${id}/alterarStatus`, { inativo: newInativo })
            .then(response => {
                handleAbrirSnack(response.data);
                setInativo(newInativo);
                setDialogOpen(false);
            })
            .catch(error => {
                console.error('Ocorreu um erro ao inativar o cadastro do banco: ', error);
                handleAbrirSnack('Ocorreu um erro ao inativar o cadastro do banco');
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
                Bancos
                <hr />
            </div>
            <Link to='/cadastros' state={{ paginaAtual: 'bancos' }}>
                <Button startIcon={<ArrowBackIcon />} color='error'>Voltar</Button>
            </Link>
            <div>
                <TextField
                    required
                    id="txtCodBanco"
                    label="Código Banco"
                    value={codBanco}
                    defaultValue=""
                    onChange={event => setCodBanco(event.target.value)}
                />
                <TextField
                    required
                    id="txtNome"
                    label="Nome"
                    value={nome}
                    defaultValue=""
                    onChange={event => setNome(event.target.value.toUpperCase())}
                />
                <TextField
                    required
                    id="txtSigla"
                    label="Sigla"
                    value={sigla}
                    defaultValue=""
                    onChange={event => setSigla(event.target.value.toUpperCase())}
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
