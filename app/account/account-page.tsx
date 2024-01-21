'use client';
import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Footer from '../../components/generic/Footer';

import Subscription from '../../components/generic/Account/Subscription';
import { Button, Paper, Typography } from '@mui/material';
import Settings from '../../components/generic/Account/Settings';
import { useClientAPI } from '@/components/clientAPI';
// import AccountHandler from '../components/generic/AccountHandler';


const Account = (props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


  const view = searchParams?.get('view') || 'subscriptions';
  let tabOrder = ['subscriptions', 'settings'];

  const viewIndex = tabOrder.indexOf(view);

  interface accountDataType {
    subscription: {
      [subscription_id: string]: {
        pricing_id: string,
      }
    };
    pricing: {
      [pricing_id: string]: {}
    };
    api_key: {
      [api_key_id: number]: {}
    };
    user: {
      [user_id: string]: {}
    };
  };


  const [request, setRequest] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState<accountDataType | null>(null);
  const [tabIndex, setTabIndex] = useState(viewIndex > -1 ? viewIndex : 0);

  

  let tabOptions = {
    'subscriptions': 'Subscriptions',
    'settings': 'Settings',
  };


  let tabs: React.JSX.Element[] = [];

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
    useClientAPI({
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

  let subscriptions: React.JSX.Element[] = [];

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



  return (
    <div>
      <main>
        {
          data === null ?
            <div style = {{'display': 'flex', 'justifyContent': 'center'}}><CircularProgress /></div>
          :
          <div>
            <Box display="flex" justifyContent="center">
              <Tabs variant="scrollable" scrollButtons="auto" value={tabIndex} onChange={handleTabClick} indicatorColor="secondary" textColor="inherit">
                {tabs}
              </Tabs>
            </Box>
            <div style = {{'padding': 20}}>
              {selectedTab == 'subscriptions' ? <div>{subscriptions}</div> : ''}
              {selectedTab == 'settings' ? <Settings user = {data.user || {}} /> : ''}
            </div>
          </div>
        }
      </main>
      <div style = {{'padding': '20px 0px 0px 0px'}}><Footer /></div>
    </div>
  );
}

export default Account;
