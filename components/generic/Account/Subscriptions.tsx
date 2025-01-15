'use client';

import { Button, Paper, Typography } from '@mui/material';

import { ApiKeys, Pricings, Subscriptions as SubscriptionsType } from '@/types/general';
import Subscription from './Subscription';
import { useRouter } from 'next/navigation';


const Subscriptions = (
  { subscriptions, pricing, api_keys = {} }:
  { subscriptions: SubscriptionsType | undefined, pricing: Pricings | undefined; api_keys: ApiKeys | undefined },
) => {
  const router = useRouter();
  const subscriptionsContainer: React.JSX.Element[] = [];

  if (subscriptions) {
    const subscription_id_x_api_key = {};
    for (const api_key_id in api_keys) {
      const row = api_keys[api_key_id];
      subscription_id_x_api_key[row.subscription_id] = row;
    }
    for (const subscription_id in subscriptions) {
      const subscription = subscriptions[subscription_id];
      const p = (subscription.pricing_id && pricing && pricing[subscription.pricing_id]) || null;

      if (p) {
        subscriptionsContainer.push(
          <div style = {{ display: 'flex', justifyContent: 'center', margin: '10px 0px' }}>
            <Subscription
              subscription = {subscription}
              pricing = {p}
              api_key = {(subscription_id in subscription_id_x_api_key ? subscription_id_x_api_key[subscription_id] : null)}
            />
          </div>,
        );
      }
    }
  }

  if (!subscriptionsContainer.length) {
    subscriptionsContainer.push(
      <div style = {{ display: 'flex', justifyContent: 'center', margin: '10px 0px' }}>
        <Paper elevation={3} style = {{ minWidth: 320, maxWidth: 450, width: 'auto', padding: 15 }}>
          <Typography variant='h5'>No active subscriptions</Typography>
          <Typography color = {'text.secondary'} variant='body1'>Subscribe today for picks or API access!</Typography>
          <div style = {{ textAlign: 'right' }}><Button onClick={() => { router.push('/pricing'); }}>View pricing</Button></div>
        </Paper>
      </div>,
    );
  }


  return (
    <>
      {subscriptionsContainer}
    </>
  );
};

export default Subscriptions;
