import { Autocomplete, Box, Button, Snackbar, TextField } from "@mui/material"
import { Link, useParams } from "react-router-dom"

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { DoNotDisturb } from '@mui/icons-material';
import useAxiosInstance from "../../service/AxiosInstance";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";

import DialogInativar from "./Dialogs/DialogInativar";

interface Estado {
    id: number,
    nome:string,
    sigla: string,
    regiao: string
}

interface Cidade {
    id_municipio: number,
    nome_municipio: string,
    id_uf: number
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

export default function Fretes() {
    const axios = useAxiosInstance()

    const { id } = useParams()
    const [estado, setEstado] = useState<Estado | null>(null)
    const [cidade, setCidade] = useState<Cidade | null>(null)
    const [valorFrete, setValorFrete] = useState<string>('')
    const [icmsFrete, setIcmsFrete] = useState<string>('')
    const [icmsVenda, setIcmsVenda] = useState<string>('')
    const [inativo, setInativo] = useState(false)

    const [listaEstados, setListaEstados] = useState<Estado[]>([])
    const [listaCidades, setListaCidades] = useState<Cidade[]>([])

    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    const [dialogOpen, setDialogOpen] = useState(false)
    const [btnInativarText, setBtnInativarText] = useState('Inativar')

    useEffect(() => {
        axios.get(`${backendBaseURL}/api/localidades/unidades_federativas`)
            .then((response) => {
                setListaEstados(response.data)
            })
            .catch((error) => {
                handleAbrirSnack("Erro ao listar as unidades federativas.")
                console.error("Erro ao listar as unidades federativas: ", error)
            })

            if (id) {
                axios.get(`${backendBaseURL}/api/fretes/${id}`)
                    .then((response) => {

                        setValorFrete(response.data[0].valor_frete)
                        setIcmsFrete(response.data[0].icms_frete)
                        setIcmsVenda(response.data[0].icms_venda)
                        setInativo(response.data[0].inativo)


                        return axios.get(`${backendBaseURL}/api/localidades/municipios/${response.data[0].cidade}/view`)
                    })
                    .then((response) => {
                        const cidadeData: Cidade = {
                            id_municipio: response.data[0].id_municipio,
                            nome_municipio: response.data[0].nome_municipio,
                            id_uf: response.data[0].id_uf
                        }

                        const estadoData: Estado = {
                            id: response.data[0].id_uf,
                            nome: response.data[0].nome_uf,
                            sigla: response.data[0].sigla_uf,
                            regiao: response.data[0].regiao_uf
                        }

                        setCidade(cidadeData)
                        setEstado(estadoData)
                    })
                    .catch((error) => {
                        handleAbrirSnack("Erro ao carregar os dados do frete.")
                        console.error("Erro ao carregar os dados do frete: ", error)
                    })
            }
    }, []);

    useEffect(() => {
        if (estado) {
            axios.get(`${backendBaseURL}/api/localidades/municipios/`, {
                params: {
                    id_uf: estado?.id
                }
            })
                .then((response) => {
                    setListaCidades(response.data)
                })
                .catch((error) => {
                    handleAbrirSnack("Erro ao listar os municípios.")
                    console.error("Erro ao listar os municípios: ", error)
            })
        }
    }, [estado])

    const handleAbrirDialogInativar = () => {
        setDialogOpen(true)
    }

    const handleFecharDialogInativar = () => {
        setDialogOpen(false)
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

    const handleSubmit = () => {
        const formData = {
            cidade: cidade?.id_municipio,
            valor_frete: valorFrete,
            icms_frete: icmsFrete,
            icms_venda: icmsVenda
        }

        if (id) {
            axios.put(`${backendBaseURL}/api/fretes/${id}`, formData)
                .then(() => {
                    handleAbrirSnack('Frete atualizado com sucesso!')
                })
                .catch((error) => {
                    handleAbrirSnack('Ocorreu um erro ao atualizar o frete.')
                    console.error('Ocorreu um erro ao atualizar o frete: ', error)
                })
        } else {
            axios.post(`${backendBaseURL}/api/fretes/`, formData)
                .then((results) => {
                    handleAbrirSnack('Frete cadastrado com sucesso!')
                    
                    setEstado(null)
                    setCidade(null)
                    setValorFrete('')
                    setIcmsFrete('')
                    setIcmsVenda('')
                })
                .catch((error) => {
                    handleAbrirSnack('Não foi possível cadastrar o frete.')
                    console.error('Não foi possível cadastrar o frete: ', error)
                })

            setEstado(null)
            setCidade(null)
            setValorFrete('')
            setIcmsFrete('')
            setIcmsVenda('')

        }
    }
    
    useEffect(() => {
        if (inativo) {
            setBtnInativarText('Ativar')
        } else {
            setBtnInativarText('Inativar')
        }
    }, [inativo])

    const handleAbrirSnack = (message: string) => {
        setSnackMessage(message)
        setSnackOpen(true)
    }
    
    const handleFecharSnack = () => {
        setSnackOpen(false)
    }

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '50%' }
            }}
            noValidate
            autoComplete="off"
        >
            <div className="Title">
                Fretes
                <hr />
            </div>
            <Link to='/cadastros' state={{ paginaAtual: 'fretes' }}>
                <Button startIcon={<ArrowBackIcon />} color='error'>Voltar</Button>
            </Link>
            <div>
                <Autocomplete 
                    className="TxtUF"
                    disablePortal
                    disabled={id ? true : false}
                    options={listaEstados}
                    value={estado}
                    getOptionLabel={(option) => option.sigla}
                    onChange={(_event, novoEstado) => {
                        if (estado?.id !== novoEstado?.id) {
                            setEstado(novoEstado)
                            setCidade(null)
                        }
                    }}
                    renderInput={(params) => <TextField {...params} label="UF" />}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                <Autocomplete 
                    className="TxtMunicípio"
                    disablePortal
                    options={listaCidades}
                    disabled={id ? true : false}
                    value={cidade}
                    getOptionLabel={(option) => option.nome_municipio}
                    onChange={(_event, novaCidade) => {
                        setCidade(novaCidade)
                    }}
                    renderInput={(params) => <TextField {...params} label="Município" />}
                    isOptionEqualToValue={(option, value) => option.id_municipio === value.id_municipio}
                />
                <NumericFormat
                    label="Valor do Frete"
                    customInput={TextField}
                    thousandSeparator="."
                    decimalSeparator=","
                    value={valorFrete}
                    prefix='R$ '
                    onValueChange={(values) => {
                        setValorFrete(values.value)
                    }}
                />
                <NumericFormat
                    label="ICMS sobre o Frete"
                    customInput={TextField}
                    thousandSeparator="."
                    decimalSeparator=","
                    value={icmsFrete}
                    suffix='%'
                    onValueChange={(values) => {
                        setIcmsFrete(values.value)
                    }}
                />
                <NumericFormat
                    label="ICMS sobre a Venda"
                    customInput={TextField}
                    thousandSeparator="."
                    decimalSeparator=","
                    value={icmsVenda}
                    suffix='%'
                    onValueChange={(values) => {
                        setIcmsVenda(values.value)
                    }}
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