import React, { useState } from 'react';
import { useRouter } from 'next/router';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import LockIcon from '@mui/icons-material/Lock';
import BackdropLoader from '../BackdropLoader';


const Locked = (props) => {
  const self = this;

  const router = useRouter();

  const [openDialog, setOpenDialog] = useState(false);
  const [spin, setSpin] = useState(false);


  const handleSubscribe = () => {
    setSpin(true);
    router.push('/pricing').then(() => {
      setSpin(false);
    });
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <BackdropLoader open = {(spin === true)} />
      <IconButton onClick={() => {setOpenDialog(true);}}><LockIcon fontSize='small' color='error' /></IconButton>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Subscription required'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Subscribe for just $5 per month to get access to win percentages for every game!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Maybe later</Button>
          <Button onClick={handleSubscribe} autoFocus>
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Locked;