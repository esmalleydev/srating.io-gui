'use client';

// import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import Style from '../utils/Style';
// import Button from '../ux/buttons/Button';
// import Paper from '../ux/container/Paper';
// import Typography from '../ux/text/Typography';

const Alert = (
  { open, title, message, confirm, confirmText = 'Ok' }:
  { open: boolean, title: string, message: string, confirm: () => void, confirmText?: string },
) => {
  // const [open, setOpen] = useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    // setOpen(false);
    confirm();
  };

  // const overlayStyle = {
  //   opacity: 1,
  //   transition: 'opacity 225ms cubic-bezier(0.4, 0, 0.2, 1)',
  //   height: '100%',
  //   display: 'flex',
  //   'justify-content': 'center',
  //   'align-items': 'center',
  // };

  // const buttonsStyle = {
  //   display: 'flex',
  //   justifyContent: 'right',
  // };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
    // <div className={Style.getStyleClassName(overlayStyle)}>
    //   <Paper elevation={5} style={{ maxWidth: 600 }}>
    //     <Typography type = 'h2'>{title}</Typography>
    //     <Typography type='p'>{message}</Typography>
    //     <div className={Style.getStyleClassName(buttonsStyle)}>
    //       <Button title='Refresh' value = 'refresh' handleClick={handleClose} />
    //     </div>
    //   </Paper>
    // </div>
  );
};

export default Alert;
