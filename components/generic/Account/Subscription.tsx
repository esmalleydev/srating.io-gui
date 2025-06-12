'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import moment from 'moment';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import { useClientAPI } from '@/components/clientAPI';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';
import { ApiKey, Pricing, Subscription as SubscriptionType } from '@/types/general';
import Paper from '@/components/ux/container/Paper';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';



const Subscription = (
  { subscription, pricing, api_key }:
  { subscription: SubscriptionType; pricing: Pricing; api_key: ApiKey | null; },
) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelledSub, setCancelledSub] = useState<SubscriptionType | null>(null);
  const [apiKey, setApiKey] = useState<ApiKey | null>(api_key);


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
      class: 'billing',
      function: 'cancelSubscription',
      arguments: {
        subscription_id: subscription.subscription_id,
      },
    }).then((response) => {
      dispatch(setLoading(false));
      setCancelledSub(response);
    }).catch((err) => {
      // nothing for now
    });
  };

  const handleRegenerate = () => {
    dispatch(setLoading(true));

    if (!apiKey) {
      return;
    }
    useClientAPI({
      class: 'api_key',
      function: 'regenerate',
      arguments: {
        key: apiKey.key,
      },
    }).then((response) => {
      setApiKey(response);
      dispatch(setLoading(false));
    }).catch((err) => {
      // nothing for now
    });
  };

  const handleRenewClick = () => {
    dispatch(setLoading(true));
    router.push('/pricing');
  };

  let expiration = subscription.expires;

  if (cancelledSub) {
    expiration = cancelledSub.expires;
  }

  return (
    <Paper elevation={3} style = {{ minWidth: 320, maxWidth: 450, width: 'auto', padding: 15 }}>
      <Typography style = {{ textAlign: 'center' }} type='h5'>{pricing.type === 'api' || pricing.type === 'trial' ? 'API' : 'Picks'} subscription ({pricing.name})</Typography>
      <Typography style = {{ marginTop: 5, color: theme.text.secondary, textAlign: 'center' }} type='body1'>{pricing.description}</Typography>
      {pricing.type !== 'trial' && cancelledSub === null && !subscription.expires ? <Typography type='body1'>Automatically renews on {due.format('MMM Do \'YY')}</Typography> : ''}
      {expiration ? <Typography type='body1'>Expires on {moment(expiration).format('MMM Do \'YY')}</Typography> : ''}
      {
        (pricing.type === 'api' || pricing.type === 'trial') && apiKey ?
        <div>
          <hr />
          <Typography style = {{ color: theme.text.secondary }} type='subtitle1'>Usage</Typography>
          <Typography type='body1'>{apiKey.requests || 0} / {apiKey.request_limit} requests</Typography>
          <Typography style = {{ color: theme.text.secondary }} type='subtitle2'>Resets 1st of every month.</Typography>
          <hr />
          <Typography style = {{ color: theme.text.secondary }} type='subtitle1'>API key</Typography>
          <div>
            <Typography type='body1'>{apiKey.key}</Typography>
            {cancelledSub === null && !subscription.expires ? <div style = {{ textAlign: 'right' }}><Button onClick={handleRegenerate}>Regenerate</Button></div> : ''}
          </div>
        </div>
          : ''
      }
      {
        pricing.type !== 'trial' ?
        <div style = {{ textAlign: 'right' }}>
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
};

export default Subscription;
