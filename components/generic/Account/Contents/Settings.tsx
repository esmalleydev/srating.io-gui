'use client';

import { useState } from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useClientAPI } from '@/components/clientAPI';
import Paper from '@/components/ux/container/Paper';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';
import Button from '@/components/ux/buttons/Button';
import Columns from '@/components/ux/layout/Columns';
import TextInput from '@/components/ux/input/TextInput';
import Inputs from '@/components/helpers/Inputs';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/loading-slice';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { setDataKey } from '@/redux/features/user-slice';



const Settings = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions() as Dimensions;

  const user = useAppSelector((state) => state.userReducer.user);

  const [displayName, setDisplayName] = useState<string | undefined>(user.display_name || undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [passwordConfirm, setPasswordConfirm] = useState<string | undefined>(undefined);

  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [passwordErrorConfirm, setPasswordErrorConfirm] = useState<string | undefined>(undefined);
  const [accountError, setAccountError] = useState<string | undefined>(undefined);

  const [isReseting, setIsReseting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);


  const [reset, setReset] = useState(false);
  const [updated, setUpdated] = useState(false);

  const [triggerPasswordValidation, setTriggerPasswordValidation] = useState(false);
  const [triggerAccountValidation, setTriggerAccountValidation] = useState(false);

  const passwordInputHandler = new Inputs();
  const accountInputHandler = new Inputs();

  const breakPoint = 640;


  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      handleResetPassword();
    }
  };

  const handleResetPassword = () => {
    if (isReseting) {
      return;
    }

    const inputErrors = passwordInputHandler.getErrors();
    

    if (inputErrors.length) {
      setTriggerPasswordValidation(true);
      return;
    }


    if (password !== passwordConfirm) {
      setPasswordErrorConfirm('Password does not match');
      setPasswordError('Password does not match');
      setTriggerPasswordValidation(true);
      return;
    }

    
    if (password && password.length < 7) {
      setPasswordError('Password must be at least 7 characters');
      setPasswordErrorConfirm('Password must be at least 7 characters');
      setTriggerPasswordValidation(true);
      return;
    }


    setIsReseting(true);
    dispatch(setLoading(true));

    useClientAPI({
      class: 'user',
      function: 'resetPassword',
      arguments: {
        password,
        confirm_password: passwordConfirm,
      },
    }).then((response) => {
      setIsReseting(false);
      dispatch(setLoading(false));
      if (!response) {
        setPasswordError('Something went wrong, try again later');
      } else if (response) {
        setReset(true);
        setTriggerPasswordValidation(false);
        setPassword('');
        setPasswordConfirm('');
      }
    }).catch((e) => {
      setPasswordError('Something went wrong, try again later');
      setIsReseting(false);
      dispatch(setLoading(false));
    });
  };

  const handleUpdateAccount = () => {
    if (isUpdating) {
      return;
    }
    
    const inputErrors = accountInputHandler.getErrors();
    
    if (inputErrors.length) {
      setTriggerAccountValidation(true);
      return;
    }

    setIsUpdating(true);
    dispatch(setLoading(true));

    useClientAPI({
      class: 'user',
      function: 'updateAccount',
      arguments: {
        display_name: displayName
      },
    }).then((data) => {
      setIsUpdating(false);
      dispatch(setLoading(false));
      if (!data || data.error) {
        setAccountError(data.error || 'Something went wrong, try again later');
      } else if (data) {
        setUpdated(true);
        setTriggerAccountValidation(false);
        dispatch(setDataKey({ key: 'user', value: data.user }));
      }
    }).catch((e) => {
      setAccountError('Something went wrong, try again later');
      setIsUpdating(false);
      dispatch(setLoading(false));
    });
  };


  const getPasswordPaper = () => {
    return (
      <div style = {{ marginTop: 20 }}>
        <Typography type='h6'>Update password</Typography>
        <Paper elevation={3} style={{ padding: 20, minWidth: 300 }}>
          <TextInput
            inputHandler={passwordInputHandler}
            disabled
            value = {user.username}
            id="email"
            placeholder="Email Address"
            type = 'email'
            variant="standard"
          />
          <TextInput
            inputHandler={passwordInputHandler}
            required
            error = {Boolean(passwordError)}
            errorMessage = {passwordError}
            onChange = {(val) => {
              setPassword(val);

              // reset any custom errors here
              setTriggerPasswordValidation(false);
              setPasswordErrorConfirm(undefined);
              setPasswordError(undefined);
            }}
            value = {password}
            placeholder="Password"
            type="password"
            variant="standard"
            triggerValidation = {triggerPasswordValidation}
            maxLength = {255}
            />
          <TextInput
            inputHandler={passwordInputHandler}
            required
            value = {passwordConfirm}
            error = {Boolean(passwordErrorConfirm)}
            errorMessage = {passwordErrorConfirm}
            onChange = {(val) => {
              setPasswordConfirm(val);

              // reset any custom errors here
              setTriggerPasswordValidation(false);
              setPasswordErrorConfirm(undefined);
              setPasswordError(undefined);
            }}
            onKeyDown = {handleEnter}
            placeholder="Confirm password"
            type="password"
            variant="standard"
            triggerValidation = {triggerPasswordValidation}
            maxLength = {255}
          />
          <div style = {{ textAlign: 'right', marginTop: 10 }}>{
            reset ?
            <div style = {{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}><CheckCircleIcon color='success' /><Typography type='body1' style={{ display: 'inline-block', marginLeft: 10, color: theme.success.main }}>Password reset!</Typography></div>
              :
            <Button
              disabled = {isReseting} handleClick={handleResetPassword} title = {'Change password'} value = 'change-password' />
          }</div>
        </Paper>
      </div>
    );
  };

  const getAccountPaper = () => {
    return (
      <div style = {{ marginTop: 20 }}>
        <Typography type='h6'>Account settings</Typography>
        <Paper elevation={3} style={{ padding: 20, minWidth: 300 }}>
          <TextInput
            inputHandler={accountInputHandler}
            value = {displayName}
            onChange={
              (val) => {
                setDisplayName(val);
                // reset any custom errors here since the valid changed.
                // Those custom errors will need to be rechecked outside of this function
                setTriggerAccountValidation(false);
                setAccountError(undefined);
              }
            }
            error = {Boolean(accountError)}
            errorMessage = {accountError}
            label = 'What name should be displayed publically? (in leagues or comments)'
            placeholder="Name"
            variant="standard"
            triggerValidation = {triggerAccountValidation}
            maxLength = {255}
          />
          
          <div style = {{ textAlign: 'right', marginTop: 10 }}>{
            updated ?
            <div style = {{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}><CheckCircleIcon color='success' /><Typography type='body1' style={{ display: 'inline-block', marginLeft: 10, color: theme.success.main }}>Updated!</Typography></div>
              :
            <Button disabled = {isUpdating} handleClick={handleUpdateAccount} title = {'Update'} value = 'update-account' />
          }</div>
        </Paper>
      </div>
    );
  };

  return (
    <div style = {{ margin: 'auto', maxWidth: 800, }}>
      <Columns breakPoint={breakPoint}>
        {getAccountPaper()}
        {getPasswordPaper()}
      </Columns>
    </div>
  );
};

export default Settings;
