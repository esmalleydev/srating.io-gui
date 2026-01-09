'use client';

import Inputs from '@/components/helpers/Inputs';
import { useTheme } from '@/components/hooks/useTheme';
import TextInput from '@/components/ux/input/TextInput';
import Modal from '@/components/ux/modal/Modal';
import Typography from '@/components/ux/text/Typography';
import { useAppSelector } from '@/redux/hooks';

import { Appearance, loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { useState } from 'react';
import CheckoutForm from './CheckoutForm';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const CreateEntry = (
  {
    open,
    closeHandler,
  }:
  {
    open: boolean;
    closeHandler: () => void;
  },
) => {
  const theme = useTheme();

  const [entryName, setEntryName] = useState('');
  const [triggerValidation, setTriggerValidation] = useState(false);

  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);

  const { entry_fee } = fantasy_group;

  const inputHandler = new Inputs();

  const appearance: Appearance = {
    theme: (theme.mode === 'dark' ? 'night' : 'stripe'),
    labels: 'floating',
    variables: {
      colorBackground: theme.mode === 'dark' ? '#383838' : theme.background.main,
    },
    rules: {
      '.Input': {
        padding: '5px',
        // 'boxShadow': 'none',
        // 'border': 'none'
      },
      '.Tab': {
        padding: '5px',
      },
    },
  };

  const options: StripeElementsOptions = {
    // clientSecret,
    mode: 'payment',
    amount: fantasy_group.entry_fee || 0,
    currency: 'usd',
    appearance,
  };



  return (
    <Modal
      open={open}
      onClose={closeHandler}
      paperStyle={{ maxWidth: 550 }}
    >
      <Typography type = 'h5' >Create league entry</Typography>
      <div>
        <TextInput
          inputHandler={inputHandler}
          label = 'Please add a name to your entry.'
          placeholder='Entry name'
          variant = 'filled'
          required
          onChange={(val) => setEntryName(val)}
          triggerValidation = {triggerValidation}
        />

        {
          entry_fee ?
            <div>
              <div>
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm entryName={entryName} />
                </Elements>
              </div>
            </div>
            :
            <div>
              todo reg button
            </div>
        }
      </div>
    </Modal>
  );
};

export default CreateEntry;

