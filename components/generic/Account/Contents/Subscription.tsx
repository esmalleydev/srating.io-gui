'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useClientAPI } from '@/components/clientAPI';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/loading-slice';
import { ApiKey, Pricing, Subscription as SubscriptionType } from '@/types/general';
import Paper from '@/components/ux/container/Paper';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';
import Dates from '@/components/utils/Dates';
import Modal from '@/components/ux/modal/Modal';
import Button from '@/components/ux/buttons/Button';


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

  const renewDay = Dates.parse(subscription.renewed);

  let due: Date;

  if (
    pricing.code === 'picks_yearly'
  ) {
    due = Dates.add(subscription.renewed, 1, 'years');
  } else {
    due = Dates.add(subscription.renewed, 1, 'months');
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
    <div>
      <Typography type='h6'>{pricing.type === 'api' || pricing.type === 'trial' ? 'API' : 'Picks'} subscription ({pricing.name})</Typography>
      <Paper elevation={3} style = {{ minWidth: 320, maxWidth: 450, width: 'auto', padding: 20 }}>
        <Typography style = {{ marginTop: 5, color: theme.text.secondary }} type='body1'>{pricing.description}</Typography>
        {pricing.type !== 'trial' && cancelledSub === null && !subscription.expires ? <Typography type='body1'>Automatically renews on {Dates.format(due, 'M jS \'y')}</Typography> : ''}
        {expiration ? <Typography type='body1'>Expires on {Dates.format(expiration, 'M jS \'y')}</Typography> : ''}
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
              {cancelledSub === null && !subscription.expires ? <div style = {{ textAlign: 'right' }}><Button handleClick={handleRegenerate} title = 'Regenerate' ink value = 'regen' /></div> : ''}
            </div>
          </div>
            : ''
        }
        {
          pricing.type !== 'trial' ?
          <div style = {{ textAlign: 'right' }}>
            {
              cancelledSub === null && !subscription.expires ?
                <Button handleClick={handleCancelOpen} title = 'Cancel subscription' value = 'cancel' ink buttonStyle = {{ color: theme.error.main }} /> :
                <Button handleClick={handleRenewClick} title = 'Renew' value = 'renew' ink buttonStyle = {{ color: theme.success.main }} />
            }
          </div>
            : ''
        }
        <Modal
          open={cancelOpen}
          onClose={handleCancelClose}
        >
          <Typography type = 'h6'>{'Cancel subscription?'}</Typography>
          <Typography type = 'body1' style = {{ color: theme.text.secondary, margin: '10px 0px' }}>Subscription will remain active until next billing date.</Typography>
          <div style={{ textAlign: 'right', marginTop: 10 }}>
            <Button handleClick={handleCancelClose} autoFocus title='Back' ink value = 'back' />
            <Button handleClick={handleCancelSubscription} buttonStyle={{ backgroundColor: theme.error.main }} title = 'Cancel subscription' value = 'cancel' />
          </div>
        </Modal>
      </Paper>
    </div>
  );
};

export default Subscription;
