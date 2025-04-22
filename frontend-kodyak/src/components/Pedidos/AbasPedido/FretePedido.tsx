import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc'

import useAxiosInstance from '../../../service/AxiosInstance'
import { NumericFormat, PatternFormat } from 'react-number-format';

dayjs.extend(utc)

interface FretePedidoProps {
    open: boolean,
    handleClose: () => void,
    idPedido: string,
    enderecoPedido: number,
    setValorFreteInPedido: (valorFrete: number) => void
}

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

interface FretePedido {
    retirada_loja: boolean,
    logradouro_entrega: string,
    numero_entrega: string,
    cep_entrega: string,
    municipio_entrega: string,
    uf_entrega: string,
    valor_frete: number,
    valor_transbordo: number,
    valor_chapa: number,
    data_agendamento: string
}

const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

/**
 * Componente para lidar com o caso no qual o cliente prefere retirar o pedido por conta própria.
 */
const AgendadorRetirada = ({ handleClose, idPedido, setValorFreteInPedido }: { handleClose: () => void, idPedido: string, setValorFreteInPedido: (valorFrete: number) => void }) => {

    const axios = useAxiosInstance()
    const [data, setData] = useState<Dayjs | null>(null)

    useEffect(() => {
        axios.get(`${backendBaseURL}/api/pedidos/${idPedido}`)
            .then((response) => {
                setData(response.data[0].data_agendamento ? dayjs.utc(response.data[0].data_agendamento) : null)
            })
            .catch((error) => {
                console.error('Erro ao buscar dados do pedido:', error);
            })
    }, [])

    const handleSubmit = () => {

        if (!data) {
            console.error('Data não selecionada');
            return;
        }

        // Se houver dados de endereço de entrega, o banco irá
        // apagá-los, pois retirada_loja === true executa a procedure
        // SET_RETIRADA_LOJA() 
        const formData = {
            retirada_loja: true,
            data_agendamento: data.format('YYYY-MM-DD')
        }

        axios.put(`${backendBaseURL}/api/pedidos/${idPedido}/frete`, formData)
            .then((response) => {
                console.log('Dados enviados com sucesso:', response.data);
                setValorFreteInPedido(0)
            })
            .catch((error) => {
                console.error('Erro ao enviar os dados:', error);
            })

        setData(null);
        handleClose();
    }

    return (
        <>
            <Typography sx={{ textAlign: 'center', mt: '20px', mb:'10px', fontWeight: 'bold'}}>Agendar Pedido</Typography>
            <DatePicker value={data} onChange={setData}/>
            <Button 
                variant='contained'
                sx={{ mt: '20px', mb: '20px', width: '100%' }}
                color='success'
                onClick={handleSubmit}
            >
                Confirmar
            </Button>
            
        </>
    )
}

/**
 * Componente usado quando o cliente opta pelo envio do pedido
 */
const CadastroEnvio = ({ idPedido, enderecoPedido, handleClose, setValorFreteInPedido }: { idPedido: string, enderecoPedido: number, handleClose: () => void, setValorFreteInPedido: (valorFrete: number) => void }) => {
    const axios = useAxiosInstance()

    const [valorFreteVisivel, setValorFreteVisivel] = useState<boolean>(false)
    
    const [valorFreteExiste, setValorFreteExiste] = useState<boolean>(false)
    const [ultimaCidadeSelecionada, setUltimaCidadeSelecionada] = useState<string>('')

    const [listaEstados, setListaEstados] = useState<Estado[]>([])
    const [listaCidades, setListaCidades] = useState<Cidade[]>([])

    const [estado, setEstado] = useState<Estado | null>(null)
    const [cidade, setCidade] = useState<Cidade | null>(null)
    const [logradouro, setLogradouro] = useState<string>('')
    const [numero, setNumero] = useState<string>('')
    const [cep, setCep] = useState<string>('')
    const [valorTransbordo, setValorTransbordo] = useState<number | undefined>(undefined)
    const [valorChapa, setValorChapa] = useState<number | undefined>(undefined)
    const [valorFrete, setValorFrete] = useState<number | undefined>(undefined)

    const [data, setData] = useState<Dayjs | null>(null)



    useEffect(() => {
        axios.get(`${backendBaseURL}/api/localidades/unidades_federativas`)
            .then((response) => {
                const estados = response.data.map((estado: Estado) => ({
                    id: estado.id,
                    nome: estado.nome,
                    sigla: estado.sigla,
                    regiao: estado.regiao
                }))
                setListaEstados(estados)
            })
            .catch((error) => {
                console.error('Ocorreu um erro ao buscar os estados' + error)
            })

        // TODO: Quando o token expira erro (403), esse request é reexecutado
        // Todas as alterações do usuário na tela de frete são perdidas.
        axios.get(`${backendBaseURL}/api/clientes_enderecos/${enderecoPedido}`)
            .then((response) => {
                const enderecoData = response.data[0]

                setLogradouro(enderecoData.logradouro)
                setNumero(enderecoData.numero)
                setCep(enderecoData.cep)

                return axios.get(`${backendBaseURL}/api/localidades/municipios/${enderecoData.cidade}/view`)
            })
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
            .catch((error) => {
                console.error('Ocorreu um erro ao buscar o endereço do pedido' + error)
            })
    }, [])

    useEffect(() => {
        if (estado) {
            axios.get(`${backendBaseURL}/api/localidades/municipios/`,
                {
                    params: {
                        id_uf: estado.id
                    }
                }
            )
                .then((response) => {
                    const cidades = response.data.map((cidade: Cidade) => ({
                        id_municipio: cidade.id_municipio,
                        nome_municipio: cidade.nome_municipio,
                        id_uf: cidade.id_uf
                    }))
                    setListaCidades(cidades)
                })
                .catch((error) => {
                    console.error('Ocorreu um erro ao buscar as cidades' + error)
                })
        }
    }, [estado])

    useEffect(() => {
        handleCalcularFrete()
    }, [cidade])


    const handleCalcularFrete = () => {
        if (cidade) {
            axios.get(`${backendBaseURL}/api/fretes/`, {
                params: {
                    id_municipio: cidade.id_municipio
                }
            })
                .then((response) => {
                    if (response.data[0]){
                        setValorFreteExiste(true)
                        setValorFrete(response.data[0].valor_frete)
                    }
                    else {
                        setValorFreteExiste(false)
                        setUltimaCidadeSelecionada(cidade.nome_municipio || 'CIDADE_NAO_LOCALIZADA')
                    }
                })
                .catch((error) => {
                    console.error('Ocorreu um erro ao buscar os dados do frete. ' + error)
                })

                setValorFreteVisivel(true)
        } else {
            setValorFreteExiste(false)
            setValorFreteVisivel(false)
        }
    }

    const handleSubmit = () => {

        if (!cidade || !data) {
            console.error('Erro ao consultar objetos. Verifique se os campos CIDADE e DATA estão sendo gerados corretamente.')
            return
        }

        const formData = {
            retirada_loja: false,
            valor_frete: valorFrete,
            municipio_entrega: cidade.id_municipio,
            cep_entrega: cep,
            logradouro_entrega: logradouro,
            numero_entrega: numero,
            valor_transbordo: valorTransbordo,
            valor_chapa: valorChapa,
            data_agendamento: data.format('YYYY-MM-DD')
        }

        axios.put(`${backendBaseURL}/api/pedidos/${idPedido}/frete`, formData)
            .then((response) => {
                console.log('Dados enviados com sucesso:', response.data);

                setValorFrete(0)
                setCidade(null)
                setCep('')
                setLogradouro('')
                setNumero('')
                setValorTransbordo(0)
                setValorChapa(0)
                setData(null)

                setValorFreteInPedido(Number(valorFrete || 0) + Number(valorChapa || 0) + Number(valorTransbordo || 0))

                handleClose()
            })
            .catch((error) => {
                console.error('Erro ao enviar os dados:', error);
            })
    }
    
    return (
        <Box sx={{display: 'flex', gap: '10px', flexDirection: 'column', mt: '20px'}}>
            <Box sx={{display: 'flex', gap: '10px', flexDirection: 'row'}}>
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
            </Box>
            <Box>

                <PatternFormat
                    id="txtCep"
                    label="CEP"
                    value={cep}
                    customInput={TextField}
                    format="#####-###"
                    mask="_"
                    required
                    onValueChange={(values) => {
                        setCep(values.value);
                    }}
                    
                    />
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: 'wrap'}}>
                <TextField 
                    label="Logradouro"
                    value={logradouro}
                    required
                    sx={{minWidth: '400px', mb: '10px'}}
                    onChange={event => setLogradouro(event.target.value.toUpperCase())}
                />
                <TextField 
                    label="Número"
                    value={numero}
                    required
                    sx={{maxWidth: '100px'}}
                    onChange={event => setNumero(event.target.value.toUpperCase())}
                />
            </Box>
            <NumericFormat
                label='Valor Transbordo'
                customInput={TextField}
                thousandSeparator="."
                decimalSeparator=","
                value={valorTransbordo}
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                onValueChange={(values) => { setValorTransbordo(values.floatValue as number) }}
            />
            <NumericFormat
                label='Valor Chapa'
                customInput={TextField}
                thousandSeparator="."
                decimalSeparator=","
                value={valorChapa}
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                onValueChange={(values) => { setValorChapa(values.floatValue as number) }}
            />
            {valorFreteVisivel && <Box sx={{ display: 'flex', justifyContent: 'end', flexDirection: 'column' }}>
                <Typography color={valorFreteExiste ? '' : 'error'} sx={{ textAlign: 'center', mt: '20px', mb:'10px', fontWeight: 'bold'}}>
                    {valorFreteExiste ? 
                        <Box>
                            {`Valor Frete: ${formatter.format(valorFrete ?? 0)}`}
                            <br />
                            {`Valor Total: ${formatter.format(Number(valorFrete ?? 0) + Number(valorChapa ?? 0) + Number(valorTransbordo ?? 0))}`}
                        </Box> :
                        `Não existe frete cadastrado para ${ultimaCidadeSelecionada}`}
                </Typography>
                
                { valorFreteExiste && <Box sx={{  display: 'flex', justifyContent: 'end', flexDirection: 'column' }}>
                    <Typography sx={{fontWeight: 'bold'}}>Agendar Pedido</Typography>
                    <DatePicker value={data} onChange={setData}/>
                    <Button 
                        variant='contained'
                        sx={{ mt: '20px', mb: '20px', width: '100%' }}
                        color='success'
                        onClick={handleSubmit}
                        >
                        Confirmar
                    </Button>
                </Box>}
            </Box>}
        </Box>
    )
}

const FretePedido: React.FC<FretePedidoProps> = ({ open, handleClose, idPedido, enderecoPedido, setValorFreteInPedido }) => {
    const axios = useAxiosInstance()

    const [tipoFrete, setTipoFrete] = useState('')
    const [fretePedido, setFretePedido] = useState<FretePedido | null>(null)
    const [carregando, setCarregando] = useState<boolean>(true)

    // Armazena se o pedido já tem alguma informação de frete cadastrada.
    // Se houver, mostra o resumo do frete e pergunta se quer alterar.
    const [exibindoTelaResumo, setExibindoTelaResumo] = useState<boolean>(true)
    
    const handleTipoFreteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTipoFrete(event.target.value)
    }

    const buscarInfoFrete = () => {
        axios.get(`${backendBaseURL}/api/pedidos/${idPedido}/frete`)
            .then((response) => {
                if (response.data.retirada_loja !== null) {
                    setExibindoTelaResumo(true)

                    setFretePedido(response.data)
                } else setExibindoTelaResumo(false)
            })
            .catch((error) => {
                console.error('Não foi possível verificar se o frete já existe. ' + error)
            })
            .finally(() => {
                setCarregando(false)
            })
        }
    
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                // 
                TransitionProps={{ onEntered: () => {
                        buscarInfoFrete() 
                    },
                    onExit: () => {
                        setTipoFrete('')
                    }
                }}
                
            >
                <DialogTitle>
                    {"Frete"}
                </DialogTitle>
                <DialogContent sx={{display: 'flex', flexDirection: 'column', minWidth: '400px'}}>
                    {exibindoTelaResumo && 
                    <Box sx={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
                        <Typography sx={{textAlign: 'center'}}>Resumo:</Typography>
                        <Divider></Divider>
                        {carregando ? <CircularProgress sx={{ alignSelf: 'center'}} /> :
                            <>
                                <Typography>Retirada na loja: {fretePedido?.retirada_loja ? 'Sim' : 'Não'}</Typography>
                                <Typography>Data Agendamento: {fretePedido?.data_agendamento ? dayjs.utc(fretePedido.data_agendamento).format('DD/MM/YYYY') : ''}</Typography>
                            </>
                        }
                        {
                            fretePedido?.retirada_loja === false &&
                            <>
                                <Typography>Logradouro: {fretePedido?.logradouro_entrega}</Typography>
                                <Typography>Número: {fretePedido?.numero_entrega}</Typography>
                                <Typography>CEP: {fretePedido?.cep_entrega}</Typography>
                                <Typography>Cidade: {fretePedido?.municipio_entrega}</Typography>
                                <Typography>Estado: {fretePedido?.uf_entrega}</Typography>
                                <Typography>Valor Frete: {
                                    formatter.format(fretePedido?.valor_frete || 0)
                                }</Typography>
                                <Typography>Valor Transbordo: {
                                    formatter.format(fretePedido?.valor_transbordo || 0)
                                }</Typography>
                                <Typography>Valor Chapa: {
                                    formatter.format(fretePedido?.valor_chapa || 0)
                                }</Typography>
                            </>

                        }

                        <Button sx={{mt: '10px'}} variant='contained' onClick={() => setExibindoTelaResumo(false)}>Alterar Frete</Button>
                    </Box>
                    }
                    {!exibindoTelaResumo && <FormControl required sx={{marginLeft: '15px', textAlign: 'center', alignItems: 'center'}}>
                        <FormLabel id="frete-select-label" required>Selecione a forma de entrega:</FormLabel>
                        <RadioGroup
                            aria-labelledby="tipo-frete-radio-buttons-group-label"
                            defaultValue="0"
                            name="tipo-frete-radio-buttons-group"
                            onChange={handleTipoFreteChange}
                            value={tipoFrete}
                            row
                        >
                            <FormControlLabel disabled={exibindoTelaResumo} value="0" control={<Radio />} label="Cliente Retira" />
                            <FormControlLabel disabled={exibindoTelaResumo} value="1" control={<Radio />} label="Envio ao Cliente" />
                        </RadioGroup>
                    </FormControl>}

                    {tipoFrete === '0' && 
                        <AgendadorRetirada 
                            handleClose={handleClose} 
                            idPedido={idPedido} 
                            setValorFreteInPedido={setValorFreteInPedido} 
                        />}
                    {tipoFrete === '1' && 
                        <CadastroEnvio 
                            idPedido={idPedido} 
                            enderecoPedido={enderecoPedido} 
                            handleClose={handleClose} 
                            setValorFreteInPedido={setValorFreteInPedido} 
                        />}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

export default FretePedido
