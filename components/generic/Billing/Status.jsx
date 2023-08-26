import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useStripe } from "@stripe/react-stripe-js";

import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { Button } from '@mui/material';


const Status = (props) => {
  const self = this;

  const stripe = useStripe();
  const router = useRouter();

  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);
  const [reference, setReference] = useState(null);
  const [amount, setAmount] = useState(0);


   // Retrieve the "payment_intent_client_secret" query parameter appended to
  // your return_url by Stripe.js
  const clientSecret = new URLSearchParams(window.location.search).get(
    'payment_intent_client_secret'
  );
  
  if (stripe) {
    // Retrieve the PaymentIntent
    stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent}) => {
      setStatus(paymentIntent.status || 'error');
      setAmount(paymentIntent.amount);
      setReference(paymentIntent.id);

      if (paymentIntent.status === 'succeeded') {
        setMessage('Success! Payment received.');
      } else if (paymentIntent.status === 'processing') {
        setMessage("Payment processing. We'll update you when payment is received.");
      } else if (paymentIntent.status === 'requires_payment_method') {
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
      return <CheckCircleIcon fontSize='large' color='success' />
    } else if (status === 'processing') {
      return <HourglassBottomIcon fontSize='large' color='info' />
    } else if (status === 'requires_payment_method') {
      return <WarningIcon fontSize='large' color='warning' />
    }

    return <ErrorIcon fontSize='large' color='error' />
  };

  return (
    <div>
      {
        !status ? <div style = {{'textAlign': 'center'}}><CircularProgress color="inherit" /></div> :
        <div style = {{'padding': 20}}>
          <div style = {{'textAlign': 'center'}}>
            <Typography variant='h5'>Subscription</Typography>
          </div>
          <Paper elevation={3} style = {{'padding': 16}}>
            <div style = {{'textAlign': 'center'}}>
              {getIcon()}
            </div>
            <Typography variant='h6'>Amount: ${(amount / 100).toFixed(2)}</Typography>
            <Typography variant='body1'>{message}</Typography>
            <Typography variant='caption'>Ref: {reference}</Typography>
            <div style = {{'textAlign': 'right'}}><Button variant="contained" onClick={() => {router.push('/account');}}>View account</Button></div>
          </Paper>
        </div>
      }
    </div>
  );
}

export default Status;