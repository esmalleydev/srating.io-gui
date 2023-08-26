import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Footer from '../components/generic/Footer';

import Api from '../components/Api.jsx';
import Subscription from '../components/generic/Account/Subscription';
import { Button, Paper, Typography, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import AccountHandler from '../components/generic/AccountHandler';

const api = new Api();

const Account = (props) => {
  const router = useRouter();

  const view = (router.query && router.query.view) || 'subscriptions';
  let tabOrder = ['subscriptions', 'password'];

  const viewIndex = tabOrder.indexOf(view);


  const [request, setRequest] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState(null);
  const [tabIndex, setTabIndex] = useState(viewIndex > -1 ? viewIndex : 0);

  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const [passwordConfirm, setPasswordConfirm] = useState(null);
  const [passwordErrorConfirm, setPasswordErrorConfirm] = useState(null);
  const [isReseting, setIsReseting] = useState(false);
  const [reset, setReset] = useState(false);
  

  let tabOptions = {
    'subscriptions': 'Subscriptions',
    'password': 'Password',
  };


  let tabs = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {(<span style = {{'fontSize': '12px'}}>{tabOptions[tabOrder[i]]}</span>)} />);
  }

  const selectedTab = tabOrder[tabIndex];

  const handleTabClick = (e, value) => {
    setTabIndex(value);
  }

  let session_id = (typeof window !== 'undefined' && localStorage.getItem('session_id')) || null;

  if (!session_id) {
    return <div style = {{'padding': 20, 'textAlign': 'center'}}><Typography variant='h5'>Please login to view account information</Typography></div>
  }


  const loadAccount = () => {;
    setRequest(true);
    api.Request({
      'class': 'billing',
      'function': 'loadAccount',
      'arguments': {}
    }).then(accountData => {
      setLoaded(true);
      setData(accountData);
    }).catch((err) => {
      // nothing for now
    });
  }

  if (!request) {
    loadAccount();
  }

  let subscriptions = [];

  if (data && data.subscription) {
    for (let subscription_id in data.subscription) {
      let subscription = data.subscription[subscription_id];
      let pricing = (subscription.pricing_id && data.pricing && data.pricing[subscription.pricing_id]) || {}; 
      subscriptions.push(
        <div style = {{'display': 'flex', 'justifyContent': 'center', 'margin': '10px 0px'}}>
          <Subscription
            subscription = {subscription}
            pricing = {pricing}
            api_keys = {data.api_key || {}}
          />
        </div>
      );
    }
  }

  if (!subscriptions.length && loaded) {
    subscriptions.push(
      <div style = {{'display': 'flex', 'justifyContent': 'center', 'margin': '10px 0px'}}>
        <Paper elevation={3} style = {{'minWidth': 320, 'maxWidth': 450, 'width': 'auto', 'padding': 15}}>
          <Typography variant='h5'>No active subscriptions</Typography>
          <Typography color = {'text.secondary'} variant='body1'>Subscribe today for picks or API access!</Typography>
          <div style = {{'textAlign': 'right'}}><Button onClick={() => {router.push('/pricing')}}>View pricing</Button></div>
        </Paper>
      </div>
    );
  }

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

    api.Request({
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
        setPassword(null);
        setPasswordConfirm(null);
      }
    }).catch((e) => {
      setPasswordError('Something went wrong, try again later');
    });
  };

  let passwordInputs = (
    <div style = {{'display': 'flex', 'justifyContent': 'center'}}>
      <Paper elevation={3} style={{'padding': 20, 'minWidth': 500}}>
        <Typography variant='h5'>Update your password</Typography>
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
      <Head>
        <title>sRating | Aggregate college basketball ranking, scores, picks</title>
        <meta name = 'description' content = 'View statistic ranking, live score, live odds, picks for college basketball' key = 'desc'/>
        <meta property="og:title" content=">sRating.io college basketball rankings" />
        <meta property="og:description" content="View statistic ranking, live score, live odds, picks for college basketball" />
        <meta name="twitter:card" content="summary" />
        <meta name = 'twitter:title' content = 'View statistic ranking, live score, live odds, picks for college basketball' />
      </Head>
      <main>
        {
          data === null ?
            <div style = {{'display': 'flex', 'justifyContent': 'center'}}><CircularProgress /></div>
          :
          <div>
            <Box display="flex" justifyContent="center" /*sx = {{'position': 'sticky', 'top': 100}}*/>
              <Tabs variant="scrollable" scrollButtons="auto" value={tabIndex} onChange={handleTabClick} indicatorColor="secondary" textColor="inherit">
                {tabs}
              </Tabs>
            </Box>
            <div style = {{'padding': 20}}>
              {selectedTab == 'subscriptions' ? <div>{subscriptions}</div> : ''}
              {selectedTab == 'password' ? <div>{passwordInputs}</div> : ''}
            </div>
          </div>
        }
      </main>
      <div style = {{'padding': '20px 0px 0px 0px'}}><Footer /></div>
    </div>
  );
}

export default Account;
