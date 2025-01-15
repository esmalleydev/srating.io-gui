'use client';

import { LinearProgress, Typography } from '@mui/material';
import { getNavHeaderHeight } from './NavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { useEffect, useState } from 'react';
import { ApiKeys, Pricings, Subscriptions as SubscriptionsType, User } from '@/types/general';
import { useClientAPI } from '@/components/clientAPI';
import Settings from './Settings';
import Subscriptions from './Subscriptions';

interface Data {
  subscription: SubscriptionsType;
  pricing: Pricings;
  api_key: ApiKeys;
  user: User;
}


/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ textAlign: 'center' }}>
      {children}
    </div>
  );
};


const ClientSkeleton = () => {
  const paddingTop = getNavHeaderHeight();

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 132; // 132 is the <Footer
  return (
    <Contents>
      <div style = {{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100vh - ${heightToRemove}px)`,
      }}>
        <LinearProgress color = 'secondary' style={{ width: '50%' }} />
      </div>
    </Contents>
  );
};

const ClientWrapper = ({ view }) => {
  const [request, setRequest] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState<Data | null>(null);

  const session_id = (typeof window !== 'undefined' && localStorage.getItem('session_id')) || null;

  useEffect(() => {
    setLoaded(false);
    setRequest(false);
    setData(null);
  }, [session_id]);

  if (!session_id || (data && !data.user)) {
    return (
      <Contents>
        <Typography variant='h5'>Please login to view account information</Typography>
      </Contents>
    );
  }

  const loadAccount = () => {
    setRequest(true);
    useClientAPI({
      class: 'billing',
      function: 'loadAccount',
      arguments: {},
    }).then((accountData) => {
      setLoaded(true);
      setData(accountData);
    }).catch((err) => {
      // nothing for now
    });
  };

  if (!request) {
    loadAccount();
  }

  if (!loaded) {
    return <ClientSkeleton />;
  }



  return (
    <Contents>
      {view === 'subscriptions' ? <Subscriptions subscriptions = {data?.subscription} api_keys = {data?.api_key} pricing = {data?.pricing} /> : ''}
      {view === 'settings' && data ? <Settings user = {data.user} /> : ''}
    </Contents>
  );
};

export { ClientWrapper, ClientSkeleton };
