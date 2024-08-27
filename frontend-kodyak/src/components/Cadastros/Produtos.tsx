// TODO: Corrigir família de produtos ao carregar a página
// TODO: Corrigir Sidebar

import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, TextField } from "@mui/material"
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format"

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { DoNotDisturb } from '@mui/icons-material';
import axios from "axios";

import DialogInativar from "./Dialogs/DialogInativar";

import './styles/Produtos.css'

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

type FamiliaProdutos = {
    id: number,
    nome: string
}

export default function Produtos() {
    const { id } = useParams()
    const [nome, setNome] = useState('')
    const [valor, setValor] = useState(0.0)
    const [indicacoes, setIndicacoes] = useState('')
    const [modoUso, setModoUso] = useState('')
    const [restricoes, setRestricoes] = useState('')
    const [peso, setPeso] = useState(0.0)
    const [consumoDiario, setConsumoDiario] = useState(0.0)
    const [familiaProdutos, setFamiliaProdutos] = useState(id ? '' : '1')
    const [inativo, setInativo] = useState(false)

    // Usado para armazenar todas as famílias cadastradas
    const [familiasProdutos, setFamiliasProdutos] = useState<FamiliaProdutos[]>([])

    const [dialogOpen, setDialogOpen] = useState(false)
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')
    const [btnInativarText, setBtnInativarText] = useState('Inativar')

    useEffect(() => {
        axios.get(`${backendBaseURL}/api/familia_produtos`)
        .then((response) => {setFamiliasProdutos(response.data)})
        .catch((error) => {console.error('Ocorreu um erro ao listar as famílias de produtos: ' + error)})

        if (id) {
            axios.get(`${backendBaseURL}/api/produtos/${id}`)
                .then(response => {
                    if (response.data.length > 0) {
                        
                        const {
                            nome, valor, indicacoes, modo_uso, restricoes, peso, consumo_diario, familia_produtos, inativo 
                        } = response.data[0]
                        
                        setNome(nome)
                        setValor(valor)
                        setIndicacoes(indicacoes)
                        setModoUso(modo_uso)
                        setRestricoes(restricoes)
                        setPeso(peso)
                        setConsumoDiario(consumo_diario)
                        setFamiliaProdutos(familia_produtos)
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
            nome, valor, indicacoes, modo_uso: modoUso, restricoes, peso, consumo_diario: consumoDiario, familia_produtos: familiaProdutos, inativo
        }

        console.log(formData)

        if (id) {
            axios.put(`${backendBaseURL}/api/produtos/${id}`, formData)
                .then(() => {
                    handleAbrirSnack('Produto atualizado com sucesso!')
                })
                .catch(() => {
                    handleAbrirSnack('Ocorreu um erro ao atualizar o produto.')
                })
        } else {
            axios.post(`${backendBaseURL}/api/produtos/`, formData)
                .then(() => {
                    handleAbrirSnack('Produto cadastrado com sucesso.')

                })
                .catch(() => {
                    handleAbrirSnack('Não foi possível cadastrar o produto.')
                })

                setNome('')
                setValor(0.0)
                setIndicacoes('')
                setModoUso('')
                setRestricoes('')
                setPeso(0.0)
                setConsumoDiario(0.0)
                setFamiliaProdutos('')
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

    const handleChangeFamiliaProdutos = (event: SelectChangeEvent) => {
        setFamiliaProdutos(event.target.value as string)
    }

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
                Cadastro de Produtos
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
                <div className="ContainerNumeros">
                    <NumericFormat 
                        label="Valor"
                        customInput={TextField}
                        thousandSeparator="."
                        decimalSeparator=","
                        value={valor}
                        prefix="R$ "
                        onValueChange={(values) => setValor(values.floatValue as number)}
                    />
                    <NumericFormat 
                        label="Peso"
                        customInput={TextField}
                        thousandSeparator=""
                        decimalSeparator=","
                        value={peso}
                        suffix=" kg"
                        onValueChange={(values) => setPeso(values.floatValue as number)}
                    />
                    <NumericFormat 
                        label="Consumo Diário"
                        customInput={TextField}
                        thousandSeparator=""
                        decimalSeparator=","
                        value={consumoDiario}
                        onValueChange={(values) => setConsumoDiario(values.floatValue as number)}
                    />
                </div>
                <div className="ContainerTextos">
                    <TextField
                        id="txtIndicacoes"
                        label="Indicações"
                        multiline
                        rows={4}
                        value={indicacoes}
                        variant="filled"
                        onChange={event => setIndicacoes(event.target.value)}
                        />
                    <TextField
                        id="txtModoUso"
                        label="Modo de Uso"
                        multiline
                        rows={4}
                        value={modoUso}
                        variant="filled"
                        onChange={event => setModoUso(event.target.value)}
                        />
                    <TextField
                        id="txtRestricoes"
                        label="Restrições"
                        multiline
                        rows={4}
                        value={restricoes}
                        variant="filled"
                        onChange={event => setRestricoes(event.target.value)}
                        />
                </div>
                <div>
                    <FormControl fullWidth>
                        <InputLabel id="lblFamiliaProdutos">Família de Produtos</InputLabel>
                        <Select
                            labelId="lblFamiliaProdutos"
                            id="selFamiliaProdutos"
                            value={familiaProdutos}
                            label="Família de Produtos"
                            onChange={handleChangeFamiliaProdutos}
                        >
                            {familiasProdutos.map((familia_produto: FamiliaProdutos) => (
                                <MenuItem key={familia_produto.id} value={familia_produto.id}>{familia_produto.id}:{familia_produto.nome}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
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
