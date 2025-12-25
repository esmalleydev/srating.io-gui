'use client';

import { Profiler, useEffect, useState } from 'react';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';
import { useTheme } from '@/components/hooks/useTheme';
import { getNavHeaderHeight } from '../../NavBar';
import Navigation from '@/components/helpers/Navigation';
import { useClientAPI } from '@/components/clientAPI';


interface Data {
  // todo public fantasy groups and private fantasy groups that this user is a part of
}

/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ padding: 5 }}>
      {children}
    </div>
  );
};


const ClientSkeleton = () => {
  const paddingTop = getNavHeaderHeight();

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 84;
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

const Client = ({ }) => {
  const navigation = new Navigation();
  const theme = useTheme();

  // const player = useAppSelector((state) => state.playerReducer.player);
  // const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  // const path = Organization.getPath({ organizations, organization_id });
  // const season = useAppSelector((state) => state.playerReducer.season);
  // const subview = useAppSelector((state) => state.playerReducer.subview);

  const [request, setRequest] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState<Data | null>(null);

  const session_id = (typeof window !== 'undefined' && localStorage.getItem('session_id')) || null;

  useEffect(() => {
    setLoaded(false);
    setRequest(false);
    setData(null);
  }, [session_id]);


  const loadHome = () => {
    setRequest(true);
    useClientAPI({
      class: 'fantasy_group',
      function: 'loadHome',
      arguments: {},
    }).then((fantasyData) => {
      setLoaded(true);
      setData(fantasyData);
    }).catch((err) => {
      // nothing for now
    });
  };

  if (!request) {
    loadHome();
  }

  if (!loaded) {
    return <ClientSkeleton />;
  }



  return (
    <Profiler id="Fantasy.Contents.Home.Client" onRender={(id, phase, actualDuration) => {
      console.log(id, phase, actualDuration);
    }}>
    <Contents>
      <div>hello world home</div>
      <pre>{JSON.stringify(data)}</pre>
    </Contents>
    </Profiler>
  );
};

export { Client, ClientSkeleton };
