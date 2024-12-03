import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
//import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
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

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const NovoItemPedido: React.FC<NovoItemPedidoProps> = ({ open, handleClose, handleConfirm }) => {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [familiaProdutos, setFamiliaProdutos] = React.useState('')
    const [familiasProdutos, setFamiliasProdutos] = React.useState<FamiliaProduto[]>([])

    React.useEffect(() => {
        axios.get(`${backendBaseURL}/api/familia_produtos/`, {
            params: {
                inativo: false
            }
        })
        .then((results) => { setFamiliasProdutos(results.data) })
        .catch((error) => { console.error('Não foi possível listar as famílias de produtos: ' + error) })
    }, [])

    const handleChangeFamiliaProduto = (event: SelectChangeEvent) => {
        setFamiliaProdutos(event.target.value as string)
    }

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
                <DialogContent sx={{display:'flex', flexDirection: 'column', gap: '15px', minWidth: '480px'}}>
                    <TextField label="Buscar produto"/>
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
