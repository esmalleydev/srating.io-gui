'use client';

import { Elements } from '@stripe/react-stripe-js';
import Status from '@/components/generic/Billing/Status';
import { stripePromise } from '@/lib/stripe-client';


const Contents = () => {
  return (
    <div>
      <Elements stripe={stripePromise}>
        <Status />
      </Elements>
    </div>
  );
};

export default Contents;
