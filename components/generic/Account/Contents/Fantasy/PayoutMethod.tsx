'use client';

import { useClientAPI } from '@/components/clientAPI';
import Inputs from '@/components/helpers/Inputs';
import { useTheme } from '@/components/hooks/useTheme';
import Objector from '@/components/utils/Objector';
import Button from '@/components/ux/buttons/Button';
import Paper from '@/components/ux/container/Paper';
import Tile from '@/components/ux/container/Tile';
import MultiPicker from '@/components/ux/input/MultiPicker';
import TextInput from '@/components/ux/input/TextInput';
import Columns from '@/components/ux/layout/Columns';
import Typography from '@/components/ux/text/Typography';
import AddIcon from '@mui/icons-material/Add';
import { setDataKey } from '@/redux/features/user-slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';


import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import IconButton from '@/components/ux/buttons/IconButton';
import StarIcon from '@mui/icons-material/Star';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { setLoading } from '@/redux/features/loading-slice';
import { StripeCardElement } from '@stripe/stripe-js';



const BankAccountForm = (
  {
    handleDone,
  }:
  {
    handleDone: () => void;
  },
) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const user_payment_tokens = useAppSelector((state) => state.userReducer.user_payment_token);

  const [triggerValidation, setTriggerValidation] = useState(false);
  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sending, setSending] = useState(false);
  const inputHandler = new Inputs();

  const handleClick = () => {
    if (sending) {
      return;
    }

    if (inputHandler.getErrors().length) {
      setTriggerValidation(true);
      return;
    }

    setSending(true);
    dispatch(setLoading(true));

    useClientAPI({
      class: 'user_payment_token',
      function: 'createBankAccount',
      arguments: {
        account_holder_name: name,
        account_number: accountNumber,
        routing_number: routingNumber,
      },
    })
      .then((response) => {
        dispatch(setLoading(false));
        setSending(false);
        if (!response || response.error) {
          setErrorMessage((response.error && response.error.message) || 'Something went wrong, please try again later');
          return;
        }

        if (response.user) {
          dispatch(setDataKey({ key: 'user', value: response.user }));
        }

        if (response.user_payment_token) {
          dispatch(setDataKey({ key: 'user_payment_token', value: Objector.extender({}, user_payment_tokens, { [response.user_payment_token.user_payment_token_id]: response.user_payment_token }) }));
        }
        handleDone();
      })
      .catch((err) => {
        console.log(err);
        dispatch(setLoading(false));
        setSending(false);
        setErrorMessage(err);
      });
  };

  let backButton: React.JSX.Element | null = null;

  if (Object.keys(user_payment_tokens).length) {
    backButton = (
      <div style = {{ textAlign: 'left' }}>
        <Button
          title = 'Back'
          value = 'back'
          handleClick={handleDone}
          ink
        />
      </div>
    );
  }


  return (
    <div>
      <Typography type = 'body1'>Bank account information (US only)</Typography>
      <TextInput
        inputHandler={inputHandler}
        placeholder='Account holder full name'
        required
        maxLength={255}
        triggerValidation = {triggerValidation}
        onChange={(val) => setName(val)}
        value = {name}
        />
      <Columns numberOfColumns={2}>
        <TextInput
          inputHandler={inputHandler}
          placeholder='Account #'
          required
          maxLength={255}
          triggerValidation = {triggerValidation}
          onChange={(val) => setAccountNumber(val)}
          value = {accountNumber}
          />
        <TextInput
          inputHandler={inputHandler}
          placeholder='Routing #'
          required
          maxLength={255}
          triggerValidation = {triggerValidation}
          onChange={(val) => setRoutingNumber(val)}
          value = {routingNumber}
        />
      </Columns>
      {errorMessage ? <Typography type = 'body1' style = {{ color: theme.error.main }}>{errorMessage}</Typography> : ''}
      <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
        <div>{backButton}</div>
        <Button title='Add bank account' value = 'add' handleClick={handleClick} />
      </div>
    </div>
  );
};


const DebitCardForm = (
  {
    handleDone,
  }:
  {
    handleDone: () => void;
  },
) => {
  const stripe = useStripe();
  const elements = useElements();

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const user_payment_tokens = useAppSelector((state) => state.userReducer.user_payment_token);

  const [errorMessage, setErrorMessage] = useState('');
  const [sending, setSending] = useState(false);

  let backButton: React.JSX.Element | null = null;

  if (Object.keys(user_payment_tokens).length) {
    backButton = (
      <div style = {{ textAlign: 'left' }}>
        <Button
          title = 'Back'
          value = 'back'
          handleClick={handleDone}
          ink
        />
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Tokens created from CardElement can be used as External Accounts
    const { token, error } = await stripe.createToken(cardElement as StripeCardElement);

    if (error && error.message) {
      setErrorMessage(error.message);
      return;
    }

    if (token && token.card && token.card.funding !== 'debit') {
      setErrorMessage('Can only add a debit card.');
      return;
    }

    if (token && token.id) {
      if (sending) {
        return;
      }

      setSending(true);
      dispatch(setLoading(true));

      useClientAPI({
        class: 'user_payment_token',
        function: 'createDebitCard',
        arguments: {
          token: token.id,
        },
      })
        .then((response) => {
          dispatch(setLoading(false));
          setSending(false);
          if (!response || response.error) {
            setErrorMessage((response.error && response.error.message) || 'Something went wrong, please try again later');
            return;
          }

          if (response.user) {
            dispatch(setDataKey({ key: 'user', value: response.user }));
          }

          if (response.user_payment_token) {
            dispatch(setDataKey({ key: 'user_payment_token', value: Objector.extender({}, user_payment_tokens, { [response.user_payment_token.user_payment_token_id]: response.user_payment_token }) }));
          }
          handleDone();
        })
        .catch((err) => {
          console.log(err);
          dispatch(setLoading(false));
          setSending(false);
          setErrorMessage(err);
        });
    } else {
      setErrorMessage('Something went wrong, missing token');
    }
  };

  const cardStyle = {
    base: {
      color: theme.text.primary,
      fontSize: '16px',
    },
  };

  return (
    <Paper style = {{ padding: 16 }}>
      <form onSubmit={handleSubmit}>
        <Typography type = 'body1'>Debit card details</Typography>
        <div style = {{ padding: 16 }}>
          <CardElement options={{ hidePostalCode: true, style: cardStyle }} />
        </div>
        {errorMessage ? <Typography type = 'body1' style = {{ color: theme.error.main }}>{errorMessage}</Typography> : ''}
        <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
          <div>{backButton}</div>
          <Button title='Add debit card' value = 'add' handleClick={handleSubmit} />
        </div>
      </form>
    </Paper>
  );
};

const PayoutMethodWizard = (
  {
    handleDone,
  }:
  {
    handleDone: () => void;
  },
) => {
  const [payoutType, setPayoutType] = useState<string | null>(null);
  const inputHandler = new Inputs();

  const options = [
    {
      label: 'Debit card',
      value: 'debit',
    },
    {
      label: 'Bank account',
      value: 'bank',
    },
  ];

  return (
    <div>
      <Typography type = 'body1'>How would you like your payout winnings?</Typography>
      <MultiPicker
        inputHandler = {inputHandler}
        label='Select a payout option.'
        onChange={(val) => setPayoutType(val as string)}
        options={options}
        selected={payoutType ? [payoutType] : []}
        isRadio
        triggerValidation={false}
      />
      {
        payoutType === 'debit' ?
        <DebitCardForm handleDone = {handleDone} />
          : ''
      }
      {
        payoutType === 'bank' ?
        <BankAccountForm handleDone = {handleDone} />
          : ''
      }
    </div>
  );
};


const PayoutMethod = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userReducer.user);
  const user_payment_tokens = useAppSelector((state) => state.userReducer.user_payment_token);

  const [add, setAdd] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sending, setSending] = useState(false);

  const setDefault = (user_payment_token_id) => {
    if (sending) {
      return;
    }

    setSending(true);
    dispatch(setLoading(true));

    useClientAPI({
      class: 'user_payment_token',
      function: 'setDefault',
      arguments: {
        user_payment_token_id,
      },
    })
      .then((response) => {
        dispatch(setLoading(false));
        setSending(false);
        if (!response || response.error) {
          setErrorMessage((response.error && response.error.message) || 'Something went wrong, please try again later');
          return;
        }

        if (response.user) {
          dispatch(setDataKey({ key: 'user', value: response.user }));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(setLoading(false));
        setSending(false);
        setErrorMessage(err);
      });
  };

  const removeToken = (user_payment_token_id) => {
    if (sending) {
      return;
    }

    setSending(true);
    dispatch(setLoading(true));

    useClientAPI({
      class: 'user_payment_token',
      function: 'removeToken',
      arguments: {
        user_payment_token_id,
      },
    })
      .then((response) => {
        setSending(false);
        dispatch(setLoading(false));
        if (!response || response.error) {
          setErrorMessage((response.error && response.error.message) || 'Something went wrong, please try again later');
          return;
        }

        if (response.user) {
          dispatch(setDataKey({ key: 'user', value: response.user }));
        }

        if (response.user_payment_tokens) {
          dispatch(setDataKey({ key: 'user_payment_token', value: response.user_payment_tokens }));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(setLoading(false));
        setSending(false);
        setErrorMessage(err);
      });
  };


  const getContents = () => {
    const debit_cards: React.JSX.Element[] = [];
    const bank_accounts: React.JSX.Element[] = [];

    for (const user_payment_token_id in user_payment_tokens) {
      const row = user_payment_tokens[user_payment_token_id];

      const buttons: React.JSX.Element[] = [];

      if (user.default_user_payment_token_id !== user_payment_token_id) {
        buttons.push(
          <Button
            title = 'Set default method'
            value = 'default'
            handleClick={() => setDefault(user_payment_token_id)}
            ink
          />,
        );
      }

      buttons.push(
        <Button
          title = 'Remove'
          value = 'remove'
          handleClick={() => removeToken(user_payment_token_id)}
          ink
        />,
      );

      if (row.type === 'bank_account') {
        bank_accounts.push(
          <Tile
            icon = {user.default_user_payment_token_id === user_payment_token_id ? <StarIcon style = {{ color: theme.yellow[500] }} /> : <AccountBalanceIcon style = {{ color: theme.info.main }} /> }
            primary = {row.json_data && 'bank_name' in row.json_data ? row.json_data.bank_name as string : 'Bank account'}
            secondary = {row.json_data && 'last4' in row.json_data ? row.json_data.last4 as string : '1234'}
            buttons = {buttons}
          />,
        );
      }

      if (row.type === 'card') {
        debit_cards.push(
          <Tile
            icon = {user.default_user_payment_token_id === user_payment_token_id ? <StarIcon style = {{ color: theme.yellow[500] }} /> : <CreditCardIcon style = {{ color: theme.info.main }} /> }
            primary = {row.json_data && 'brand' in row.json_data ? row.json_data.brand as string : 'Debit card'}
            secondary = {row.json_data && 'last4' in row.json_data ? row.json_data.last4 as string : '1234'}
            buttons = {buttons}
          />,
        );
      }
    }

    if (
      (!bank_accounts.length && !debit_cards.length) ||
      add
    ) {
      return <PayoutMethodWizard handleDone = {() => setAdd(false)} />;
    }


    const paperButtons: React.JSX.Element[] = [];
    paperButtons.push(
      <IconButton type = 'circle' value = 'invite' onClick = {() => setAdd(true)} icon={<AddIcon />} />,
    );

    return (
      <Paper style = {{ padding: 16 }} buttons={paperButtons}>
        {debit_cards.length ? <Typography type = 'caption'>Debit cards</Typography> : ''}
        {debit_cards}
        {bank_accounts.length ? <Typography type = 'caption'>Bank accounts</Typography> : ''}
        {bank_accounts}
        {errorMessage ? <Typography type = 'body1' style = {{ color: theme.error.main }}>{errorMessage}</Typography> : ''}
      </Paper>
    );
  };


  return (
    <div>
      <Typography type = 'h6'>Payout methods</Typography>
      {getContents()}
    </div>
  );
};

export default PayoutMethod;
