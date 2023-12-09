import React from 'react';
import { Metadata } from 'next';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Status from '../../components/generic/Billing/Status';

let stripePromise;
if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export const metadata: Metadata = {
  title: 'sRating | Billing',
  description: 'College basketball API / Picks',
  openGraph: {
    title: 'sRating.io college basketball API',
    description: 'College basketball API / Picks',
  },
  twitter: {
    card: 'summary',
    title: 'College basketball API / Picks',
  }
};

const Billing = () => {
  return (
    <main>
      <Elements stripe={stripePromise}>
        <Status />
      </Elements>
    </main>
  );
}

export default Billing;
