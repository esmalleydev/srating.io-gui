'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

import { Button } from '@mui/material';
import { useClientAPI } from '@/components/clientAPI';

const FreeTrialForm = () => {
  const router = useRouter();

  const [spin, setSpin] = useState(false);
  const [request, setRequest] = useState(false);
  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);


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



  const handleEmail = (e) => {
    const { value } = e.target;
    setEmail(value || '');
  };

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
      localStorage.setItem('session_id', session.session_id);
    }

    router.push('/account');
  };


  if (spin) {
    return <div style = {{ textAlign: 'center' }}><CircularProgress /></div>;
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <TextField
        style = {{ marginBottom: 20 }}
        required
        value = {email}
        error = {!!emailError}
        helperText = {emailError || null}
        onChange = {handleEmail}
        margin="dense"
        id="name"
        label="Email"
        type="email"
        fullWidth
        variant="standard"
      />
      <Button type = 'submit' style = {{ width: '100%', marginTop: '20px', textAlign: 'center' }} disabled = {isLoading} variant = "contained">Get free trial</Button>
      {errorMessage && <div id="payment-message">{errorMessage}</div>}
    </form>
  );
};


export default FreeTrialForm;
