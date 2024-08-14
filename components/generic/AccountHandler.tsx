'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';


import { useAppDispatch } from '@/redux/hooks';
import { setSession, setValidSession } from '@/redux/features/user-slice';
import { useClientAPI } from '@/components/clientAPI';
import { clearDatesChecked } from '@/redux/features/games-slice';
import { setLoading } from '@/redux/features/display-slice';


const AccountHandler = ({ open, closeHandler, loginCallback }) => {
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
    const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

    return regex.test(text);
  };

  const handleLogin = () => {
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
        dispatch(clearDatesChecked(null));
        closeHandler();
        window.location.reload();
      }
    }).catch((e) => {
      setPasswordError('Incorrect password');
    });
  };

  const handleRegister = () => {
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
        closeHandler();
        startTransition(() => {
          router.push('/account');
        });
      }
    }).catch((e) => {
      dispatch(setLoading(false));
      setEmailError('Something went wrong, try again later');
    });
  };

  const sendLoginCode = () => {
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

  const useLoginCode = () => {
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
        closeHandler();
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
        handleRegister();
      } else if (forgotPassword) {
        handleLogin();
      } else if (tempLogin) {
        useLoginCode();
      } else {
        handleLogin();
      }
    }
  };

  const handleLoginCode = (e) => {
    const { value } = e.target;
    setLoginCode(value || '');
  };

  const boxContents: React.JSX.Element[] = [];

  if (tempLogin) {
    boxContents.push(
      <DialogContent key = {'temp_login_content'}>
        <DialogContentText sx = {{ marginBottom: 2 }}>Login with temporary code</DialogContentText>
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
        </DialogContent>,
    );

    boxContents.push(
      <DialogActions key = {'temp_login_actions'}>
        <Button onClick = {() => { setTempLogin(false); setForgotPassword(false); }}>Back</Button>
        <Button onClick = {useLoginCode}>Sign in</Button>
      </DialogActions>,
    );
  } else if (forgotPassword) {
    boxContents.push(
      <DialogContent key = {'forgot_password_content'} sx = {{ minWidth: 320 }}>
        <DialogContentText sx = {{ marginBottom: 2 }}>Send a Forgot Password email</DialogContentText>
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
      </DialogContent>,
    );

    boxContents.push(
      <DialogActions key = {'forgot_password_actions'}>
        <Button onClick = {() => { setTempLogin(false); setForgotPassword(false); }}>Back</Button>
        <Button onClick = {sendLoginCode}>Send temporary code</Button>
      </DialogActions>,
    );
  } else if (register) {
    boxContents.push(
      <DialogContent key = {'register_content'}>
          <DialogContentText sx = {{ marginBottom: 2 }}>Create an account</DialogContentText>
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
          <DialogContentText sx = {{ marginTop: 3 }}>Have an account? <Link sx = {{ cursor: 'pointer' }} onClick = {() => { setRegister(false); }}>Sign in</Link></DialogContentText>
        </DialogContent>,
    );

    boxContents.push(
      <DialogActions key = {'register_actions'}>
        <Button onClick = {handleRegister}>Create account</Button>
      </DialogActions>,
    );
  } else {
    boxContents.push(
      <DialogContent key = {'login_content'}>
        <DialogContentText sx = {{ marginBottom: 2 }}>Sign in to your account</DialogContentText>
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
          <DialogContentText sx = {{ marginTop: 3 }}><Link sx = {{ cursor: 'pointer' }} onClick = {() => { setForgotPassword(true); }}>Forgot Password?</Link></DialogContentText>
          <DialogContentText sx = {{ marginTop: 3 }}>No account? <Link sx = {{ cursor: 'pointer' }} onClick = {() => { setRegister(true); }}>Create account</Link></DialogContentText>
        </DialogContent>,
    );

    boxContents.push(
      <DialogActions key = {'login_actions'}>
        <Button onClick = {handleLogin}>Sign in</Button>
      </DialogActions>,
    );
  }



  return (
    <Dialog
      open={open}
      onClose={closeHandler}
    >
      <DialogTitle id="alert-dialog-title">Account</DialogTitle>
      {boxContents}
    </Dialog>
  );
};

export default AccountHandler;

