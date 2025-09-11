'use client';

import { useState, useTransition } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useClientAPI } from '@/components/clientAPI';
import CSV from '@/components/utils/CSV';
import { setLoading } from '@/redux/features/display-slice';
import { useAppDispatch } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import Tooltip from '@/components/ux/hover/Tooltip';

const DownloadOption = ({ view, organization_id, division_id, season }) => {
  const dispatch = useAppDispatch();
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [openDialog, setOpenDialog] = useState(false);


  const handleSubscribe = () => {
    dispatch(setLoading(true));
    setOpenDialog(false);
    startTransition(() => {
      router.push('/pricing?view=api');
    });
  };


  const handleClose = () => {
    setOpenDialog(false);
  };


  const handleDownload = () => {
    dispatch(setLoading(true));
    useClientAPI({
      class: 'ranking',
      function: 'download',
      arguments: {
        view,
        organization_id,
        division_id,
        season,
      },
    }).then((data) => {
      dispatch(setLoading(false));
      if (!data || data === false || data.error) {
        setOpenDialog(true);
      } else {
        CSV.download(data);
      }
    }).catch((e) => {
      dispatch(setLoading(false));
    });
  };



  return (
    <div>
      <Tooltip text = {'Download CSV'}>
        <IconButton
            color='primary'
            id="download-csv"
            aria-controls={open ? 'dialog' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleDownload}
          >
            <DownloadIcon />
        </IconButton>
      </Tooltip>
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
            Subscribe for $25 per month to get API and CSV download access
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Maybe later</Button>
          <Button onClick={handleSubscribe} autoFocus>
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DownloadOption;
