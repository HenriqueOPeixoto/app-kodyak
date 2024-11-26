import * as React from 'react';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, SpeedDial, SpeedDialAction, SpeedDialIcon, Tab, Tabs, TextField } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import { useNavigate } from 'react-router-dom';

import './styles/Pedido.css'
import ItensPedido from './AbasPedido/ItensPedido';
import axios from 'axios';

interface Cliente {
    id: number,
    nome: string
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const actions = [
    { icon: <PrintIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' },
];

export default function Pedido() {
    const navigate = useNavigate();

    const [clientes, setClientes] = React.useState<Cliente[]>([])
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0)
    const [cliente, setCliente] = React.useState<Cliente | null>(null)

    React.useEffect(() => {
        axios.get(`${backendBaseURL}/api/clientes`)
            .then((results) => {
                setClientes(results.data)
            })
            .catch((error) => { console.error('Não foi possível listar os clientes: ' + error) })
    }, [])

    const listaClientes = clientes.map((cliente) => {
        return {
            label: `${cliente.id} - ${cliente.nome}`,
            id: cliente.id,
            nome: cliente.nome
        }
    })

    const handleClose = () => {
        navigate('/pedidos')
    };

    const handleTabChange = (_e: React.SyntheticEvent, tabIndex: number) => {
        setCurrentTabIndex(tabIndex)
    }

    return (
        <div className='Pedido'>
            <AppBar className='BarraSuperior' >
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography className='LblNumPedido' variant="h6" component="div">
                        Pedido 00000
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleClose}>
                        save
                    </Button>
                </Toolbar>
            </AppBar>

            <div className='TelaPedido' >

                <div className='Cabecalho' >
                    <Autocomplete
                        className='TxtCliente'
                        disablePortal
                        options={listaClientes}
                        sx={{ width: 300 }}
                        value={cliente}
                        onChange={(event, novoCliente) => {
                            setCliente(novoCliente)
                        }}
                        renderInput={(params) => <TextField {...params} label="Cliente" />}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                    />

                    <FormControl className='ContainerSelecaoStatus' sx={{ marginLeft: '10px' }}>
                        <InputLabel className='LblStatus'
                            id="status-pedido-label">Status do Pedido</InputLabel>
                        <Select
                            labelId="status-pedido-label"
                            id="status-pedido-select"
                            className='SelectStatus'

                            label="Status do Pedido"
                            onChange={() => { }}

                            variant='standard'

                        >
                            <MenuItem value={10}>Pendente</MenuItem>
                            <MenuItem value={20}>Análise Financeira</MenuItem>
                            <MenuItem value={30}>Aprovado</MenuItem>
                            <MenuItem value={40}>Faturado</MenuItem>
                            <MenuItem value={50}>Em Rota</MenuItem>
                            <MenuItem value={60}>Entregue</MenuItem>
                            <MenuItem value={70}>Pagamento em Atraso</MenuItem>
                            <MenuItem value={80}>Recusado</MenuItem>
                        </Select>
                    </FormControl>
                    <div className='ContainerObservacao' >
                        <TextField
                            className='Observacao'
                            id="txtObservacoes"
                            label="Observações"
                            defaultValue=""
                            multiline
                            minRows={3}
                            maxRows={3}
                            variant='filled'
                            InputProps={{
                                style: {
                                    fontSize: '14px'
                                }
                            }}
                        />

                    </div>

                </div>
                <div className='ContainerConteudo'>
                    <Box className='ContainerAbas' sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={currentTabIndex}
                            onChange={handleTabChange}
                            variant='scrollable'
                        >
                            <Tab label="Itens" />
                            <Tab label="Histórico" />
                            <Tab label="Documentos" />
                            <Tab label="Pagamentos" />
                        </Tabs>
                    </Box>

                    {currentTabIndex === 0 && (
                        <Box className='ContainerItensPedido'>
                            <ItensPedido />
                        </Box>
                    )
                    }
                    {currentTabIndex === 1 && <Box><p>Histórico</p></Box>}
                    {currentTabIndex === 2 && <Box><p>Documentos</p></Box>}
                    {currentTabIndex === 3 && <Box><p>Pagamentos</p></Box>}

                </div>
            </div>

            {/* Footer AppBar */}
            <AppBar className='BarraInferior' sx={{ position: 'fixed', bottom: 0, top: 'auto' }}>
                <Toolbar>

                    <SpeedDial
                        ariaLabel="SpeedDial basic example"
                        direction='right'
                        icon={<SpeedDialIcon />}
                        FabProps={{
                            sx: {
                                bgcolor: '#a7cf45',
                                '&:hover': {
                                    bgcolor: '#a7cf45',
                                }
                            }
                        }}
                    >
                        {actions.map((action) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                            />
                        ))}
                    </SpeedDial>
                    <div /> {/* Apenas para empurrar as divs abaixo para o meio e para a esquerda*/}
                    <div className='InfoFrete' > {/* Info frete */}
                        <Typography color={'black'}>
                            Valor Chapa:<br />
                            Valor Frete:
                        </Typography>
                    </div>
                    <div className='ContainerValorTotal'> {/* Valor total */}
                        <Typography>Valor Total:</Typography>
                        <Typography className='LblValor' variant='h5'>R$ 0,00</Typography>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}
