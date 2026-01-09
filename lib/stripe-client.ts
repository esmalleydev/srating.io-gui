import { loadStripe } from '@stripe/stripe-js';

const KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!KEY) {
  console.warn('Stripe publishable key is missing.');
}

export const stripePromise = KEY ? loadStripe(KEY) : null;
