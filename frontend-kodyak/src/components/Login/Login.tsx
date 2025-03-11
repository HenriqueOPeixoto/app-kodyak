import { Avatar, Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

export default function Login() {
    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState<string>('')
    const [senha, setSenha] = useState<string>('')
    const [msgErro, setMsgErro] = useState<string>(location.state ? location.state.message : '')

    const handleSubmit = () => {
        // Se usuário e senha são válidos, o backend devolve um token de autenticação

        axios.post(`${backendBaseURL}/api/auth/login`, 
            { email: email, senha: senha },
            { 
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            .then(() => {
                // Access Token e Refresh Token são salvos como cookies de navegação.
                // Como os tokens são http-only, precisa usar { withCredentials: true }
                // no request disparado via axios.
                
                // Uma vez que o login foi bem sucedido, navegar para /avisos
                navigate('/avisos')
            })
            .catch((error) => {
                setMsgErro(error.response.data)
            })


    }

    return (
        <Container maxWidth="xs">
            <Paper elevation={10} sx={{marginTop: '10%', padding: '2%'}}>
                <Typography component="h1" variant="h5" color="#074173" sx={{textAlign: 'center'}}>Login</Typography>
                <Avatar sx={{
                    mx: "auto",
                    textAlign: "center",
                    mb: "1",
                    mt: "10px"
                }}></Avatar>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ mt: 1 }}
                >
                    <TextField 
                        label="E-mail"
                        fullWidth
                        required
                        autoFocus
                        value={email}
                        sx={{mb: 2}}
                        onChange={(event) => {
                            setEmail(event.target.value)
                        }}
                    />
                    <TextField
                        label="Senha"
                        fullWidth
                        required
                        type="password"
                        autoComplete="current-password"
                        value={senha}
                        sx={{mb: 2}}
                        onChange={(event) => {
                            setSenha(event.target.value)
                        }}
                    />
                    <Typography color='red' sx={{textAlign: 'center', wordWrap: 'break-word'}}>{msgErro}</Typography>
                    <Button variant='contained' fullWidth onClick={handleSubmit} sx={{mt:1}}>Entrar</Button>
                </Box>
            </Paper>
            
        </Container>
    )   
}