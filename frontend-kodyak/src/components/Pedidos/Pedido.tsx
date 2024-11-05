import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Box, FormControl, InputAdornment, InputLabel, MenuItem, Select, Tab, Tabs, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import './styles/Pedido.css'

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Pedido() {
    const [open, setOpen] = React.useState(false);

    const [currentTabIndex, setCurrentTabIndex] = React.useState(0)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTabChange = (e: React.SyntheticEvent, tabIndex: number) => {
        console.log(tabIndex)
        setCurrentTabIndex(tabIndex)
    }

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Open full-screen dialog
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'fixed', backgroundColor: '#074173' }}>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }} >
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1, textAlign: 'center' }} variant="h6" component="div">
                            Pedido 00000
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>

                <div className='Conteudo' >

                    <div className='Cabecalho' >
                        <div>
                            <TextField
                                id="txtCliente"
                                label="Cliente"
                                defaultValue=""
                                className='TxtCliente'
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => { alert('Aqui vai a seleção de cliente') }}>
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <FormControl style={{ minWidth: '200px', marginLeft: '10px' }}>
                                <InputLabel
                                    style={{
                                        textAlign: 'center',
                                        width: '100%'
                                    }}
                                    id="status-pedido-label">Status do Pedido</InputLabel>
                                <Select
                                    labelId="status-pedido-label"
                                    id="status-pedido-select"

                                    label="Status do Pedido"
                                    onChange={() => { }}

                                    variant='standard'

                                    style={{ textAlign: 'center' }}
                                >
                                    <MenuItem value={10}>Pendente</MenuItem>
                                    <MenuItem value={20}>Análise Financeira</MenuItem>
                                    <MenuItem value={30}>Aprovado</MenuItem>
                                    <MenuItem value={40}>Faturado</MenuItem>
                                    <MenuItem value={50}>Em Rota</MenuItem>
                                    <MenuItem value={60}>Entregue</MenuItem>
                                    <MenuItem value={70}>Pagamento em Atraso</MenuItem>
                                    <MenuItem value={80}>Recusado</MenuItem>
                                </Select>
                            </FormControl>

                        </div>
                        <div className='Observacao' >
                            <TextField
                                id="txtObservacoes"
                                label="Observações"
                                defaultValue=""
                                style={{ width: '80vw' }}
                                multiline
                                minRows={3}
                                maxRows={3}
                                variant='filled'
                                InputProps={{
                                    style: {
                                        fontSize: '14px'
                                    }
                                }}
                            />

                        </div>

                    </div>
                    <div className='ListaProdutos' style={{width:'100%'}}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs 
                                centered
                                value={currentTabIndex}
                                onChange={handleTabChange}
                            >
                                <Tab label="Itens" />
                                <Tab label="Histórico" />
                                <Tab label="Documentos" />
                                <Tab label="Pagamentos" />
                            </Tabs>
                        </Box>

                        {currentTabIndex === 0 && <Box><p>Itens</p></Box>}
                        {currentTabIndex === 1 && <Box><p>Histórico</p></Box>}
                        {currentTabIndex === 2 && <Box><p>Documentos</p></Box>}
                        {currentTabIndex === 3 && <Box><p>Pagamentos</p></Box>}

                    </div>
                </div>

                {/* Footer AppBar */}
                <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, backgroundColor: '#074173' }}>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1" component="div">
                            © 2024 Your Company
                        </Typography>
                        <Button color="inherit" onClick={() => alert('Footer Button Clicked')}>
                            Footer Button
                        </Button>
                    </Toolbar>
                </AppBar>
            </Dialog>
        </React.Fragment>
    );
}
