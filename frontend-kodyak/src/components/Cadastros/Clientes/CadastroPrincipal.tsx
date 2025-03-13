import { Box, Button, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, Snackbar, TextField, Tooltip } from "@mui/material";
import useAxiosInstance from "../../../service/AxiosInstance";
import { useEffect, useState } from "react";
import { PatternFormat } from "react-number-format";
import { useNavigate, useParams } from "react-router-dom";
import DialogInativar from "../Dialogs/DialogInativar";
import { DoNotDisturb } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save"
import EditIcon from '@mui/icons-material/Edit';

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

export default function CadastroPrincipal() {
    const axios = useAxiosInstance()
    const navigate = useNavigate();
    
    const { id } = useParams()
    const [razaoSocial, setRazaoSocial] = useState('')
    const [nome, setNome] = useState('')
    const [tipoPessoa, setTipoPessoa] = useState('F')
    const [documento, setDocumento] = useState('')
    const [inativo, setInativo] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')
    const [btnInativarText, setBtnInativarText] = useState('Inativar')

    const [msgTextoErro, setMsgTextoErro] = useState('') // Texto usado para exibir mensagem de erro ao informar documento
    const [inputErrado, setInputErrado] = useState(false) // Flag para exibir mensagem de erro ao informar documento

    useEffect(() => {
        if (id) {
            axios.get(`${backendBaseURL}/api/clientes/${id}`)
                .then(response => {
                    if (response.data.length > 0) {
                        const {
                            razao_social,
                            nome,
                            tipo_pessoa,
                            documento,
                            inativo
                        } = response.data[0]

                        setRazaoSocial(razao_social)
                        setNome(nome)
                        setTipoPessoa(tipo_pessoa)
                        setDocumento(documento)
                        setInativo(inativo)
                    }
                })
                .catch(error => {
                    console.error('Não foi possível carregar dados do cliente: ', error)
                })
        }
    }, [id])

    const handleSubmit = () => {
        if ((tipoPessoa === 'F') && (documento.length < 11)) {
            setMsgTextoErro('CPF precisa conter 11 dígitos')
            setInputErrado(true)
            return
        } else if ((tipoPessoa === 'J') && (documento.length < 8)) {
            setMsgTextoErro('Raíz do CNPJ precisa conter 8 dígitos')
            setInputErrado(true)
            return
        } else if ((razaoSocial === '') || (nome === '')) {
            handleAbrirSnack('Nome e Razão Social são campos obrigatórios!')
        } else {
            const formData = {
                razao_social: razaoSocial,
                nome,
                tipo_pessoa: tipoPessoa,
                documento,
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
                    .then((response) => {
                        handleAbrirSnack('Cliente cadastrado com sucesso.')
                        navigate('/cadastros/editar_cliente/' + response.data.id)
                    })
                    .catch(() => {
                        handleAbrirSnack('Não foi possível cadastrar o cliente.')
                    })
    
            }
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

    const handleTipoPessoaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTipoPessoa(event.target.value)
        setDocumento(documento.substring(0, 11))
    }

    const formatTipoPessoa = tipoPessoa === 'J' ? '##.###.###' : '###.###.###-##'

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <TextField
                id="txtNome"
                label="Nome"
                value={nome}
                required
                onChange={event => setNome(event.target.value.toUpperCase())}
            />
            <div style={{display:'flex', alignItems: 'center'}}>
                <TextField
                    id="txtRazaoSocial"
                    label="Razão Social"
                    value={razaoSocial}
                    required
                    onChange={event => setRazaoSocial(event.target.value.toUpperCase())}
                />
                {/* Preenche campo Razão Social com o que foi informado no campo Nome. */}
                <Tooltip title="Preencher Automaticamente">
                    <IconButton color="primary" onClick={() => setRazaoSocial(nome)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </div>

            <FormControl required sx={{marginLeft: '15px'}}>
                <FormLabel id="tipo-pessoa-radio-label" required>Tipo</FormLabel>
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
            required
            customInput={TextField}
            format={formatTipoPessoa}
            mask="_"
            style={{ maxWidth: '200px' }}
            error={inputErrado}
            helperText={msgTextoErro}
            onValueChange={(values) => {
              //const floatValue = values.floatValue;
              setDocumento(values.value.toString());
              setInputErrado(false);
              setMsgTextoErro('');
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