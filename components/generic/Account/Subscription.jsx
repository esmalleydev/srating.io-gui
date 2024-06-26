'us client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import moment from 'moment';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import { useClientAPI } from '@/components/clientAPI';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';



const Subscription = (props) => {
  const self = this;

  const router = useRouter();
  const dispatch = useAppDispatch();

  const subscription = props.subscription;
  const pricing = props.pricing;
  const api_keys = props.api_keys;

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelledSub, setCancelledSub] = useState(null);
  const [apiKey, setApiKey] = useState(null);


  // should only be one...
  if (apiKey === null) {
    for (let api_key_id in api_keys) {
      if (api_keys[api_key_id].subscription_id === subscription.subscription_id) {
        setApiKey(api_keys[api_key_id]);
        break;
      }
    }
  }

  const renewDay = moment(subscription.renewed);

  let due;

  if (
    pricing.code === 'picks_yearly'
  ) {
    due = moment(subscription.renewed).add(1, 'years');
  } else {
    due = moment(subscription.renewed).add(1, 'months');
  }


  const handleCancelOpen = () => {
    setCancelOpen(true);
  };

  const handleCancelClose = () => {
    setCancelOpen(false);
  };

  const handleCancelSubscription = () => {
    dispatch(setLoading(true));
    handleCancelClose();
    useClientAPI({
      'class': 'billing',
      'function': 'cancelSubscription',
      'arguments': {
        'subscription_id': subscription.subscription_id
      }
    }).then(response => {
      dispatch(setLoading(false));
      setCancelledSub(response);
    }).catch((err) => {
      // nothing for now
    });
  };

  const handleRegenerate = () => {
    dispatch(setLoading(true));
    useClientAPI({
      'class': 'api_key',
      'function': 'regenerate',
      'arguments': {
        'key': apiKey.key
      }
    }).then((response) => {
      setApiKey(null);
      setApiKey(response);
      dispatch(setLoading(false));
      if (response.api_key_id) {
        api_keys[api_key.api_key_id] = response;
      }
    }).catch((err) => {
      // nothing for now
    });
  };

  const handleRenewClick = () => {
    dispatch(setLoading(true));
    router.push('/pricing');
  };

  return (
    <Paper elevation={3} style = {{'minWidth': 320, 'maxWidth': 450, 'width': 'auto', 'padding': 15}}>
      <Typography style = {{'textAlign': 'center'}} variant='h5'>{pricing.type === 'api' || pricing.type === 'trial' ? 'API' : 'Picks'} subscription ({pricing.name})</Typography>
      <Typography style = {{'marginTop': 5}} color = {'text.secondary'} variant='body1'>{pricing.description}</Typography>
      {pricing.type !== 'trial' && cancelledSub === null && !subscription.expires ? <Typography variant='body1'>Automatically renews on {due.format('MMM Do \'YY')}</Typography> : ''}
      {(cancelledSub && cancelledSub.expires) || subscription.expires ? <Typography variant='body1'>Expires on {moment(subscription.expires || cancelledSub.expires).format('MMM Do \'YY')}</Typography> : ''}
      {
        (pricing.type === 'api' || pricing.type === 'trial') && apiKey ?
        <div>
          <hr />
          <Typography color = {'text.secondary'} variant='subtitle1'>API key</Typography>
          <div>
            <Typography variant='body1'>{apiKey.key}</Typography>
            {cancelledSub === null && !subscription.expires ? <div style = {{'textAlign': 'right'}}><Button onClick={handleRegenerate}>Regenerate</Button></div> : ''}
          </div>
          <Typography color = {'text.secondary'} variant='subtitle1'>Usage</Typography>
          <Typography variant='body1'>{apiKey.requests || 0} / {apiKey.request_limit} requests</Typography>
          <Typography color = {'text.secondary'} variant='subtitle2'>Resets 1st of every month.</Typography>
        </div>
        : ''
      }
      {
        pricing.type !== 'trial' ?
        <div style = {{'textAlign': 'right'}}>
          {
            cancelledSub === null && !subscription.expires ? <Button onClick={handleCancelOpen} color='error'>Cancel subscription</Button> : <Button onClick={handleRenewClick} color='success'>Renew</Button>
          }
        </div>
        : ''
      }
      <Dialog
        open={cancelOpen}
        onClose={handleCancelClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Cancel subscription?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Subscription will remain active until next billing date.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose} autoFocus>Back</Button>
          <Button onClick={handleCancelSubscription}>
            Cancel subscription
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default Subscription;