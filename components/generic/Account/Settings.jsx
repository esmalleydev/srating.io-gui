import React, { useState } from 'react';

import { Button, Paper, TextField, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useClientAPI } from '@/components/clientAPI';



const Settings = (props) => {
  const self = this;

  const user = props.user;

  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const [passwordConfirm, setPasswordConfirm] = useState(null);
  const [passwordErrorConfirm, setPasswordErrorConfirm] = useState(null);
  const [isReseting, setIsReseting] = useState(false);
  const [reset, setReset] = useState(false);


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
      handleResetPassword();
    }
  };

  const handleResetPassword = () => {
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

    setIsReseting(true);

    useClientAPI({
      'class': 'user',
      'function': 'resetPassword',
      'arguments': {
        'password': password,
        'confirm_password': passwordConfirm,
      },
    }).then((response) => {
      setIsReseting(false);
      if (!response) {
        setPasswordError('Something went wrong, try again later');
        return;
      } else if (response) {
        setReset(true);
        setPassword('');
        setPasswordConfirm('');
      }
    }).catch((e) => {
      setPasswordError('Something went wrong, try again later');
    });
  };

  let passwordInputs = (
    <div style = {{'display': 'flex', 'justifyContent': 'center'}}>
      <Paper elevation={3} style={{'padding': 20, 'minWidth': 300}}>
        <Typography variant='h5'>Update your password</Typography>
        <TextField
          disabled
          value = {user.username}
          margin="dense"
          id="email"
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
          value = {password}
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="standard"
          />
        <TextField
          required
          value = {passwordConfirm}
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
        <div style = {{'textAlign': 'right', 'marginTop': 10}}>{
          reset ?
          <div style = {{'display': 'flex', 'justifyContent': 'end', 'alignItems': 'center'}}><CheckCircleIcon color='success' /><Typography color = 'success.main' variant='body1' style={{'display': 'inline-block', 'marginLeft': 10}}>Password reset!</Typography></div>
          :
          <Button disabled = {isReseting} onClick={handleResetPassword}>Change password</Button>
        }</div>
      </Paper>
    </div>
  );



  return (
    <div>
      {passwordInputs}
    </div>
  );
}

export default Settings;