'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Link, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';
import Organization from '@/components/helpers/Organization';


const Locked = ({ iconFontSize, iconPadding = 8 }) => {
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();

  const [openDialog, setOpenDialog] = useState(false);

  const path = Organization.getPath({ organizations, organization_id });

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setOpenDialog(true);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setLoading(true));
    setOpenDialog(false);
    startTransition(() => {
      router.push('/pricing');
    });
  };

  const handleLiveWinRate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setLoading(true));
    setOpenDialog(false);
    startTransition(() => {
      router.push(`/${path}/picks?view=stats`);
    });
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDialog(false);
  };

  return (
    <>
      <IconButton style = {{ padding: iconPadding }} onClick={handleClick}><LockIcon style={{ fontSize: iconFontSize || '24px' }} color='error' /></IconButton>
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
          <DialogContentText id="alert-dialog-description">
            <Link style = {{ cursor: 'pointer' }} underline="hover" onClick = {handleLiveWinRate}>View the live win rate</Link>
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
};

export default Locked;
