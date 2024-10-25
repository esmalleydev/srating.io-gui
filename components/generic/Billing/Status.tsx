'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStripe } from '@stripe/react-stripe-js';

import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { Button } from '@mui/material';


const Status = () => {
  const stripe = useStripe();
  const router = useRouter();

  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);


  // Retrieve the "payment_intent_client_secret" query parameter appended to
  // your return_url by Stripe.js
  const clientSecret = new URLSearchParams(window.location.search).get(
    'payment_intent_client_secret',
  );

  if (stripe && clientSecret) {
    // Retrieve the PaymentIntent
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent) {
        setStatus(paymentIntent.status || 'error');
        setAmount(paymentIntent.amount);
        setReference(paymentIntent.id);
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('Success! Payment received.');
      } else if (paymentIntent && paymentIntent.status === 'processing') {
        setMessage("Payment processing. We'll update you when payment is received.");
      } else if (paymentIntent && paymentIntent.status === 'requires_payment_method') {
        setMessage('Payment failed. Please try another payment method.');
      } else {
        setMessage('An error occured. Please try again later');
      }
    });
  }

  /**
   * Get an icon based on the status
   * @return Icon
   */
  const getIcon = () => {
    if (status === 'succeeded') {
      return <CheckCircleIcon fontSize='large' color='success' />;
    } if (status === 'processing') {
      return <HourglassBottomIcon fontSize='large' color='info' />;
    } if (status === 'requires_payment_method') {
      return <WarningIcon fontSize='large' color='warning' />;
    }

    return <ErrorIcon fontSize='large' color='error' />;
  };

  return (
    <div>
      {
        !status ? <div style = {{ textAlign: 'center' }}><CircularProgress color="inherit" /></div> :
        <div style = {{ padding: 20 }}>
          <div style = {{ textAlign: 'center' }}>
            <Typography variant='h5'>Subscription</Typography>
          </div>
          <Paper elevation={3} style = {{ padding: 16 }}>
            <div style = {{ textAlign: 'center' }}>
              {getIcon()}
            </div>
            <Typography variant='h6'>Amount: ${(amount / 100).toFixed(2)}</Typography>
            <Typography variant='body1'>{message}</Typography>
            <Typography variant='caption'>Ref: {reference}</Typography>
            <div style = {{ textAlign: 'right' }}><Button variant="contained" onClick={() => { router.push('/account'); }}>View account</Button></div>
          </Paper>
        </div>
      }
    </div>
  );
};

export default Status;
