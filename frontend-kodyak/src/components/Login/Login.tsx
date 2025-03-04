import { Avatar, Box, Button, Container, Paper, TextField, Typography } from "@mui/material";

export default function Login() {
    const handleSubmit = () => {
        console.log('login')
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
                    <TextField label="E-mail" fullWidth required autoFocus sx={{mb: 2}} />
                    <TextField label="Senha" fullWidth required sx={{mb: 2}} />
                    <Button type='submit' variant='contained' fullWidth sx={{mt:1}}>Entrar</Button>
                </Box>
            </Paper>
            
        </Container>
    )   
}