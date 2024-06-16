import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface DialogInativarProps {
    open: boolean,
    handleClose: () => void,
    handleConfirm: () => void
}

const DialogInativar: React.FC<DialogInativarProps> = ({ open, handleClose, handleConfirm }) => {

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Aviso!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja inativar o cadastro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button color='error' onClick={handleConfirm} autoFocus>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default DialogInativar;
