import * as React from 'react';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, Snackbar, SpeedDial, SpeedDialAction, SpeedDialIcon, Tab, Tabs, TextField } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate, useParams } from 'react-router-dom';

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
    descricao: string,
    cliente: number
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

interface Item {
    produto: Produto,
    quantidade: number,
    valor: number
}

interface PedidoVenda {
    id: number,
    cliente_endereco: number,
    status: number,
    observacoes: string,
    data: string
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const actions = [
    { icon: <AddShoppingCartIcon />, name: 'AdicionarItem', label: 'Adicionar Item' },
    { icon: <PrintIcon />, name: 'Print', label: 'Imprimir' },
    { icon: <ShareIcon />, name: 'Share', label: 'Compartilhar' },
];

export default function Pedido() {
    const navigate = useNavigate();

    // ID do pedido atual
    // Se id != null, bloquear edição de cliente/endereço
    // Se id == null, bloquear adição de itens
    const { id } = useParams()
    const [pedido, setPedido] = React.useState<PedidoVenda | null>(null)
    const [clientes, setClientes] = React.useState<Cliente[]>([])
    const [enderecos, setEnderecos] = React.useState<Endereco[]>([])
    
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0)
    const [cliente, setCliente] = React.useState<Cliente | null>(null)
    const [endereco, setEndereco] = React.useState<Endereco | null>(null)
    const [listaEnderecos, setListaEnderecos] = React.useState<Endereco[]>([])
    const [observacoes, setObservacoes] = React.useState<string>('')

    const [openNovoItemDialog, setOpenNovoItemDialog] = React.useState(false)
    const [snackOpen, setSnackOpen] = React.useState(false) 
    const [snackMessage, setSnackMessage] = React.useState('')

    const [itensPedido, setItensPedido] = React.useState<Item[]>([]);
    const [valorTotal, setValorTotal] = React.useState<number>(0.0)

    // Listagem de clientes
    React.useEffect(() => {
        axios.get(`${backendBaseURL}/api/clientes`)
            .then((results) => {
                setClientes(results.data)
            })
            .catch((error) => { console.error('Não foi possível listar os clientes: ' + error) })
        if (id) {
            axios.get(`${backendBaseURL}/api/pedidos/${id}`)
                .then((pedidoResults) => {
                    const pedidoData = pedidoResults.data[0]
                    setPedido(pedidoData)
                    setObservacoes(pedidoData.observacoes)
    
                    return axios.get(`${backendBaseURL}/api/clientes_enderecos/${pedidoData.cliente_endereco}`)
                })
                .then((enderecoResults) => {
                    const enderecoData = enderecoResults.data[0]
                    enderecoData.label = `${enderecoData.id} - ${enderecoData.inscricao_estadual} - ${enderecoData.descricao}`
                    setEndereco(enderecoData)
                
                    return axios.get(`${backendBaseURL}/api/clientes/${enderecoData.cliente}`)
                })
                .then((clienteResults) => {
                    const clienteData = clienteResults.data[0]
                    clienteData.label = `${clienteData.id} - ${clienteData.nome}`
                    setCliente(clienteData)
                    
                })
                .catch((error) => { console.error('Ocorreu um erro ao buscar os dados do pedido: ' + error) })
            }
    }, [])

    // Quando um cliente for selecionado, buscar a lista de endereços dele
    React.useEffect(() => {
        if (cliente && !id) {
            //setEndereco(null)
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
        }
    }, [cliente])

    React.useEffect(() => {
        setListaEnderecos(enderecos.map((endereco) => {
            return {
                label: `${endereco.id} - ${endereco.inscricao_estadual} - ${endereco.descricao}`,
                id: endereco.id,
                inscricao_estadual: endereco.inscricao_estadual,
                descricao: endereco.descricao,
                cliente: endereco.cliente
            }
        }))
    }, [enderecos])

    const listaClientes = React.useMemo(() => { 
        return clientes.map((cliente) => {
            return {
                label: `${cliente.id} - ${cliente.nome}`,
                id: cliente.id,
                nome: cliente.nome
            }
        })
    }, [clientes])

    // Quando um novo item for adicionado ao pedido, atualizar label de valor total.
    React.useEffect(() => {
        let novoValorTotal = 0.0
        itensPedido.map((item) => {
            novoValorTotal += item.valor
        })
        setValorTotal(novoValorTotal)
    }, [itensPedido])

    const handleClose = () => {
        navigate('/pedidos')
    };

    const handleSalvarPedido = () => {
        // Salvar pedido no backend
        axios.put(`${backendBaseURL}/api/pedidos`, {
            "cliente_endereco": endereco?.id,
            "status": 10,
            "observacoes": observacoes,
            "data": new Date().toISOString(),
        })
        .then(() => {
            console.log('Pedido salvo com sucesso!')
            navigate('/pedidos')
        })
        .catch((error) => {
            console.error('Não foi possível salvar o pedido: ' + error)
        })
    }

    const handleTabChange = (_e: React.SyntheticEvent, tabIndex: number) => {
        setCurrentTabIndex(tabIndex)
    }

    const handleOpenNovoItemDialog = () => {
        if (id) {
            setOpenNovoItemDialog(true)
        } else {
            handleAbrirSnack('Salve o pedido antes de adicionar itens.')
        }
    }

    const handleCloseNovoItemDialog = () => {
        setOpenNovoItemDialog(false)
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

    const handleAbrirSnack = (message: string) => {
        setSnackMessage(message)
        setSnackOpen(true)
    }

    const handleFecharSnack = () => {
        setSnackOpen(false)
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
                        Pedido {id ? id : 'Novo'}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleSalvarPedido}>
                        save
                    </Button>
                </Toolbar>
            </AppBar>

            <div className='TelaPedido' >

                <div className='Cabecalho' >
                    <Autocomplete
                        className='TxtCliente'
                        disablePortal
                        disabled={id ? true : false}
                        options={listaClientes}
                        sx={{ width: 300 }}
                        value={cliente}
                        getOptionLabel={(option) => option.label} // Como exibir cada opção
                        onChange={(_event, novoCliente) => {
                            setCliente(novoCliente)
                        }}
                        renderInput={(params) => <TextField {...params} label="Cliente" />}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                    />
                    <Autocomplete
                        className='TxtEndereco'
                        disablePortal
                        disabled={id ? true : false}
                        options={listaEnderecos}
                        sx={{ width: 300 }}
                        value={endereco}
                        getOptionLabel={(option) => option.label} // Como exibir cada opção
                        onChange={(_event, novoEndereco) => {
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
                            multiline
                            minRows={3}
                            maxRows={3}
                            variant='filled'
                            value={observacoes}
                            onChange={(event) => {
                                setObservacoes(event.target.value)
                            }}
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
                        <Typography className='LblValor' variant='h5'>{
                                new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(valorTotal)
                            }
                        </Typography>
                    </div>
                </Toolbar>
            </AppBar>
            <NovoItemPedido open={openNovoItemDialog} handleClose={handleCloseNovoItemDialog} onAdicionarItemAoCarrinho={adicionarItemAoPedido}/>
            <Snackbar
                open={snackOpen}
                autoHideDuration={6000}
                onClose={handleFecharSnack}
                message={snackMessage}
            />
        </div>
    );
}
