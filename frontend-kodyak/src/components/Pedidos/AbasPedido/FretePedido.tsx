import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

interface FretePedidoProps {
    open: boolean,
    handleClose: () => void
}

/**
 * Componente para lidar com o caso no qual o cliente prefere retirar o pedido por conta própria.
 */
const AgendadorRetirada = () => {
    return (
        <>
            <Button>Agendar Pedido</Button>
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

                    {tipoFrete === '0' && <AgendadorRetirada />}
                    {tipoFrete === '1' && <CadastroEnvio />}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

export default FretePedido
