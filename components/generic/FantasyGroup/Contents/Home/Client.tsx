'use client';

import { Profiler, useState } from 'react';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';
import { useClientAPI } from '@/components/clientAPI';
import { useAppDispatch } from '@/redux/hooks';
import Columns from '@/components/ux/layout/Columns';
import Members from './Members';
import Invites from './Invites';
import Entries from './Entries';
import Ranking from './Ranking';
import Comments from './Comments';
import MyEntries from './MyEntries';
import LeagueManagement from './LeagueManagement';
import { FantasyGroupLoadData, handleLoad } from '../../ReduxWrapper';
import DraftOrBracketCountdown from './DraftOrBracketCountdown';
import Typography from '@/components/ux/text/Typography';



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
  const paddingTop = 0;

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

const Client = ({ fantasy_group_id }) => {
  const dispatch = useAppDispatch();

  const [request, setRequest] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [canView, setCanView] = useState(true);


  const load = () => {
    setRequest(true);
    useClientAPI({
      class: 'fantasy_group',
      function: 'load',
      arguments: {
        fantasy_group_id,
      },
    }).then((fantasyData: FantasyGroupLoadData) => {
      setLoaded(true);
      if (!fantasyData || fantasyData.error) {
        setCanView(false);
      } else {
        handleLoad({
          dispatch,
          data: fantasyData,
        });
      }
    }).catch((err) => {
      // nothing for now
    });
  };

  if (!request && fantasy_group_id) {
    load();
  }

  if (!loaded) {
    return <ClientSkeleton />;
  }

  if (!canView) {
    return (
      <Contents>
        <Typography style = {{ textAlign: 'center' }} type = 'h5'>You do not have permission to view this group!</Typography>
      </Contents>
    );
  }

  return (
    <Profiler id="FantasyGroup.Contents.Home.Client" onRender={(id, phase, actualDuration) => {
      console.log(id, phase, actualDuration);
    }}>
    <Contents>
      <Columns numberOfColumns={2} style = {{ marginBottom: 20 }}>
        <MyEntries />
        <DraftOrBracketCountdown />
      </Columns>
      <div style = {{ marginBottom: 20 }}>
        <LeagueManagement />
      </div>
      <Columns numberOfColumns={2} style = {{ marginBottom: 20 }}>
        <Members />
        <Invites />
      </Columns>
      <Columns numberOfColumns={2}>
        <Entries />
        <Ranking />
        <Comments />
      </Columns>
    </Contents>
    </Profiler>
  );
};

export { Client, ClientSkeleton };
