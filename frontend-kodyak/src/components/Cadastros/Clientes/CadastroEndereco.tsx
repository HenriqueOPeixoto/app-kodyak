import { Button, Divider, Snackbar, TextField } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { PatternFormat } from "react-number-format"
import { Link, useParams } from "react-router-dom"
import DialogInativar from "../Dialogs/DialogInativar"
import { DoNotDisturb } from "@mui/icons-material"
import SaveIcon from "@mui/icons-material/Save"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import './styles/CadastroEndereco.css'

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

export default function CadastroEndereco() {
    const { enderecoId, clienteId } = useParams()
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

    const [nomeCliente, setNomeCliente] = useState('')

    const [dialogOpen, setDialogOpen] = useState(false)
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')
    const [btnInativarText, setBtnInativarText] = useState('Inativar')

    useEffect(() => {
        axios.get(`${backendBaseURL}/api/clientes/${clienteId}`)
            .then(response => {
                if (response.data.length > 0) {
                    const { nome } = response.data[0]
                    setNomeCliente(nome)
                }
            })

        if (enderecoId) {
            axios.get(`${backendBaseURL}/api/clientes_enderecos/${enderecoId}`)
                .then(response => {
                    if (response.data.length > 0) {
                        const {
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
                    console.error('Não foi possível carregar dados do endereço: ', error)
                })
        }
    }, [enderecoId])

    const handleSubmit = () => {
        const formData = {
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
            cliente: clienteId,
            inativo
        }

        if (enderecoId) {
            axios.put(`${backendBaseURL}/api/clientes_enderecos/${enderecoId}`, formData)
                .then(() => {
                    handleAbrirSnack('Endereço atualizado com sucesso!')
                })
                .catch(() => {
                    handleAbrirSnack('Ocorreu um erro ao atualizar o endereço.')
                })
        } else {
            axios.post(`${backendBaseURL}/api/clientes_enderecos/`, formData)
                .then(() => {
                    handleAbrirSnack('Cliente cadastrado com sucesso.')

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
                .catch(() => {
                    handleAbrirSnack('Não foi possível cadastrar o endereço.')
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
        axios.patch(`${backendBaseURL}/api/produtos/${enderecoId}/alterarStatus`, { inativo: newInativo })
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
        <div className="FormCadastroEndereco" >
            <div className="Title">
                <Link to={`/cadastros/editar_cliente/${clienteId}`}>
                    <Button startIcon={<ArrowBackIcon />} color='error'></Button>
                </Link>
                {enderecoId ? <b>Editar endereço</b> : <b>Novo endereço</b>}
                <hr />
            </div>
            <TextField
                id="txtCliente"
                className="TxtCliente"
                label="Cliente"
                value={nomeCliente}
                variant="filled"
                defaultValue=""
                disabled
            />
            <TextField
                id="txtIE"
                className="TxtIE"
                label="Inscrição Estadual"
                value={inscricaoEstadual}
                defaultValue=""
                onChange={event => setInscricaoEstadual(event.target.value)}
            />
            <Divider sx={{ marginY: '10px' }} textAlign="center" >Contato</Divider>

            <div className="Contato">

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
            </div>

            <Divider sx={{ marginY: '10px' }} textAlign="center" >Endereço</Divider>

            <div className="Endereco">
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
                <div className="break" />

                <TextField
                    id="txtLogradouro"
                    className="TxtLogradouro"
                    label="Logradouro"
                    value={logradouro}
                    defaultValue=""
                    onChange={event => setLogradouro(event.target.value)}
                />
                <TextField
                    id="txtNumero"
                    className="TxtNumero"
                    label="Número"
                    value={numero}
                    defaultValue=""
                    onChange={event => setNumero(event.target.value)}
                />

                <div className="break" />

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
                >{enderecoId ? 'Atualizar' : 'Gravar'}</Button>
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
        </div>
    )

}
