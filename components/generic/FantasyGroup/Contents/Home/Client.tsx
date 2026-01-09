'use client';

import { Profiler, useState } from 'react';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';
import { useClientAPI } from '@/components/clientAPI';
import { useAppDispatch } from '@/redux/hooks';
import Columns from '@/components/ux/layout/Columns';
import Members from './Members';
import { FantasyEntrys, FantasyGroup, FantasyGroupComments, FantasyGroupInvites, FantasyGroupUsers } from '@/types/general';
import Invites from './Invites';
import { setDataKey } from '@/redux/features/fantasy_group-slice';
import Entries from './Entries';
import Ranking from './Ranking';
import Comments from './Comments';
import MyEntries from './MyEntries';
import LeagueManagement from './LeagueManagement';


interface Data {
  isOwner: boolean;
  fantasy_group: FantasyGroup;
  fantasy_group_users: FantasyGroupUsers;
  fantasy_group_invites: FantasyGroupInvites;
  fantasy_group_comments: FantasyGroupComments;
  fantasy_entrys: FantasyEntrys;
  fantasy_rankings: {}, // todo
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
  // const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);

  const [request, setRequest] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState<Data | null>(null);


  const load = () => {
    setRequest(true);
    useClientAPI({
      class: 'fantasy_group',
      function: 'load',
      arguments: {
        fantasy_group_id,
      },
    }).then((fantasyData: Data) => {
      setLoaded(true);
      dispatch(setDataKey({ key: 'fantasy_group_users', value: fantasyData.fantasy_group_users }));
      dispatch(setDataKey({ key: 'fantasy_group_invites', value: fantasyData.fantasy_group_invites }));
      dispatch(setDataKey({ key: 'fantasy_group_comments', value: fantasyData.fantasy_group_comments }));
      dispatch(setDataKey({ key: 'fantasy_entrys', value: fantasyData.fantasy_entrys }));
      setData(fantasyData);
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



  return (
    <Profiler id="FantasyGroup.Contents.Home.Client" onRender={(id, phase, actualDuration) => {
      console.log(id, phase, actualDuration);
    }}>
    <Contents>
      <div style = {{ marginBottom: 20 }}>
        <MyEntries />
      </div>
      <div style = {{ marginBottom: 20 }}>
        <LeagueManagement isOwner = {data && data.isOwner} />
      </div>
      <Columns numberOfColumns={2} style = {{ marginBottom: 20 }}>
        <Members />
        <Invites isOwner = {data && data.isOwner} />
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
