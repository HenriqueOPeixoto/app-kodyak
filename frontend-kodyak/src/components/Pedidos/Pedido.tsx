import * as React from 'react';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, Backdrop, Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, SpeedDial, SpeedDialAction, SpeedDialIcon, Tab, Tabs, TextField, Tooltip } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useNavigate, useParams } from 'react-router-dom';

import './styles/Pedido.css'
import ItensPedido from './AbasPedido/ItensPedido';
import useAxiosInstance from "../../service/AxiosInstance";
import NovoItemPedido from './AbasPedido/NovoItemPedido';
import FretePedido from './AbasPedido/FretePedido'
import PagamentoDialog from './AbasPedido/PagamentoDialog';

interface Cliente {
    label: string,
    id: number,
    nome: string,
    representante: string
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
    id: number
    produto: Produto,
    quantidade: number,
    valor: number
}

interface StatusPedido {
    id: number,
    descricao: string,
    ordem: number
}

const calcularValorTotalFrete = (
        valorFrete: number | undefined, 
        icmsFretePercentual: number | undefined, 
        valorChapa: number | undefined,
        valorExtra: number | undefined
    ) => {
        valorFrete = Number(valorFrete || 0)
        icmsFretePercentual = Number(icmsFretePercentual || 0) / 100
        valorChapa = Number(valorChapa || 0)
        valorExtra = Number(valorExtra || 0)

        return valorFrete + (valorFrete * icmsFretePercentual) + valorChapa + valorExtra
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const actions = [
    { icon: <AddShoppingCartIcon />, name: 'AdicionarItem', label: 'Adicionar Item' },
    { icon: <CreditCardIcon />, name: 'AdicionarFormaPgto', label: 'Forma de Pagamento' },
    { icon: <PrintIcon />, name: 'Print', label: 'Imprimir' },
    { icon: <ShareIcon />, name: 'Share', label: 'Compartilhar' },
];

const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

export default function Pedido() {
    const axios = useAxiosInstance()
    const navigate = useNavigate();

    // ID do pedido atual
    // Se id != null, bloquear edição de cliente/endereço
    // Se id == null, bloquear adição de itens
    const { id } = useParams()
    const [clientes, setClientes] = React.useState<Cliente[]>([])
    const [enderecos, setEnderecos] = React.useState<Endereco[]>([])
    
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0)
    const [cliente, setCliente] = React.useState<Cliente | null>(null)
    const [endereco, setEndereco] = React.useState<Endereco | null>(null)
    const [listaEnderecos, setListaEnderecos] = React.useState<Endereco[]>([])
    const [observacoes, setObservacoes] = React.useState<string>('')
    const [status, setStatus] = React.useState<string>('0')
    const [statusLiberados, setStatusLiberados] = React.useState<StatusPedido[]>()

    const [openNovoItemDialog, setOpenNovoItemDialog] = React.useState(false)
    const [openFretePedidoDialog, setOpenFretePedidoDialog] = React.useState(false)
    const [openPagamentoDialog, setOpenPagamentoDialog] = React.useState(false)
    const [snackOpen, setSnackOpen] = React.useState(false) 
    const [snackMessage, setSnackMessage] = React.useState('')

    const [loadingBackdropOpen, setLoadingBackdropOpen] = React.useState(true)

    const [itensPedido, setItensPedido] = React.useState<Item[]>([]);
    const [valorTotal, setValorTotal] = React.useState<number>(0.0)
    const [valorFrete, setValorFrete] = React.useState<number>(0.0)
    const [icmsVendaPercentual, setIcmsVendaPercentual] = React.useState<number>(0.0)

    React.useEffect(() => {
        let usuario: { 
            nome: string, 
            email: string, 
            nivel_acesso: number,
            representante: number,
            status_liberados: number[]
        } | null = null

        let statusPedido: StatusPedido[] = [];
        axios.get(`${backendBaseURL}/api/clientes`)
            .then((results) => {
                setClientes(results.data)

                return axios.get(`${backendBaseURL}/api/usuarios/eu`)
            })
            .then((usuarioResults) => {
                usuario = usuarioResults.data

                return axios.get(`${backendBaseURL}/api/status_pedido`)
            })
            .then((statusPedidoResults) => {
                statusPedido = statusPedidoResults.data

                setStatusLiberados(statusPedido.filter(status => {
                    return usuario?.status_liberados.includes(status.id)
                }))

            })
            .catch((error) => { console.error('Não foi possível listar os clientes: ' + error) })
            .finally(() => { if (!id) setLoadingBackdropOpen(false) })
            if (id) {
                axios.get(`${backendBaseURL}/api/pedidos/${id}`)
                .then((pedidoResults) => {
                    const pedidoData = pedidoResults.data[0]
                    setObservacoes(pedidoData.observacoes)
                    setStatus(pedidoData.status)
                    setIcmsVendaPercentual(pedidoData.icms_venda_percentual)
                    
                    setValorFrete(calcularValorTotalFrete(
                        pedidoData.valor_frete,
                        pedidoData.icms_frete_percentual,
                        pedidoData.valor_chapa,
                        pedidoData.valor_extra
                    ))
                    
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
                    
                    return axios.get(`${backendBaseURL}/api/pedidos_itens/pedido/${id}/completo`)
                })
                .then((itensPedidoResults) => {
                    
                    setItensPedido(itensPedidoResults.data.map((item: any) => {
                        const produtoItem: Produto = {
                            id: item.id_produto,
                            nome: item.nome,
                            valor: item.valor,
                            indicacoes: item.indicacoes,
                            modo_uso: item.modo_uso,
                            restricoes: item.restricoes,
                            peso: item.peso,
                            consumo_diario: item.consumo_diario,
                            familia_produtos: item.familia_produtos,
                            inativo: item.inativo
                        }
                        return {
                            id: item.id,
                            produto: produtoItem,
                            quantidade: item.quantidade,
                            valor: item.valor
                        }
                    }))

                })
                .catch((error) => { console.error('Ocorreu um erro ao buscar os dados do pedido: ' + error) })
                .finally(() => { setLoadingBackdropOpen(false) })
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
                nome: cliente.nome,
                representante: cliente.representante
            }
        })
    }, [clientes])

    // Quando um novo item for adicionado ao pedido, atualizar label de valor total.
    React.useEffect(() => {
        let novoValorTotal = 0.0
        itensPedido.map((item) => {
            novoValorTotal = Number(novoValorTotal) + Number(item.valor)
        })
        novoValorTotal += novoValorTotal * icmsVendaPercentual / 100
        novoValorTotal += valorFrete
        setValorTotal(novoValorTotal)
    }, [itensPedido, valorFrete])

    const handleClose = () => {
        navigate('/pedidos')
    };

    const handleSalvarPedido = () => {
        // Salvar pedido no backend
        // se id não for informado, cria um novo pedido
        if (!id) {
            if (cliente?.representante && endereco?.id) {
                axios.post(`${backendBaseURL}/api/pedidos`, {
                    "cliente_endereco": endereco?.id,
                    "status": status,
                    "observacoes": observacoes,
                    "data": new Date().toISOString(),
                    "representante": cliente?.representante
                })
                    .then((response) => {
                        handleAbrirSnack('Pedido salvo com sucesso!')
                        //navigate('/pedidos')
                        navigate('/pedidos/editar_pedido/' + response.data.id)
                    })
                    .catch((error) => {
                        handleAbrirSnack('Não foi possível salvar o pedido: ' + error)
                        console.error('Não foi possível salvar o pedido: ' + error)
                    })
            } else if (!cliente?.representante) { handleAbrirSnack('Erro: O cliente selecionado não possui representante cadastrado.') }
            else { handleAbrirSnack('Erro: Nem todos os campos obrigatórios foram preenchidos.') }
        } else {
            axios.put(`${backendBaseURL}/api/pedidos/${id}`, {
                "observacoes": observacoes,
                /* 
                    Abaixo tem um truque, pois node é meio imprevisível às vezes.
                    Um dos status possíveis é Criado (id=0). Porém, lá no backend é feita a verificação
                    if (status) para verificar se foi informado um status.
                    Como 0 é um valor falsy, é como se nenhum status tivesse sido informado, então nunca volta para
                    o status 0.
                    Mandar o valor como string, permite que if (status) seja avaliado como true quando status = 0
                    e o valor é registrado devidamente no banco de dados.
                */
                "status": status.toString()
            })
            .then(() => { handleAbrirSnack('Pedido alterado com sucesso!') })
        }
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

    const handleOpenFretePedidoDialog = () => {
        setOpenFretePedidoDialog(true)
    }
    
    const handleCloseFretePedidoDialog = () => {
        setOpenFretePedidoDialog(false)

    }

    const handleOpenPagamentoDialog = () => {
        setOpenPagamentoDialog(true)
    }
    
    const handleClosePagamentoDialog = () => {
        setOpenPagamentoDialog(false)
    }

    const handleAcaoSpeedDial = (actionname: string) => {
        switch (actionname) {
            case 'AdicionarItem':
                handleOpenNovoItemDialog()
                break
            case 'AdicionarFormaPgto':
                handleOpenPagamentoDialog()
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
        axios.post(`${backendBaseURL}/api/pedidos_itens`, {
            "pedido": id,
            "produto": item.produto.id,
            "quantidade": item.quantidade,
            "valor": item.valor
        })
        .then((response) => {
            const newItem = { ...item, id: response.data.id };
            setItensPedido((prevItens) => [...prevItens, newItem]); // Adiciona novo item na lista com ID
        })
        .catch((error) => {
            console.error('Não foi possível salvar o item do pedido: ' + error)
        });
    };

    const removerItemDoPedido = (itemId: number) => {
        axios.delete(`${backendBaseURL}/api/pedidos_itens/${itemId}`)
        .then(() => {
            setItensPedido(itensPedido.filter((item) => item.id !== itemId))
        })
        .catch((error) => {
            handleAbrirSnack('Não foi possível remover o item do pedido')
            console.error('Não foi possível remover o item do pedido: ' + error)
        })
    }

    const alterarItemPedido = (itemId: number, novaQuantidade: number, novoValor: number) => {
        axios.put(`${backendBaseURL}/api/pedidos_itens/${itemId}`, {
            valor: novoValor,
            quantidade: novaQuantidade
        })
            .then(() => {
                setItensPedido((prevItens) => 
                    prevItens.map((item) => 
                        item.id === itemId ? { ...item, quantidade: novaQuantidade, valor: novoValor } : item
                    )
                )
            })
            .catch((error) => {
                handleAbrirSnack('Não foi possível alterar a quantidade do item.')
                console.error('Não foi possível alterar a quantidade do item: ' + error)
            })
    }

    const handleAbrirSnack = (message: string) => {
        setSnackMessage(message)
        setSnackOpen(true)
    }

    const handleFecharSnack = () => {
        setSnackOpen(false)
    }

    /**
     * Essa função deve ser passada para que FretePedido possa atualizar o valor na tela de pedido.
     * @param valorFrete number
     */
    const changeValorFretePedido = (valorFrete: number) => {
        setValorFrete(valorFrete)
    }

    return (
        <div className='Pedido'>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loadingBackdropOpen}
                >
                <CircularProgress color="inherit" />
            </Backdrop>
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
                            setEndereco(null)
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
                            onChange={(event: SelectChangeEvent) => { setStatus(event.target.value) }}
                            value={status}

                            variant='standard'

                        >
                            {statusLiberados?.map(status => (
                                <MenuItem value={status.id}>{status.descricao}</MenuItem>
                            ))}
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
                            <ItensPedido listaItens={itensPedido} onDeleteItem={removerItemDoPedido} onAlterarItem={alterarItemPedido} />
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
                    <Tooltip title={id ? 'Clique aqui para definir informações de frete.' : 'Crie um pedido para configurar frete.'} placement='top'>
                        <div className='InfoFrete' onClick={handleOpenFretePedidoDialog} > {/* Info frete */}
                            <Typography color={'black'}>
                                Valor Frete: <br />
                                {formatter.format(valorFrete)}
                            </Typography>
                        </div>
                    </Tooltip>
                    <div className='ContainerValorTotal'> {/* Valor total */}
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px'}}>
                            <Typography>Valor Total:</Typography>
                            <Typography className='LblValor' variant='h5'>{
                                    formatter.format(valorTotal)
                                }
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px'}}>
                            <Typography>ICMS: {icmsVendaPercentual || 0}%</Typography>
                        </Box>
                    </div>
                </Toolbar>
            </AppBar>
            <NovoItemPedido open={openNovoItemDialog} handleClose={handleCloseNovoItemDialog} onAdicionarItemAoCarrinho={adicionarItemAoPedido}/>
            <PagamentoDialog open={openPagamentoDialog} handleClose={handleClosePagamentoDialog} status={parseInt(status)} />
            {/* Só renderiza a tela FretePedido se tiver id */}
            { id && endereco && 
                <FretePedido
                    open={openFretePedidoDialog} 
                    handleClose={handleCloseFretePedidoDialog} 
                    idPedido={id} 
                    enderecoPedido={endereco.id} 
                    setValorFreteInPedido={changeValorFretePedido}
                    setIcmsVendaPercentualInPedido={setIcmsVendaPercentual}
                />}
            <Snackbar
                open={snackOpen}
                autoHideDuration={6000}
                onClose={handleFecharSnack}
                message={snackMessage}
            />
        </div>
    );
}
