import { Box, Button, Snackbar, TextField } from "@mui/material"
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { DoNotDisturb } from '@mui/icons-material';
import axios from "axios";

import DialogInativar from "./Dialogs/DialogInativar";

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

export default function FamiliaProdutos() {
    const { id } = useParams()
    const [nome, setNome] = useState('')
    const [inativo, setInativo] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [snackOpen, setSnackOpen] = useState(false)

    const [snackMessage, setSnackMessage] = useState('')

    const [btnInativarText, setBtnInativarText] = useState('Inativar')

    useEffect(() => {
        if (id) {
            // Buscar dados da família de produtos
            axios.get(`${backendBaseURL}/api/familia_produtos/${id}`)
                .then(response => {
                    console.log(response.data)
                    if (response.data.length > 0) { // Checar se response não é vazio
                        // response.data retorna um array, mas somente preciso do primeiro valor, pois getById só
                        // retorna um registro.
                        const { nome, inativo } = response.data[0]
                        setNome(nome)
                        setInativo(inativo)
                    }
                })
                .catch(error => {
                    console.log('Não foi possível carregar dados da família de produtos: ', error)
                })
        }
    }, [id])

    const handleSubmit = () => {
        const formData = {
            nome
        }

        if (id) {
            axios.put(`${backendBaseURL}/api/familia_produtos/${id}`, formData)
                .then(() => {
                    handleAbrirSnack('Família de produtos atualizada com sucesso!')
                })
                .catch(error => {
                    handleAbrirSnack('Ocorreu um erro ao atualizar a família de produtos.')
                    console.error('Ocorreu um erro ao atualizar a família de produtos: ' + error)
                })
        } else {
            axios.post(`${backendBaseURL}/api/familia_produtos/`, formData)
                .then(() => {
                    handleAbrirSnack('Família de produtos cadastrada com sucesso.')

                })
                .catch(error => {
                    handleAbrirSnack('Não foi possível cadastrar a família de produtos.')
                    console.error('Não foi possível cadastrar a família de produtos: ' + error)
                })

                setNome('')
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
        const newInativo = !inativo; // Toggle inativo status
        axios.patch(`${backendBaseURL}/api/familia_produtos/${id}/alterarStatus`, { inativo: newInativo })
            .then(response => {
                handleAbrirSnack(response.data);
                setInativo(newInativo);
                //setBtnInativarText(newInativo ? 'Ativar' : 'Inativar'); Não é necessário, o useEffect atualiza automático
                setDialogOpen(false);
            })
            .catch(error => {
                console.error('Ocorreu um erro ao inativar a família de produtos: ', error);
                handleAbrirSnack('Ocorreu um erro ao inativar a família de produtos.');
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
                Família de Produtos
                <hr />
            </div>
            <Link to='/cadastros' state={{ paginaAtual: 'familia_produtos' }}>
                <Button startIcon={<ArrowBackIcon />} color='error'>Voltar</Button>
            </Link>
            <div>
                <TextField
                    required
                    id="txtNome"
                    label="Nome"
                    value={nome}
                    defaultValue=""
                    onChange={event => setNome(event.target.value.toUpperCase())}
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
