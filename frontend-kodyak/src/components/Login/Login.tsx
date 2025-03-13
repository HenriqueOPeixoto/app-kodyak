import { Avatar, Box, Button, CircularProgress, Container, Paper, TextField, Typography } from "@mui/material";
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
    const [loading, setLoading] = useState<boolean>(false)

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault() // Evitar que a página recarregue

        setLoading(true)

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
                setLoading(false)
                navigate('/avisos')
            })
            .catch((error) => {
                if (error.response) {
                    setMsgErro(error.response.data)
                } else {
                    setMsgErro('Falha de comunicação. Entre em contato com o administrador.')
                    console.log('Erro: Uma tentativa de contatar o backend não foi bem sucedida. Verifique o servidor.')
                }
                setLoading(false)
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
                        type="password"
                        autoComplete="current-password"
                        value={senha}
                        sx={{mb: 2}}
                        onChange={(event) => {
                            setSenha(event.target.value)
                        }}
                    />
                    <Typography color='red' sx={{textAlign: 'center', wordWrap: 'break-word'}}>{msgErro}</Typography>
                    <Button 
                        disabled={loading ? true : false}
                        variant='contained'
                        fullWidth
                        type="submit"
                        sx={{mt:1}}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
                        </Button>
                </Box>
            </Paper>
            
        </Container>
    )   
}