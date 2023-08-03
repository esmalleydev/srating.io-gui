import React, { useState } from 'react';
import { useRouter } from 'next/router';

import Cookies from 'universal-cookie';

import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


import Api from './../Api.jsx';
const api = new Api();


const AccountHandler = (props) => {
  const theme = useTheme();
  const router = useRouter();
  const cookies = new Cookies();

  const [spin, setSpin] = useState(false);

  const [register, setRegister] = useState(false);
  const [requestedLogin, setRequestedLogin] = useState(false);

  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const [passwordConfirm, setPasswordConfirm] = useState(null);
  const [passwordErrorConfirm, setPasswordErrorConfirm] = useState(null);

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

    api.Request({
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
        cookies.set('session_id', session_id, {'path': '/'});
        router.push('/account');
        props.loginCallback();
        props.closeHandler();
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

    api.Request({
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
        cookies.set('session_id', response, {'path': '/'});
        router.push('/account');
        props.closeHandler();
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
      } else {
        handleLogin();
      }
    }
  };



  return (
    <Dialog
      open={props.open}
      onClose={props.closeHandler}
    >
      {spin ?
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
      : ''}
      <DialogTitle id="alert-dialog-title">Account</DialogTitle>
      {
        register === false ?
        <DialogContent>
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
          <DialogContentText sx = {{'marginTop': 3}}>No account? <Link sx = {{'cursor': 'pointer'}} onClick = {() => {setRegister(true);}}>Create account</Link></DialogContentText>
        </DialogContent> :
        <DialogContent>
          <DialogContentText sx = {{'marginBottom': 2}}>Create an account</DialogContentText>
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
      }
      <DialogActions>
        <Button onClick = {register ? handleRegister : handleLogin}>{register ? 'Create account' : 'Sign in'}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AccountHandler;

