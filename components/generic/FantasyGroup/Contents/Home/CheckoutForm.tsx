'use client';

import { useState } from 'react';

import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import { useClientAPI } from '@/components/clientAPI';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/loading-slice';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import Button from '@/components/ux/buttons/Button';
import { useTheme } from '@/components/hooks/useTheme';
import Typography from '@/components/ux/text/Typography';


const CheckoutForm = ({ entryName }) => {
  const theme = useTheme();
  const stripe = useStripe();
  const elements = useElements();

  const dispatch = useAppDispatch();
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);
  const loading = useAppSelector((state) => state.loadingReducer.loading);


  const handleStripeError = (error) => {
    dispatch(setLoading(false));
    setPaymentError(error.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    // Require email
    if (!entryName) {
      setPaymentError('Entry name is required.');
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleStripeError(submitError);
      return;
    }

    dispatch(setLoading(true));


    const billingData = await useClientAPI({
      class: 'billing',
      function: 'createFantasyGroupEntry',
      arguments: {
        fantasy_group_id: fantasy_group.fantasy_group_id,
        name: entryName,
      },
    });


    if (!billingData || billingData.error) {
      dispatch(setLoading(false));
      setPaymentError(billingData.error.message ? billingData.error.message : billingData.error);
      return;
    }

    const { paymentIntent, payment_router, email } = billingData;

    const clientSecret = paymentIntent.client_secret;

    const url = `payment_router/${payment_router.payment_router_id}/`;

    // Confirm the Intent using the details collected by the Payment Element
    const confirmIntentData = await stripe.confirmPayment({
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
        return_url: (process.env.NEXT_PUBLIC_ENV === 'dev' ? `http://localhost:3000/${url}` : `https://srating.io/${url}`),
      },
      // redirect: 'if_required',
    });


    if (confirmIntentData.error) {
      // This point is only reached if there's an immediate error when confirming the Intent.
      // Show the error to your customer (for example, "payment details incomplete").
      handleStripeError(confirmIntentData.error);
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


  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options = {paymentElementOptions} />
      <div style = {{ marginTop: 10 }}>
        <Typography style = {{ color: theme.text.secondary }} type = 'caption'>This league has an entry fee. Your entry fee will count towards the total pool. The fee for this entry is ${fantasy_group.entry_fee}. See <a style = {{ color: theme.link.primary }} href = "https://srating.io/terms-and-conditions" target = "_blank">terms and conditions</a> before joining. Payments processed securely via <a style = {{ color: theme.link.primary }} href = "https://stripe.com" target = "_blank">Stripe</a></Typography>
      </div>
      <Button
        handleClick={handleSubmit}
        containerStyle={{ width: '100%' }}
        buttonStyle = {{ width: '100%', marginTop: '20px', textAlign: 'center', backgroundColor: theme.blue[700] }}
        disabled={loading || !stripe || !elements}
        title = {`Pay $${fantasy_group.entry_fee}`} value = 'pay'
      />
      {paymentError && <div id="payment-message" style = {{ color: theme.error.main }}>Error: {paymentError}</div>}
    </form>
  );
};


export default CheckoutForm;
