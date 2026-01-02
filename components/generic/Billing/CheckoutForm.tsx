'use client';

import { useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import { useClientAPI } from '@/components/clientAPI';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/loading-slice';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import Button from '@/components/ux/buttons/Button';
import { useTheme } from '@/components/hooks/useTheme';
import { setDataKey } from '@/redux/features/user-slice';


const CheckoutForm = ({ pricing }) => {
  const theme = useTheme();
  const stripe = useStripe();
  const elements = useElements();

  const dispatch = useAppDispatch();
  const [spin, setSpin] = useState(false);
  const [request, setRequest] = useState(false);
  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);


  const session_id = (typeof window !== 'undefined' && localStorage.getItem('session_id')) || null;

  if (session_id && !request) {
    setSpin(true);
    setRequest(true);
    useClientAPI({
      class: 'user',
      function: 'loadUser',
      arguments: {},
    }).then((user) => {
      if (user && user.username) {
        setEmail(user.username);
      }
      setSpin(false);
    }).catch((error) => {
      setSpin(false);
    });
  }

  const handleError = (error) => {
    setIsLoading(false);
    dispatch(setLoading(false));
    setErrorMessage(error.message);
  };

  const handleEmail = (e) => {
    const { value } = e.target;
    setEmail(value || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    // Require email
    if (!email) {
      setEmailError('Email is required.');
      return;
    }

    setIsLoading(true);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    dispatch(setLoading(true));

    const subscription = await useClientAPI({
      class: 'billing',
      function: 'createSubscription',
      arguments: {
        email,
        priceId: pricing.priceId,
      },
    });

    if (subscription.session_id) {
      dispatch(setDataKey({ key: 'session_id', value: subscription.session_id }));
      dispatch(setDataKey({ key: 'isValidSession', value: true }));
    }

    const { clientSecret } = subscription;

    const confirmIntent = subscription.type === 'setup' ? stripe.confirmSetup : stripe.confirmPayment;

    // Confirm the Intent using the details collected by the Payment Element
    const { error } = await confirmIntent({
      elements,
      clientSecret,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            // if you change these to undefined or an empty string, the payments fails, im not collecting them... null works
            name: email,
            email,
            // if you change these to undefined or an empty string, the payments fails, im not collecting them... null works
            phone: null,
            address: {
              // if you change these to undefined or an empty string, the payments fails, im not collecting them... null works
              city: null,
              // if you change these to undefined or an empty string, the payments fails, im not collecting them... null works
              country: null,
              // if you change these to undefined or an empty string, the payments fails, im not collecting them... null works
              line1: null,
              // if you change these to undefined or an empty string, the payments fails, im not collecting them... null works
              line2: null,
              // if you change these to undefined or an empty string, the payments fails, im not collecting them... null works
              postal_code: null,
              // if you change these to undefined or an empty string, the payments fails, im not collecting them... null works
              state: null,
            },
          },
        },
        return_url: (process.env.NEXT_PUBLIC_ENV === 'dev' ? 'http://localhost:3000/billing' : 'https://srating.io/billing'),
      },
      // redirect: 'if_required',
    });


    if (error) {
      // This point is only reached if there's an immediate error when confirming the Intent.
      // Show the error to your customer (for example, "payment details incomplete").
      handleError(error);
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs',
    fields: {
      billingDetails: 'never',
    },
  };

  if (spin) {
    return <div style = {{ textAlign: 'center' }}><CircularProgress /></div>;
  }


  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <TextField
        style = {{ marginBottom: 20 }}
        required
        value = {email || ''}
        error = {!!emailError}
        helperText = {emailError || null}
        onChange = {handleEmail}
        margin="dense"
        id="name"
        label="Email"
        type="email"
        fullWidth
        variant="standard"
      />
      <PaymentElement id="payment-element" options = {paymentElementOptions} />
      <Button
        handleClick={handleSubmit}
        containerStyle={{ width: '100%' }}
        buttonStyle = {{ width: '100%', marginTop: '20px', textAlign: 'center', backgroundColor: theme.blue[700] }}
        disabled={isLoading || !stripe || !elements}
        title = {`Pay $${pricing.price}`} value = 'pay'
      />
      {errorMessage && <div id="payment-message">{errorMessage}</div>}
    </form>
  );
};


export default CheckoutForm;
