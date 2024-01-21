'use client';
import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';


import BackdropLoader from './BackdropLoader.jsx';
import { useAppDispatch } from '@/redux/hooks';
import { setValidSession } from '@/redux/features/user-slice';
import { useClientAPI } from '@/components/clientAPI';
import { clearDatesChecked } from '@/redux/features/games-slice';


const AccountHandler = (props) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const router = useRouter();

  const [spin, setSpin] = useState(false);

  const [register, setRegister] = useState(false);
  const [requestedLogin, setRequestedLogin] = useState(false);

  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const [passwordConfirm, setPasswordConfirm] = useState(null);
  const [passwordErrorConfirm, setPasswordErrorConfirm] = useState(null);

  const [forgotPassword, setForgotPassword] = useState(false);
  const [tempLogin, setTempLogin] = useState(false);

  const [loginCode, setLoginCode] = useState(null);
  const [loginCodeError, setLoginCodeError] = useState(null);

  const checkEmail = (text) => {
    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

    return regex.test(text);
  };

  const handleLogin = () => {
    if (!email || !checkEmail(email)) {
      setEmailError('Valid email required');
      return;
    } else {
      setEmailError(null);
    }

    if (!password) {
      setPasswordError('Password required');
      return;
    } else {
      setPasswordError(null);
    }

    useClientAPI({
      'class': 'user',
      'function': 'login',
      'arguments': {
        'username': email,
        'password': password,
      },
    }).then((session_id) => {
      if (!session_id) {
        setPasswordError('Incorrect password');
        return;
      } else if (session_id && session_id.error) {
        setPasswordError('Something went wrong, try again later');
        return;
      } else {
        localStorage.setItem('session_id', session_id);
        sessionStorage.clear();
        dispatch(setValidSession(true));
        dispatch(clearDatesChecked());
        props.closeHandler();
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
    } else {
      setEmailError(null);
    }

    if (!password) {
      setPasswordError('Password required');
      return;
    } else {
      setPasswordError(null);
    }

    if (!passwordConfirm) {
      setPasswordErrorConfirm('Password required');
      return;
    } else {
      setPasswordErrorConfirm(null);
    }

    if (password !== passwordConfirm) {
      setPasswordErrorConfirm('Password does not match');
      setPasswordError('Password does not match');
      return;
    } else if (password.length < 7) {
      setPasswordError('Password must be at least 7 characters');
      setPasswordErrorConfirm('Password must be at least 7 characters');
      return;
    } else {
      setPasswordError(null);
      setPasswordErrorConfirm(null);
    }

    useClientAPI({
      'class': 'user',
      'function': 'register',
      'arguments': {
        'username': email,
        'password': password,
        'confirm_password': passwordConfirm,
      },
    }).then((response) => {
      if (response && response.error) {
        setEmailError(response.error);
        return;
      } else if (response) {
        localStorage.setItem('session_id', response);
        sessionStorage.clear();
        dispatch(setValidSession(true));
        props.closeHandler();
        router.push('/account');
      }
    }).catch((e) => {
        setEmailError('Something went wrong, try again later');
    });
  };

  const sendLoginCode = () => {
    if (!email || !checkEmail(email)) {
      setEmailError('Valid email required');
      return;
    } else {
      setEmailError(null);
    }

    setSpin(true);

    useClientAPI({
      'class': 'user',
      'function': 'forgotPassword',
      'arguments': {
        'email': email,
      },
    }).then((response) => {
      setSpin(false);
      setForgotPassword(false);
      setTempLogin(true);
    }).catch((e) => {
        setEmailError('Something went wrong, try again later');
    });
  };

  const useLoginCode = () => {
    if (!email || !checkEmail(email)) {
      setEmailError('Valid email required');
      return;
    } else {
      setEmailError(null);
    }

    if (!loginCode) {
      setLoginCodeError('Code required');
      return;
    } else {
      setLoginCodeError(null);
    }

    useClientAPI({
      'class': 'user',
      'function': 'useLoginCode',
      'arguments': {
        'email': email,
        'code': loginCode,
      },
    }).then((response) => {
      if (!response) {
        setLoginCodeError('Code incorrect / expired');
      } else {
        setForgotPassword(false);
        setTempLogin(false);
        localStorage.setItem('session_id', response);
        sessionStorage.clear();
        dispatch(setValidSession(true));
        props.closeHandler();
        router.push('/account?view=settings');
      }
    }).catch((e) => {
        setEmailError('Something went wrong, try again later');
    });
  };

  const handleEmail = (e) => {
    const value = e.target.value;
    setEmail(value || '');
  };

  const handlePassword = (e) => {
    const value = e.target.value;
    setPassword(value || '');
  };

  const handlePasswordConfirm = (e) => {
    const value = e.target.value;
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
    const value = e.target.value;
    setLoginCode(value || '');
  };

  let boxContents = [];

  if (tempLogin) {
    boxContents.push(
      <DialogContent key = {'temp_login_content'}>
        <DialogContentText sx = {{'marginBottom': 2}}>Login with temporary code</DialogContentText>
        <TextField
            required
            disabled
            error = {emailError ? true : false}
            helperText = {emailError ? emailError : null}
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
            error = {loginCodeError ? true : false}
            helperText = {loginCodeError ? loginCodeError : null}
            onChange = {handleLoginCode}
            onKeyDown = {handleEnter}
            margin="dense"
            id="login-code"
            label="Code"
            type="number"
            fullWidth
            variant="standard"
          />
        </DialogContent>
    );

    boxContents.push(
      <DialogActions key = {'temp_login_actions'}>
        <Button onClick = {() => {setTempLogin(false); setForgotPassword(false);}}>Back</Button>
        <Button onClick = {useLoginCode}>Sign in</Button>
      </DialogActions>
    );
  } else if (forgotPassword) {
    boxContents.push(
      <DialogContent key = {'forgot_password_content'} sx = {{'minWidth': 320}}>
        <DialogContentText sx = {{'marginBottom': 2}}>Send a Forgot Password email</DialogContentText>
        <TextField
            autoFocus
            required
            error = {emailError ? true : false}
            helperText = {emailError ? emailError : null}
            onChange = {handleEmail}
            onKeyDown = {handleEnter}
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
        />
      </DialogContent>
    );

    boxContents.push(
      <DialogActions key = {'forgot_password_actions'}>
        <Button onClick = {() => {setTempLogin(false); setForgotPassword(false);}}>Back</Button>
        <Button onClick = {sendLoginCode}>Send temporary code</Button>
      </DialogActions>
    );
  } else if (register) {
    boxContents.push(
      <DialogContent key = {'register_content'}>
          <DialogContentText sx = {{'marginBottom': 2}}>Create an account</DialogContentText>
          <TextField
            autoFocus
            required
            error = {emailError ? true : false}
            helperText = {emailError ? emailError : null}
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
            error = {passwordError ? true : false}
            helperText = {passwordError ? passwordError : null}
            onChange = {handlePassword}
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            error = {passwordErrorConfirm ? true : false}
            helperText = {passwordErrorConfirm ? passwordErrorConfirm : null}
            onChange = {handlePasswordConfirm}
            onKeyDown = {handleEnter}
            margin="dense"
            label="Confirm password"
            type="password"
            fullWidth
            variant="standard"
          />
          <DialogContentText sx = {{'marginTop': 3}}>Have an account? <Link sx = {{'cursor': 'pointer'}} onClick = {() => {setRegister(false);}}>Sign in</Link></DialogContentText>
        </DialogContent>
    );

    boxContents.push(
      <DialogActions key = {'register_actions'}>
        <Button onClick = {handleRegister}>Create account</Button>
      </DialogActions>
    );
  } else {
    boxContents.push(
      <DialogContent key = {'login_content'}>
        <DialogContentText sx = {{'marginBottom': 2}}>Sign in to your account</DialogContentText>
        <TextField
            autoFocus
            required
            error = {emailError ? true : false}
            helperText = {emailError ? emailError : null}
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
            error = {passwordError ? true : false}
            helperText = {passwordError ? passwordError : null}
            onChange = {handlePassword}
            onKeyDown = {handleEnter}
            margin="dense"
            label="Password"
            type="password"
            autoComplete="current-password"
            fullWidth
            variant="standard"
          />
          <DialogContentText sx = {{'marginTop': 3}}><Link sx = {{'cursor': 'pointer'}} onClick = {() => {setForgotPassword(true)}}>Forgot Password?</Link></DialogContentText>
          <DialogContentText sx = {{'marginTop': 3}}>No account? <Link sx = {{'cursor': 'pointer'}} onClick = {() => {setRegister(true);}}>Create account</Link></DialogContentText>
        </DialogContent>
    );

    boxContents.push(
      <DialogActions key = {'login_actions'}>
        <Button onClick = {handleLogin}>Sign in</Button>
      </DialogActions>
    );
  }



  return (
    <Dialog
      open={props.open}
      onClose={props.closeHandler}
    >
      {spin ? <BackdropLoader /> : ''}
      <DialogTitle id="alert-dialog-title">Account</DialogTitle>
      {boxContents}
    </Dialog>
  );
}

export default AccountHandler;

