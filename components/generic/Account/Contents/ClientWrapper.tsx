'use client';

import { LinearProgress } from '@mui/material';
import { getNavHeaderHeight } from '../NavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import Settings from './Settings';
import Subscriptions from './Subscriptions';
import { useAppSelector } from '@/redux/hooks';
import Fantasy from './Fantasy';




/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ margin: '0px 5px'}}>
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

const Client = () => {
  const view = useAppSelector((state) => state.userReducer.view);
  const loadedAccount = useAppSelector((state) => state.userReducer.loadedAccount);

  if (!loadedAccount) {
    return <ClientSkeleton />;
  }

  return (
    <Contents>
      {view === 'subscriptions' ? <Subscriptions /> : ''}
      {view === 'fantasy' ? <Fantasy /> : ''}
      {view === 'settings' ? <Settings /> : ''}
    </Contents>
  );
};

export { Client, ClientSkeleton };
