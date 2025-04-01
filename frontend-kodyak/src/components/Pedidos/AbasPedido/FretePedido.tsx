import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';


interface FretePedidoProps {
    open: boolean,
    handleClose: () => void
}

/**
 * Componente para lidar com o caso no qual o cliente prefere retirar o pedido por conta própria.
 */
const AgendadorRetirada = ({ handleClose }: { handleClose: () => void }) => {
    const [data, setData] = useState<Dayjs | null>(null)

    const handleSubmit = () => {
        // Aqui você pode adicionar a lógica para enviar os dados do agendamento
        console.log('Data agendada:', data);
        // Fechar o modal após o envio
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

const FretePedido: React.FC<FretePedidoProps> = ({ open, handleClose }) => {
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

                    {tipoFrete === '0' && <AgendadorRetirada handleClose={handleClose}/>}
                    {tipoFrete === '1' && <CadastroEnvio />}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

export default FretePedido
