import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc'

import useAxiosInstance from '../../../service/AxiosInstance'

dayjs.extend(utc)

interface FretePedidoProps {
    open: boolean,
    handleClose: () => void,
    idPedido: string
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
const CadastroEnvio = () => {
    return (
        <>
            Enviar ao cliente
        </>
    )
}

const FretePedido: React.FC<FretePedidoProps> = ({ open, handleClose, idPedido }) => {
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
            >
                <DialogTitle>
                    {"Frete"}
                </DialogTitle>
                <DialogContent sx={{display: 'flex', flexDirection: 'column'}}>
                    <FormControl required sx={{marginLeft: '15px'}}>
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

                    {tipoFrete === '0' && <AgendadorRetirada handleClose={handleClose} idPedido={idPedido}/>}
                    {tipoFrete === '1' && <CadastroEnvio />}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

export default FretePedido
