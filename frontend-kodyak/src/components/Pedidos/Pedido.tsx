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
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate } from 'react-router-dom';

import './styles/Pedido.css'
import ItensPedido from './AbasPedido/ItensPedido';
import axios from 'axios';
import NovoItemPedido from './AbasPedido/NovoItemPedido';

interface Cliente {
    label: string,
    id: number,
    nome: string
}

interface Endereco {
    label: string,
    id: number,
    inscricao_estadual: string,
    descricao: string
}

interface Item {
    produto: number,
    quantidade: number,
    valor: number
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const actions = [
    { icon: <AddShoppingCartIcon />, name: 'AdicionarItem', label: 'Adicionar Item' },
    { icon: <PrintIcon />, name: 'Print', label: 'Imprimir' },
    { icon: <ShareIcon />, name: 'Share', label: 'Compartilhar' },
];

export default function Pedido() {
    const navigate = useNavigate();

    const [clientes, setClientes] = React.useState<Cliente[]>([])
    const [enderecos, setEnderecos] = React.useState<Endereco[]>([])
    
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0)
    const [cliente, setCliente] = React.useState<Cliente | null>(null)
    const [endereco, setEndereco] = React.useState<Endereco | null>(null)
    const [listaEnderecos, setListaEnderecos] = React.useState<Endereco[]>([])

    const [openNovoItemDialog, setOpenNovoItemDialog] = React.useState(false)

    const [itensPedido, setItensPedido] = React.useState<Item[]>([]);

    // Listagem de clientes
    React.useEffect(() => {
        axios.get(`${backendBaseURL}/api/clientes`)
            .then((results) => {
                setClientes(results.data)
            })
            .catch((error) => { console.error('Não foi possível listar os clientes: ' + error) })
    }, [])

    // Quando um cliente for selecionado, buscar a lista de endereços dele
    React.useEffect(() => {
        setEndereco(null)
        axios.get<Endereco[]>(`${backendBaseURL}/api/clientes_enderecos`, {
            params: {
                "cliente": cliente?.id,
                "inativo": false
            }
        }
        )
        .then((results) => {
            setEnderecos(results.data)
        })
        .catch((error) => {
            console.error('Não foi possível listar os endereços do cliente: ' + cliente?.id + ': ' + error)
        })
    }, [cliente])

    React.useEffect(() => {
        setListaEnderecos(enderecos.map((endereco) => {
            return {
                label: `${endereco.id} - ${endereco.inscricao_estadual} - ${endereco.descricao}`,
                id: endereco.id,
                inscricao_estadual: endereco.inscricao_estadual,
                descricao: endereco.descricao
            }
        }))
    }, [enderecos])

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

    const handleOpenNovoItemDialog = () => {
        setOpenNovoItemDialog(true)
    }

    const handleCloseNovoItemDialog = () => {
        setOpenNovoItemDialog(false)
    }

    const handleConfirmNovoItem = () => {
        alert('Item selecionado')
    }

    const handleAcaoSpeedDial = (actionname: string) => {
        switch (actionname) {
            case 'AdicionarItem':
                handleOpenNovoItemDialog()
                break
            case 'Print':
                alert('Não implementado')
                break
            case 'Share':
                alert('Não implementado')
                break
        }
    }

    const adicionarItemAoPedido = (item: Item) => {
        setItensPedido((prevItens) => [...prevItens, item]); // Adiciona novo item na lista
      };

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
                        getOptionLabel={(option) => option.label} // Como exibir cada opção
                        onChange={(event, novoCliente) => {
                            setCliente(novoCliente)
                        }}
                        renderInput={(params) => <TextField {...params} label="Cliente" />}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                    />
                    <Autocomplete
                        className='TxtEndereco'
                        disablePortal
                        options={listaEnderecos}
                        sx={{ width: 300 }}
                        value={endereco}
                        getOptionLabel={(option) => option.label} // Como exibir cada opção
                        onChange={(event, novoEndereco) => {
                            setEndereco(novoEndereco)
                        }}
                        renderInput={(params) => <TextField {...params} label="Endereço" />}
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
                            <ItensPedido listaItens={itensPedido}/>
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
                                tooltipTitle={action.label}
                                onClick={() => { handleAcaoSpeedDial(action.name) }}
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
            <NovoItemPedido open={openNovoItemDialog} handleClose={handleCloseNovoItemDialog} handleConfirm={handleConfirmNovoItem} onAdicionarItemAoCarrinho={adicionarItemAoPedido}/>
        </div>
    );
}
