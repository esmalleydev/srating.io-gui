import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Status from '../components/generic/Billing/Status';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Billing = (props) => {
  const router = useRouter();


  return (
    <div>
      <Head>
        <title>sRating | Billing</title>
        <meta name = 'description' content = 'View statistic ranking, live score, live odds, picks for college basketball' key = 'desc'/>
        <meta property="og:title" content=">sRating.io college basketball rankings" />
        <meta property="og:description" content="View statistic ranking, live score, live odds, picks for college basketball" />
        <meta name="twitter:card" content="summary" />
        <meta name = 'twitter:title' content = 'View statistic ranking, live score, live odds, picks for college basketball' />
      </Head>
      <main>
        <Elements stripe={stripePromise}>
          <Status />
        </Elements>
      </main>
    </div>
  );
}

export default Billing;
