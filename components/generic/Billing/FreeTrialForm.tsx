'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useClientAPI } from '@/components/clientAPI';
import { useAppDispatch } from '@/redux/hooks';
import Button from '@/components/ux/buttons/Button';
import { useTheme } from '@/components/ux/contexts/themeContext';
import { setDataKey } from '@/redux/features/user-slice';
import CircularProgress from '@/components/ux/loading/CircularProgress';
import TextInput from '@/components/ux/input/TextInput';
import Inputs from '@/components/ux/input/Inputs';

const FreeTrialForm = () => {
  const theme = useTheme();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const [spin, setSpin] = useState(false);
  const [request, setRequest] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const inputHandler = new Inputs();

  const session_id = (typeof window !== 'undefined' && localStorage.getItem('session_id')) || null;

  if (session_id && !request) {
    setSpin(true);
    setRequest(true);
    useClientAPI({
      class: 'user',
      function: 'loadUser',
      arguments: {},
    }).then((user) => {
      if (user && user.username) {
        setEmail(user.username);
      }
      setSpin(false);
    }).catch((error) => {
      setSpin(false);
    });
  }



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Require email
    if (!email) {
      setEmailError('Email is required.');
      return;
    }

    setIsLoading(true);

    const session = await useClientAPI({
      class: 'billing',
      function: 'createTrial',
      arguments: {
        email,
      },
    });

    if (session && session.error) {
      setErrorMessage(session.error.message);
      setIsLoading(false);
      return;
    }

    if (!session || !session.session_id) {
      setErrorMessage('Something went wrong, try again later');
      setIsLoading(false);
      return;
    }

    if (session.session_id) {
      dispatch(setDataKey({ key: 'session_id', value: session.session_id }));
      dispatch(setDataKey({ key: 'isValidSession', value: true }));
    }

    router.push('/account');
  };


  if (spin) {
    return <div style = {{ textAlign: 'center' }}><CircularProgress /></div>;
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} style = {{ marginTop: 20 }}>
      <TextInput
        inputHandler={inputHandler}
        required
        autoFocus
        value = {email}
        error = {(!!emailError || !!errorMessage)}
        errorMessage = {emailError || errorMessage}
        onChange = {(val) => setEmail(val)}
        id="name"
        placeholder="Email"
        type="email"
        variant='standard'
      />
      <Button handleClick={handleSubmit} containerStyle={{ width: '100%' }} buttonStyle = {{ width: '100%', marginTop: '20px', textAlign: 'center', backgroundColor: theme.blue[700] }} disabled = {isLoading} title = {'Get free trial'} value = 'trial' />
    </form>
  );
};


export default FreeTrialForm;
