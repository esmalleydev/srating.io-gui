'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';


import { useAppDispatch } from '@/redux/hooks';
import { setSession, setValidSession } from '@/redux/features/user-slice';
import { useClientAPI } from '@/components/clientAPI';
import { setLoading } from '@/redux/features/loading-slice';
import { useTheme } from '@/components/hooks/useTheme';
import { setDataKey } from '@/redux/features/games-slice';
import Typography from '@/components/ux/text/Typography';
import Modal from '@/components/ux/modal/Modal';
import Button from '@/components/ux/buttons/Button';
import { TextField } from '@mui/material';


const AccountHandler = (
  {
    open,
    closeHandler,
    loginCallback,
    message,
    title,
  } :
  {
    open: boolean;
    closeHandler: (e) => void;
    loginCallback?: (e) => void;
    message?: string;
    title?: string;
  },
) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [register, setRegister] = useState<boolean>(false);
  const [requestedLogin, setRequestedLogin] = useState<boolean>(false);

  const [email, setEmail] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [password, setPassword] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [passwordConfirm, setPasswordConfirm] = useState<string | null>(null);
  const [passwordErrorConfirm, setPasswordErrorConfirm] = useState<string | null>(null);

  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [tempLogin, setTempLogin] = useState<boolean>(false);

  const [loginCode, setLoginCode] = useState<string | null>(null);
  const [loginCodeError, setLoginCodeError] = useState<string | null>(null);

  const checkEmail = (text) => {
    const regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    return regex.test(text);
  };

  const handleLogin = (e) => {
    if (!email || !checkEmail(email)) {
      setEmailError('Valid email required');
      return;
    }
    setEmailError(null);


    if (!password) {
      setPasswordError('Password required');
      return;
    }
    setPasswordError(null);


    useClientAPI({
      class: 'user',
      function: 'login',
      arguments: {
        username: email,
        password,
      },
    }).then((session_id) => {
      if (!session_id) {
        setPasswordError('Incorrect password');
      } else if (session_id && session_id.error) {
        setPasswordError('Something went wrong, try again later');
      } else {
        localStorage.setItem('session_id', session_id);
        // sessionStorage.clear();
        dispatch(setSession(session_id));
        dispatch(setValidSession(true));
        dispatch(setDataKey({ key: 'dates_checked', value: {} }));
        closeHandler(e);

        if (loginCallback) {
          loginCallback(e);
        } else {
          window.location.reload();
        }
      }
    }).catch((err) => {
      setPasswordError('Incorrect password');
    });
  };

  const handleRegister = (e) => {
    if (!email || !checkEmail(email)) {
      setEmailError('Valid email required');
      return;
    }
    setEmailError(null);


    if (!password) {
      setPasswordError('Password required');
      return;
    }
    setPasswordError(null);


    if (!passwordConfirm) {
      setPasswordErrorConfirm('Password required');
      return;
    }
    setPasswordErrorConfirm(null);


    if (password !== passwordConfirm) {
      setPasswordErrorConfirm('Password does not match');
      setPasswordError('Password does not match');
      return;
    } if (password.length < 7) {
      setPasswordError('Password must be at least 7 characters');
      setPasswordErrorConfirm('Password must be at least 7 characters');
      return;
    }
    setPasswordError(null);
    setPasswordErrorConfirm(null);

    dispatch(setLoading(true));

    useClientAPI({
      class: 'user',
      function: 'register',
      arguments: {
        username: email,
        password,
        confirm_password: passwordConfirm,
      },
    }).then((response) => {
      if (response && response.error) {
        dispatch(setLoading(false));
        setEmailError(response.error);
      } else if (response) {
        localStorage.setItem('session_id', response);
        // sessionStorage.clear();
        dispatch(setSession(response));
        dispatch(setValidSession(true));
        closeHandler(e);

        if (loginCallback) {
          loginCallback(e);
        } else {
          startTransition(() => {
            router.push('/account');
          });
        }
      }
    }).catch((e) => {
      dispatch(setLoading(false));
      setEmailError('Something went wrong, try again later');
    });
  };

  const sendLoginCode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (!email || !checkEmail(email)) {
      setEmailError('Valid email required');
      return;
    }
    setEmailError(null);

    dispatch(setLoading(true));

    useClientAPI({
      class: 'user',
      function: 'forgotPassword',
      arguments: {
        email,
      },
    }).then((response) => {
      dispatch(setLoading(false));
      if (response === true) {
        setForgotPassword(false);
        setTempLogin(true);
      } else if (response && response.error) {
        setEmailError(response.error);
      } else {
        setEmailError('Something went wrong, try again later');
      }
    }).catch((e) => {
      setEmailError('Something went wrong, try again later');
    });
  };

  const useLoginCode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (!email || !checkEmail(email)) {
      setEmailError('Valid email required');
      return;
    }
    setEmailError(null);

    if (!loginCode) {
      setLoginCodeError('Code required');
      return;
    }
    setLoginCodeError(null);

    dispatch(setLoading(true));

    useClientAPI({
      class: 'user',
      function: 'useLoginCode',
      arguments: {
        email,
        code: loginCode,
      },
    }).then((response) => {
      if (response === false) {
        dispatch(setLoading(false));
        setLoginCodeError('Code incorrect / expired');
      } else if (response && response.error) {
        dispatch(setLoading(false));
        setLoginCodeError(response.error);
      } else {
        setForgotPassword(false);
        setTempLogin(false);
        dispatch(setSession(response));
        dispatch(setValidSession(true));
        localStorage.setItem('session_id', response);
        // sessionStorage.clear();
        closeHandler(e);
        startTransition(() => {
          router.push('/account?view=settings');
        });
      }
    }).catch((e) => {
      dispatch(setLoading(false));
      setLoginCodeError('Something went wrong, try again later');
    });
  };

  const handleEmail = (e) => {
    const { value } = e.target;
    setEmail(value || '');
  };

  const handlePassword = (e) => {
    const { value } = e.target;
    setPassword(value || '');
  };

  const handlePasswordConfirm = (e) => {
    const { value } = e.target;
    setPasswordConfirm(value || '');
  };

  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      if (register) {
        handleRegister(e);
      } else if (forgotPassword) {
        handleLogin(e);
      } else if (tempLogin) {
        useLoginCode(e);
      } else {
        handleLogin(e);
      }
    }
  };

  const handleLoginCode = (e) => {
    const { value } = e.target;
    setLoginCode(value || '');
  };

  let boxContents: React.JSX.Element | null = null;

  let buttons: React.JSX.Element | null = null;

  if (tempLogin) {
    boxContents = (
      <div>
        <Typography type = 'body1' style = {{ color: theme.text.secondary, marginTop: 10 }}>Login with temporary code</Typography>
        <TextField
          required
          disabled
          value = {email}
          error = {!!emailError}
          helperText = {emailError || null}
          onChange = {handleEmail}
          onKeyDown = {handleEnter}
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
        />
        <TextField
          autoFocus
          required
          error = {!!loginCodeError}
          helperText = {loginCodeError || null}
          onChange = {handleLoginCode}
          onKeyDown = {handleEnter}
          margin="dense"
          id="login-code"
          label="Code"
          type="number"
          fullWidth
          variant="standard"
        />
      </div>
    );

    buttons = (
      <>
        <Button handleClick = {(e) => { setTempLogin(false); setForgotPassword(false); }} title = {'Back'} ink value = 'back' />
        <Button handleClick = {useLoginCode} title = {'Sign in'} value = 'sign-in' />
      </>
    );
  } else if (forgotPassword) {
    boxContents = (
      <div style = {{ minWidth: 320 }}>
        <Typography type = 'body1' style = {{ color: theme.text.secondary, marginTop: 10 }}>Send a Forgot Password email</Typography>
        <TextField
          autoFocus
          required
          error = {!!emailError}
          helperText = {emailError || null}
          onChange = {handleEmail}
          onKeyDown = {handleEnter}
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
        />
      </div>
    );

    buttons = (
      <>
        <Button handleClick = {(e) => { setTempLogin(false); setForgotPassword(false); }} title = {'Back'} ink value = 'back' />
        <Button handleClick = {sendLoginCode} title = {'Send temporary code'} value = 'temp-code' />
      </>
    );
  } else if (register) {
    boxContents = (
      <div>
        <Typography type = 'body1' style = {{ color: theme.text.secondary, marginTop: 10 }}>Create an account</Typography>
        <TextField
          autoFocus
          required
          error = {!!emailError}
          helperText = {emailError || null}
          onChange = {handleEmail}
          onKeyDown = {handleEnter}
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
        />
        <TextField
          required
          error = {!!passwordError}
          helperText = {passwordError || null}
          onChange = {handlePassword}
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="standard"
        />
        <TextField
          required
          error = {!!passwordErrorConfirm}
          helperText = {passwordErrorConfirm || null}
          onChange = {handlePasswordConfirm}
          onKeyDown = {handleEnter}
          margin="dense"
          label="Confirm password"
          type="password"
          fullWidth
          variant="standard"
        />
        <Typography type = 'body2' style = {{ color: theme.text.secondary, marginTop: 10 }}>Have an account? <a style = {{ cursor: 'pointer', color: theme.link.primary }} onClick = {(e) => { setRegister(false); }}>Sign in</a></Typography>
      </div>
    );

    buttons = (
      <Button handleClick = {handleRegister} title = {'Create account'} value = 'create' />
    );
  } else {
    boxContents = (
      <div>
        <Typography type = 'caption' style = {{ color: theme.text.secondary }}>{(message || 'Sign in to your account')}</Typography>
        <TextField
          autoFocus
          required
          error = {!!emailError}
          helperText = {emailError || null}
          onChange = {handleEmail}
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
        />
        <TextField
          required
          error = {!!passwordError}
          helperText = {passwordError || null}
          onChange = {handlePassword}
          onKeyDown = {handleEnter}
          margin="dense"
          label="Password"
          type="password"
          autoComplete="current-password"
          fullWidth
          variant="standard"
        />
        <div style = {{ marginTop: 10 }}>
          <Typography type = 'a' onClick = {(e) => { setForgotPassword(true); }}>Forgot Password?</Typography>
        </div>
        <div style = {{ marginTop: 10 }}>
          <Typography type = 'body1' style = {{ color: theme.text.secondary }}>No account? <a style = {{ cursor: 'pointer', color: theme.link.primary }} onClick = {(e) => { setRegister(true); }}>Create account</a></Typography>
        </div>
      </div>
    );

    buttons = (
      <Button handleClick = {handleLogin} title = {'Sign in'} value = 'sign-in' />
    );
  }

  return (
    <Modal
      open={open}
      onClose={closeHandler}
    >
      <Typography type = 'h6'>{title || 'Account'}</Typography>
      {boxContents}
      <div style = {{ textAlign: 'right', marginTop: 10 }}>
        {buttons}
      </div>
    </Modal>
  );
};

export default AccountHandler;

