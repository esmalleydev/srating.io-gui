'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStripe } from '@stripe/react-stripe-js';

import CircularProgress from '@mui/material/CircularProgress';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@/components/ux/text/Typography';
import Paper from '@/components/ux/container/Paper';
import { useTheme } from '@/components/hooks/useTheme';
import Button from '@/components/ux/buttons/Button';
import { PaymentIntent, SetupIntent } from '@stripe/stripe-js';
import { useAppSelector } from '@/redux/hooks';
import Navigation from '@/components/helpers/Navigation';


const Client = () => {
  const navigation = new Navigation();
  const theme = useTheme();
  const stripe = useStripe();
  const router = useRouter();

  const payment_router = useAppSelector((state) => state.paymentRouterReducer.payment_router);

  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);

  const getStatusMessage = (status: string, isSetup: boolean) => {
    const messages: Record<string, string> = {
      succeeded: isSetup ? 'Success! Subscription set up.' : 'Success! Payment received.',
      processing: "Payment processing. We'll update you when payment is received.",
      requires_payment_method: 'Payment failed. Please try another method.',
      default: 'An error occurred. Please try again later.',
    };
    return messages[status] || messages.default;
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const piSecret = params.get('payment_intent_client_secret');
    const siSecret = params.get('setup_intent_client_secret');

    const handleResult = (intent: PaymentIntent | SetupIntent | undefined, isSetup = false) => {
      if (!intent) {
        return;
      }

      setStatus(intent.status || 'error');
      setAmount('amount' in intent ? intent.amount : 0);
      setReference(intent.id);
      setMessage(getStatusMessage(intent.status, isSetup));
    };

    if (piSecret) {
      stripe.retrievePaymentIntent(piSecret).then(({ paymentIntent }) => handleResult(paymentIntent));
    } else if (siSecret) {
      stripe.retrieveSetupIntent(siSecret).then(({ setupIntent }) => handleResult(setupIntent, true));
    }
  }, [stripe]); // Only runs when stripe instance is ready


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

  const getButton = () => {
    if (payment_router.table === 'fantasy_entry') {
      return <Button ink handleClick={() => { navigation.fantasy_entry(`/fantasy_entry/${payment_router.id}`); }} title = {'View entry'} value = 'view-entry' />;
    }

    return <Button ink handleClick={() => { router.push('/account'); }} title = {'View account'} value = 'view-account' />;
  };

  let title = 'Subscription details';

  if (payment_router.table === 'fantasy_entry') {
    title = 'Fantasy league entry fee';
  }

  return (
    <div>
      {
        !status ? <div style = {{ textAlign: 'center' }}><CircularProgress color="inherit" /></div> :
        <div style = {{ padding: 20 }}>
          <div style = {{ textAlign: 'center' }}>
            <Typography type='h6'>{title}</Typography>
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
              {getButton()}
            </div>
          </Paper>
        </div>
      }
    </div>
  );
};

export default Client;
