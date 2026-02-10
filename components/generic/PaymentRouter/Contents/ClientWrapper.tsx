'use client';

import { Elements } from '@stripe/react-stripe-js';
import Client from './Client';
import { stripePromise } from '@/lib/stripe-client';


const ClientWrapper = () => {
  return (
    <div>
      <Elements stripe={stripePromise}>
        <Client />
      </Elements>
    </div>
  );
};

export default ClientWrapper;
