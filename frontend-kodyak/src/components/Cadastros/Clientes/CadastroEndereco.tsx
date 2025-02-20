import { Autocomplete, Button, Divider, Snackbar, TextField } from "@mui/material"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { PatternFormat } from "react-number-format"
import { Link, useParams } from "react-router-dom"
import DialogInativar from "../Dialogs/DialogInativar"
import { DoNotDisturb } from "@mui/icons-material"
import SaveIcon from "@mui/icons-material/Save"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import './styles/CadastroEndereco.css'

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

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
    const [cidade, setCidade] = useState<Cidade | null>(null)
    const [estado, setEstado] = useState<Estado | null>(null)
    const [inativo, setInativo] = useState(false)
    const [descricao, setDescricao,] = useState('')
    const [complementoCnpj, setComplementoCnpj] = useState('')
    const [digitoCnpj, setDigitoCnpj] = useState('')

    const [listaEstados, setListaEstados] = useState<Estado[]>([])
    const [listaCidades, setListaCidades] = useState<Cidade[]>([])

    const [nomeCliente, setNomeCliente] = useState('')
    const [desabilitarCamposPJ, setDesabilitarCamposPJ] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')
    const [btnInativarText, setBtnInativarText] = useState('Inativar')

    useEffect(() => {
        // Busca UFs
        axios.get(`${backendBaseURL}/api/localidades/unidades_federativas`)
            .then((response) => { setListaEstados(response.data) })
            .catch((error) => { console.error('Não foi possível listar as UFs: ' + error)})

        axios.get(`${backendBaseURL}/api/clientes/${clienteId}`)
            .then(response => {
                if (response.data.length > 0) {
                    const { nome, tipo_pessoa } = response.data[0]
                    setNomeCliente(nome)

                    if (tipo_pessoa === 'F') {
                        setDesabilitarCamposPJ(true)
                    } else {
                        setDesabilitarCamposPJ(false)
                    }
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
                            inativo,
                            descricao,
                            complemento_cnpj,
                            digito_cnpj
                        } = response.data[0]

                        setInscricaoEstadual(inscricao_estadual)
                        setTelefoneFixo(telefone_fixo)
                        setTelefoneCelular(telefone_celular)
                        setEmail(email)
                        setCep(cep)
                        setLogradouro(logradouro)
                        setNumero(numero)
                        setBairro(bairro)
                        setInativo(inativo)
                        setDescricao(descricao)
                        setComplementoCnpj(complemento_cnpj)
                        setDigitoCnpj(digito_cnpj)
                        
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
                                .catch((error) => { console.error('Não foi possível buscar a cidade deste endereço: ' + error)})
                        }
                    }
                })
                .catch(error => {
                    console.error('Não foi possível carregar dados do endereço: ', error)
                })
        }
    }, [enderecoId])

    React.useEffect(() => {
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
            inscricao_estadual: inscricaoEstadual,
            telefone_fixo: telefoneFixo,
            telefone_celular: telefoneCelular,
            email,
            cep,
            logradouro,
            numero,
            bairro,
            cidade: cidade?.id_municipio,
            cliente: clienteId,
            inativo,
            descricao,
            complemento_cnpj: complementoCnpj,
            digito_cnpj: digitoCnpj
        }

        const chavesVerificarNulo: (keyof typeof formData)[] = ['inscricao_estadual', 'cep', 'logradouro', 'numero', 'bairro', 'cidade', 'descricao']
        const obrigatoriosNulos = chavesVerificarNulo.filter(chave => formData[chave] === '')

        if (obrigatoriosNulos.length > 0) handleAbrirSnack('Os seguintes campos obrigatórios não foram preenchidos: ' + obrigatoriosNulos.join(', ').toUpperCase())
        else {
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
                        setCidade(null)
                        setEstado(null)
                        setInativo(false)
                        setDescricao('')
                        setComplementoCnpj('')
                        setDigitoCnpj('')
                    })
                    .catch(() => {
                        handleAbrirSnack('Não foi possível cadastrar o endereço.')
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
        axios.patch(`${backendBaseURL}/api/clientes_enderecos/${enderecoId}/alterarStatus`, { inativo: newInativo })
            .then(response => {
                handleAbrirSnack(response.data);
                setInativo(newInativo);
                setDialogOpen(false);
            })
            .catch(error => {
                console.error('Ocorreu um erro ao inativar o endereco: ', error);
                handleAbrirSnack('Ocorreu um erro ao inativar o endereço.');
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
                disabled
            />
            <div className="CabecalhoEndereco">
                <TextField
                    id="txtDescricao"
                    className="TxtDescricao"
                    label="Descrição Endereço"
                    value={descricao}
                    onChange={event => setDescricao(event.target.value)}
                />
                <TextField
                    id="txtIE"
                    className="TxtIE"
                    label="Inscrição Estadual"
                    value={inscricaoEstadual}
                    onChange={event => setInscricaoEstadual(event.target.value)}
                />
                <PatternFormat
                    id="txtComplCnpj"
                    label="Compl. CNPJ"
                    className="TxtComplCnpj"
                    value={complementoCnpj}
                    customInput={TextField}
                    format="####"
                    mask="_"
                    disabled={desabilitarCamposPJ}
                    onValueChange={(values) => {
                        setComplementoCnpj(values.value.toString());
                    }}

                />
                <PatternFormat
                    id="txtDigCnpj"
                    label="Dígito CNPJ"
                    className="TxtDigCnpj"
                    value={digitoCnpj}
                    customInput={TextField}
                    format="##"
                    mask="_"
                    disabled={desabilitarCamposPJ}
                    onValueChange={(values) => {
                        setDigitoCnpj(values.value.toString());
                    }}

                />
            </div>
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
                    required
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
                    required
                    onChange={event => setLogradouro(event.target.value)}
                />
                <TextField
                    id="txtNumero"
                    className="TxtNumero"
                    label="Número"
                    value={numero}
                    required
                    onChange={event => setNumero(event.target.value)}
                />

                <div className="break" />

                <TextField
                    id="txtBairro"
                    label="Bairro"
                    value={bairro}
                    required
                    onChange={event => setBairro(event.target.value)}
                />
                <Autocomplete
                    className='TxtUF'
                    disablePortal
                    options={listaEstados}
                    sx={{ width: 100 }}
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
                    sx={{ width: 300 }}
                    value={cidade}
                    getOptionLabel={(option) => option.nome_municipio} // Como exibir cada opção
                    onChange={(_event, novaCidade) => {
                        setCidade(novaCidade)
                    }}
                    renderInput={(params) => <TextField required {...params} label="Cidade" />}
                    isOptionEqualToValue={(option, value) => option.id_municipio === value?.id_municipio}
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
