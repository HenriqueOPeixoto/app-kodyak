import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
//import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { FormControl, InputLabel, List, ListItem, ListItemButton, ListItemText, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import axios from 'axios';


interface NovoItemPedidoProps {
    open: boolean,
    handleClose: () => void,
    handleConfirm: () => void
}

interface FamiliaProduto {
    id: number,
    nome: string
}

interface Produto {
    id: number
    nome: string
    valor: number
    indicacoes: string
    modo_uso: string
    restricoes: number
    peso: number
    consumo_diario: number
    familia_produtos: number
    inativo: boolean
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const NovoItemPedido: React.FC<NovoItemPedidoProps> = ({ open, handleClose, handleConfirm }) => {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [familiaProdutos, setFamiliaProdutos] = React.useState('')
    const [familiasProdutos, setFamiliasProdutos] = React.useState<FamiliaProduto[]>([])
    const [listaProdutos, setListaProdutos] = React.useState<Produto[]>([])
    const [produto, setProduto] = React.useState('')
    const [buscaProduto, setBuscaProduto] = React.useState('')

    React.useEffect(() => {
        axios.get(`${backendBaseURL}/api/familia_produtos/`, {
            params: {
                inativo: false
            }
        })
            .then((results) => { setFamiliasProdutos(results.data) })
            .catch((error) => { console.error('Não foi possível listar as famílias de produtos: ' + error) })
    }, [])

    // TODO: Buscar os produtos e criar uma lista para selecionar.
    React.useEffect(() => {
        axios.get(`${backendBaseURL}/api/produtos`, {
            params: {
                inativo: false
            }
        })
            .then((results) => { console.log(results.data); setListaProdutos(results.data) })
            .catch((error) => { console.error('Não foi possível listar os produtos: ' + error) })
    }, [familiaProdutos, buscaProduto])

    const handleChangeFamiliaProduto = (event: SelectChangeEvent) => {
        setFamiliaProdutos(event.target.value as string)
    }

    const handleTxtBuscaProdutos = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBuscaProduto(event.target.value as string)
    }

    // Formatar preço no padrão pt-BR
    const formatarPreco = (preco: number | bigint) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(preco);
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullScreen={fullScreen}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Novo Item"}
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '480px' }}>
                    <TextField className='TxtBuscaProduto' label="Buscar produto" onChange={handleTxtBuscaProdutos} />
                    <FormControl className='ContainerSelecaoFamilia'>
                        <InputLabel className='LblSelecaoFamilia'
                            id="selecao-familia-label">Família de Produtos</InputLabel>
                        <Select
                            labelId="selecao-familia-label"
                            id="familia-produto-select"
                            className='SelectFamiliaProduto'

                            label="Família de Produtos"
                            onChange={handleChangeFamiliaProduto}

                            variant='standard'

                        >
                            {familiasProdutos.map((familia: FamiliaProduto) => (
                                <MenuItem key={familia.id} value={familia.id}>{familia.nome}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <List sx={{ overflowY: 'auto' }}>
                        {listaProdutos.map((produto) => (
                            <ListItem key={produto.id} disablePadding>
                                <ListItemButton onClick={() => { }/*handleAddToCart(product)*/}>
                                    <ListItemText primary={produto.nome} secondary={formatarPreco(produto.valor)} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button color='error' onClick={handleConfirm} autoFocus>
                        Continuar
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default NovoItemPedido;
