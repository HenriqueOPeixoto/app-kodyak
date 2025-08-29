import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import useAxiosInstance from "../../../service/AxiosInstance";

interface PagamentoDialogProps {
    open: boolean,
    handleClose: () => void,
    status: number | undefined
}

interface FormaPagamento {
    label: string
    id: number,
    descricao: string
}

interface Parcelamento {
    label: string
    id: number,
    descricao: string,
    formaPagamento: number
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const PagamentoDialog: React.FC<PagamentoDialogProps> = ({ open, handleClose, status }) => {

    const axios = useAxiosInstance()

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    
    const [formaPagamento, setFormaPagamento] = useState('')
    const [parcelamento, setParcelamento] = useState('')

    const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([])
    const [parcelamentos, setParcelamentos] = useState<Parcelamento[]>([])

//    const [bloqueado, setBloqueado] = useState(false)

    useEffect(() => {
        axios.get(`${backendBaseURL}/api/formas_pagamento`)
        .then((results) => {
            setFormasPagamento(results.data)
        })
        .catch((error) => {
            console.error('Não foi possível carregar as formas de pagamento: ' + error)
        })
    }, [])

    useEffect(() => {
        axios.get(`${backendBaseURL}/api/formas_pagamento/${formaPagamento}/parcelamentos`)
        .then((results) => {
            setParcelamentos(results.data)
        })
        .catch((error) => {
            console.error('Não foi possível carregar as opções de parcelamento para o pagamento selecionado: ' + error)
        })
    }, [formaPagamento])

    // IMPLEMENTAR DEPOIS QUE A FUNCIONALIDADE BASICA ESTIVER PRONTA
    /*useEffect(() => {
        // AQUI ESTÁ PERMITINDO ALTERAR CASO O USUÁRIO TEMPORARIAMENTE
        // RETORNE O STATUS PARA CRIADO !!!
        console.log(status)
        if (status) setBloqueado(true)
            else setBloqueado(false)
    }, [status])*/

    const handleChangeFormaPagamento = (event: SelectChangeEvent) => {
        setFormaPagamento(event.target.value as string)
        setParcelamento('')
    } 

    const handleChangeParcelamento = (event: SelectChangeEvent) => {
        setParcelamento(event.target.value as string)
    } 

    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
                <DialogTitle>Informações de Pagamento</DialogTitle>
                <DialogContent>
                    <FormControl sx={{mt: '5px'}}>
                        <InputLabel
                            >Forma de Pagamento</InputLabel>
                        <Select
                            
                            label="Forma de Pagamento"
                            onChange={handleChangeFormaPagamento}
                            sx={{ width: '300px' }}
                            variant='standard'

                        >
                            
                            {formasPagamento.map((formaPagamento: FormaPagamento) => (
                                <MenuItem key={formaPagamento.id} value={formaPagamento.id}>{formaPagamento.descricao}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                </DialogContent>
                <DialogContent>
                    <FormControl>
                        <InputLabel
                            >Parcelamento</InputLabel>
                        <Select
                            
                            label="Parcelamento"
                            onChange={handleChangeParcelamento}
                            sx={{ width: '300px' }}
                            variant='standard'

                        >
                            {parcelamentos.map((parcelamento: Parcelamento) => (
                                <MenuItem key={parcelamento.id} value={parcelamento.id}>{parcelamento.descricao}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                </DialogContent>

                <DialogActions>
                <Button onClick={handleClose}>
                    Cancelar
                </Button>
                <Button onClick={() => { 
                    console.log("Confirmed"); 
                    handleClose();
                }} variant="contained">
                    Confirmar
                </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default PagamentoDialog;