'use client';

import Inputs from '@/components/helpers/Inputs';
import { useTheme } from '@/components/hooks/useTheme';
import TextInput from '@/components/ux/input/TextInput';
import Modal from '@/components/ux/modal/Modal';
import Typography from '@/components/ux/text/Typography';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import { Appearance, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { useState } from 'react';
import CheckoutForm from './CheckoutForm';
import Button from '@/components/ux/buttons/Button';
import { setLoading } from '@/redux/features/loading-slice';
import { useClientAPI } from '@/components/clientAPI';
import { setDataKey } from '@/redux/features/fantasy_group-slice';
import Objector from '@/components/utils/Objector';
import { stripePromise } from '@/lib/stripe-client';

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

  const dispatch = useAppDispatch();
  const [entryName, setEntryName] = useState('');
  const [sending, setSending] = useState(false);
  const [triggerValidation, setTriggerValidation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);
  const fantasy_entrys = useAppSelector((state) => state.fantasyGroupReducer.fantasy_entrys);

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
    amount: fantasy_group.entry_fee ? (fantasy_group.entry_fee * 100) : 0, // stripe uses pennies here
    currency: 'usd',
    appearance,
  };

  const createFreeEntry = () => {
    if (sending) {
      return;
    }

    const errors = inputHandler.getErrors();

    setTriggerValidation(false);

    if (errors.length) {
      setTriggerValidation(true);
      return;
    }


    setSending(true);
    dispatch(setLoading(true));

    useClientAPI({
      class: 'fantasy_entry',
      function: 'createEntry',
      arguments: {
        fantasy_group_id: fantasy_group.fantasy_group_id,
        name: entryName,
      },
    })
      .then((response) => {
        setSending(false);
        dispatch(setLoading(false));

        if (response.error) {
          setErrorMessage(response.error);
        } else {
          dispatch(setDataKey({ key: 'fantasy_entrys', value: Objector.extender({}, fantasy_entrys, response.fantasy_entrys) }));
          closeHandler();
        }
      })
      .catch((err) => {
        console.log(err);
        setSending(false);
        dispatch(setLoading(false));
        closeHandler();
      });
  };



  return (
    <Modal
      open={open}
      onClose={closeHandler}
      paperStyle={{ maxWidth: 550 }}
    >
      <Typography type = 'h5'>Create league entry</Typography>
      <div>
        <TextInput
          inputHandler={inputHandler}
          label = 'Please add a name to your entry.'
          placeholder='Entry name'
          variant = 'filled'
          required
          onChange={(val) => setEntryName(val)}
          triggerValidation = {triggerValidation}
          errorMessage={errorMessage}
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
            <div style = {{ textAlign: 'right' }}>
              <Button ink title='Create entry' value = 'create' handleClick={createFreeEntry} />
            </div>
        }
      </div>
    </Modal>
  );
};

export default CreateEntry;

