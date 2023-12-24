'use client';
import React from 'react';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Status from '@/components/generic/Billing/Status';

let stripePromise;
if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

const Billing = (props) => {
  return (
    <main>
      <Elements stripe={stripePromise}>
        <Status />
      </Elements>
    </main>
  );
};

export default Billing;