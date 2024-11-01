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
import { TextField } from '@mui/material';

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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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

                    <div className='Cabecalho' style={{}}>
                        
                    </div>
                    <div className='ListaProdutos' style={{}}>
                    <hr />

                        
                    
                    </div>
                </div>

                {/* Footer AppBar */}
                <AppBar position="fixed" sx={{ top: 'auto', bottom: 0 , backgroundColor: '#074173'}}>
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
