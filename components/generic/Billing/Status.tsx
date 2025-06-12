'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStripe } from '@stripe/react-stripe-js';

import CircularProgress from '@mui/material/CircularProgress';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { Button } from '@mui/material';
import Typography from '@/components/ux/text/Typography';
import Paper from '@/components/ux/container/Paper';
import Footer from '../Footer';
import { useTheme } from '@/components/hooks/useTheme';


const Status = () => {
  const theme = useTheme();
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

  const setupClientSecret = new URLSearchParams(window.location.search).get(
    'setup_intent_client_secret',
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
  } else if (stripe && setupClientSecret) {
    // Retrieve the PaymentIntent
    stripe.retrieveSetupIntent(setupClientSecret).then(({ setupIntent }) => {
      if (setupIntent) {
        setStatus(setupIntent.status || 'error');
        setReference(setupIntent.id);
      }

      if (setupIntent && setupIntent.status === 'succeeded') {
        setMessage('Success! Payment intent set up. Your subscription will start when payment is received.');
      } else if (setupIntent && setupIntent.status === 'processing') {
        setMessage("Payment processing. We'll update you when payment is received.");
      } else if (setupIntent && setupIntent.status === 'requires_payment_method') {
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
      return <CheckCircleIcon fontSize='medium' color='success' />;
    } if (status === 'processing') {
      return <HourglassBottomIcon fontSize='medium' color='info' />;
    } if (status === 'requires_payment_method') {
      return <WarningIcon fontSize='medium' color='warning' />;
    }

    return <ErrorIcon fontSize='medium' color='error' />;
  };

  return (
    <div>
      {
        !status ? <div style = {{ textAlign: 'center' }}><CircularProgress color="inherit" /></div> :
        <div style = {{ padding: 20 }}>
          <div style = {{ textAlign: 'center' }}>
            <Typography type='h6'>Subscription details</Typography>
          </div>
          <Paper elevation={3} style = {{ padding: 16, maxWidth: 500, margin: '0 auto' }}>
            <div style = {{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
              <div style = {{ display: 'flex', alignItems: 'center', marginRight: 10 }}>{getIcon()}</div><Typography type='body1'>{message}</Typography>
            </div>

            <div style={{ marginBottom: 5 }}>
              <Typography type='subtitle2' style = {{ color: theme.text.secondary }}>Amount Paid</Typography>
              <Typography type='body1'>${['succeeded', 'processing'].includes(status) ? (amount / 100).toFixed(2) : '0.00'}</Typography>
            </div>

            <div style={{ marginBottom: 5 }}>
              <Typography type='subtitle2' style = {{ color: theme.text.secondary }}>Reference</Typography>
              <Typography type='body2'>{reference}</Typography>
            </div>
            <div style = {{ textAlign: 'right' }}>
              <Button variant='text' onClick={() => { router.push('/account'); }}>View account</Button>
            </div>
          </Paper>
        </div>
      }
      <Footer />
    </div>
  );
};

export default Status;
