import { Box, Button, Card, CardActionArea, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Typography } from "@mui/material"

import '../styles/Cadastros.css'
import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "axios"

interface TabelaEnderecosProps {
    clienteId: string;
  }

interface Enderecos {
    id: number
    descricao: string
    inscricao_estadual: string
    telefone_fixo: string
    telefone_celular: string
    email: string
    cep: string
    logradouro: string
    numero: string
    bairro: string
    cidade: string
    estado: string
    cliente: string
}

const CardEnderecos: React.FC<{ enderecos: Enderecos }> = ({ enderecos }) => {
    return (
        <Card className="CardEndereco" variant="outlined">
            <Link to={`/cadastros/editar_cliente/${enderecos.cliente}/editar_endereco/${enderecos.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <CardActionArea>
                    <CardContent>
                        <Typography>{enderecos.descricao}</Typography>
                        <hr />
                        <Typography>IE: <b>{enderecos.inscricao_estadual}</b></Typography>
                        <Typography>Endereço: {enderecos.logradouro}, {enderecos.numero} - {enderecos.bairro}</Typography>
                        <Typography>{enderecos.cidade}, {enderecos.estado}</Typography>
                    </CardContent>
                </CardActionArea>
            </Link>
        </Card>
    )
}

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const TabelaEnderecos: React.FC<TabelaEnderecosProps> = ({ clienteId }) => {

    const [enderecos, setEnderecos] = useState<Enderecos[]>([])
    const [inscricaoEstadual] = useState<string>('')
    const [inativo, setInativo] = useState<boolean>(false)


    useEffect(() => {
        axios.get<Enderecos[]>(`${backendBaseURL}/api/clientes_enderecos/view`, {
            params: {
                "cliente": clienteId,
                "inativo": inativo
            }
        }
        )
            .then(response => {
                setEnderecos(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [inscricaoEstadual, inativo]);


    const handleInativoRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInativo(event.target.value === 'true')
    }

    return (
        <Box>
            <div className="TabelaEnderecos">
                <div className="ContainerFiltros">
                    <FormControl>
                        <FormLabel id="ativo-radio-button">Filtros</FormLabel>
                        <RadioGroup defaultValue="false" row onChange={handleInativoRadioButtonChange}>
                            <FormControlLabel value="false" control={<Radio />} label="Ativo" />
                            <FormControlLabel value="true" control={<Radio />} label="Inativo" />
                        </RadioGroup>
                    </FormControl>
                    <div className="Botoes">
                        {/* <Button className="BtnPesquisar" variant="contained">Pesquisar</Button> */}
                        <Link to={`/cadastros/editar_cliente/${clienteId}/novo_endereco`}>
                            <Button className="BtnIncluir" variant="contained" color="success">Incluir</Button>
                        </Link>
                    </div>
                </div>
                <Grid container spacing={2} style={{ overflowY: 'auto', height: '80vh' }}>
                    {enderecos.map((enderecos) => (
                        <Grid item xs={12} key={enderecos.id}>
                            <CardEnderecos enderecos={enderecos} />
                        </Grid>
                    ))}
                </Grid>
            </div>
        </Box>
    )
}

export default TabelaEnderecos