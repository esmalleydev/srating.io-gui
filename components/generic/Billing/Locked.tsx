'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/loading-slice';
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
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setOpenDialog(true);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    dispatch(setLoading(true));
    setOpenDialog(false);
    startTransition(() => {
      router.push('/pricing');
    });
  };

  const getLiveWinRateHref = () => {
    return `/${path}/picks?view=stats`;
  };

  const handleLiveWinRate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    dispatch(setLoading(true));
    setOpenDialog(false);
    startTransition(() => {
      router.push(getLiveWinRateHref());
    });
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setOpenDialog(false);
  };

  // why is this here? because react and MUI is stupid
  // Clicking on the Dialog fires a click event EVEN though I have none attached,
  // then it bubbles down to underneath it triggering those
  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  return (
    <>
      <IconButton style = {{ padding: iconPadding }} onClick={handleClick}><LockIcon style={{ fontSize: iconFontSize || '24px' }} color='error' /></IconButton>
      <Dialog
        onClick={onClick}
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
            Subscribe for just $5 per month to get access to win percentages and predicted score for every game!
          </DialogContentText>
          {/* <DialogContentText id="alert-dialog-description">
            <a style = {{ cursor: 'pointer', color: theme.link.primary }} onClick = {handleLiveWinRate} href = {getLiveWinRateHref()}>View the live win rate</a>
          </DialogContentText> */}
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
