'use client';

import React from 'react';
import { Appearance, loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import CheckoutForm from './Billing/CheckoutForm';
import FreeTrialForm from './Billing/FreeTrialForm';
import Typography from '../ux/text/Typography';
import { useTheme } from '../hooks/useTheme';



// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const Billing = ({ pricing, open, closeHandler }) => {
  const theme = useTheme();

  const appearance: Appearance = {
    theme: (theme.mode === 'dark' ? 'night' : 'stripe'),
    labels: 'floating',
    variables: {
      colorBackground: theme.mode === 'dark' ? '#383838' : theme.background.main,
    },
    rules: {
      '.Input': {
        padding: '5px',
        // 'boxShadow': 'none',
        // 'border': 'none'
      },
      '.Tab': {
        padding: '5px',
      },
    },
  };

  const options: StripeElementsOptions = {
    // clientSecret,
    mode: 'subscription',
    amount: pricing.price * 100,
    currency: 'usd',
    appearance,
  };

  const trial = (pricing.code === 'api_trial');

  return (
    <Dialog
      open={open}
      onClose={closeHandler}
    >
      <DialogTitle id="alert-dialog-title">{pricing.name || 'Loading...'} {pricing.type === 'picks' ? 'picks access' : 'API access'}</DialogTitle>
      <DialogContent>
        <div>
          {!trial ? <Typography style = {{ color: theme.text.secondary }} type = 'caption'>See <a style = {{ color: theme.link.primary }} href = "https://srating.io/terms-and-conditions" target = "_blank">terms and conditions</a> before subscribing. Payments processed securely via <a style = {{ color: theme.link.primary }} href = "https://stripe.com" target = "_blank">Stripe</a></Typography> : ''}
        </div>
        {
        trial ?
          <div>
            <FreeTrialForm />
          </div>
          :
          <div>
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm pricing = {pricing} />
            </Elements>
          </div>
        }
      </DialogContent>
    </Dialog>
  );
};

export default Billing;
