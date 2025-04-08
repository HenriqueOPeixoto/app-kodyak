import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
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
    enderecoPedido: number
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

/**
 * Componente para lidar com o caso no qual o cliente prefere retirar o pedido por conta própria.
 */
const AgendadorRetirada = ({ handleClose, idPedido }: { handleClose: () => void, idPedido: string }) => {

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
const CadastroEnvio = ({ enderecoPedido }: { enderecoPedido: number }) => {
    const axios = useAxiosInstance()
    
    const [logradouro, setLogradouro] = useState<string>('')
    const [numero, setNumero] = useState<string>('')
    const [cep, setCep] = useState<string>('')
    const [valorTransbordo, setValorTransbordo] = useState<number>(0)
    const [valorChapa, setValorChapa] = useState<number>(0)


    useEffect(() => {

        axios.get(`${backendBaseURL}/api/clientes_enderecos/${enderecoPedido}`)
            .then((response) => {
                const enderecoData = response.data[0]

                setLogradouro(enderecoData.logradouro)
                setNumero(enderecoData.numero)
                setCep(enderecoData.cep)
            })
            .catch((error) => {
                console.log('Ocorreu um erro ao buscar o endereço do pedido' + error)
            })
            
            
    }, [])
    
    return (
        <Box sx={{display: 'flex', gap: '10px', flexDirection: 'column', mt: '20px'}}>
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
            <Box>
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
            <Button
                variant='contained'
                color='success'
                onClick={() => console.log('Clicou no botão')}
            >
                Calcular Frete
            </Button>
        </Box>
    )
}

const FretePedido: React.FC<FretePedidoProps> = ({ open, handleClose, idPedido, enderecoPedido }) => {

    const [tipoFrete, setTipoFrete] = useState('')
    
    const handleTipoFreteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTipoFrete(event.target.value)
    }
    
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle>
                    {"Frete"}
                </DialogTitle>
                <DialogContent sx={{display: 'flex', flexDirection: 'column'}}>
                    <FormControl required sx={{marginLeft: '15px', textAlign: 'center', alignItems: 'center'}}>
                        <FormLabel id="frete-select-label" required>Selecione a forma de entrega:</FormLabel>
                        <RadioGroup
                            aria-labelledby="tipo-frete-radio-buttons-group-label"
                            defaultValue="0"
                            name="tipo-frete-radio-buttons-group"
                            onChange={handleTipoFreteChange}
                            value={tipoFrete}
                            row
                        >
                            <FormControlLabel value="0" control={<Radio />} label="Cliente Retira" />
                            <FormControlLabel value="1" control={<Radio />} label="Envio ao Cliente" />
                        </RadioGroup>
                    </FormControl>

                    {tipoFrete === '0' && <AgendadorRetirada handleClose={handleClose} idPedido={idPedido} />}
                    {tipoFrete === '1' && <CadastroEnvio enderecoPedido={enderecoPedido} />}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

export default FretePedido
