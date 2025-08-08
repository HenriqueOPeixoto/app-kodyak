import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
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
    
    const [formaPagamento, setFormaPagamento] = useState<FormaPagamento | null>(null)

    const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([])
    const [parcelamentos, setParcelamentos] = useState<Parcelamento[]>([])

    const [listaFormasPagamento, setListaFormasPagamento] = useState<FormaPagamento[]>([])
    const[listaParcelamentos, setListaParcelamentos] = useState<Parcelamento[]>([])

    useEffect(() => {
        axios.get(`${backendBaseURL}/api/formas_pagamento`)
        .then((results) => {
            setFormasPagamento(results.data)
        })
        .catch((error) => {
            console.error('Não foi possível carregar as formas de pagamento.')
        })
    }, [])

    React.useEffect(() => {
        setListaFormasPagamento(formasPagamento.map((formaPagamento) => {
            return {
                label: `${formaPagamento.descricao}`,
                id: formaPagamento.id,
                descricao: formaPagamento.descricao
            }
        }))
    }, [formasPagamento])

    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
                <DialogTitle>Forma de Pagamento</DialogTitle>
                <DialogContent>
                    {/* Abaixo eu trato dois casos no prop disabled
                        ordemStatusPedido === 0 
                        ordemStatusPedido === undefined  */}
                    <Autocomplete
                        disablePortal
                        
                        options={listaFormasPagamento}
                        sx={{ width: 300 }}
                        value={formaPagamento}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => <TextField {...params} label="Forma de Pagamento" />}
                    >
                        
                    </Autocomplete>
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