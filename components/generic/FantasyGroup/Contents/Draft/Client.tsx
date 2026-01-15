'use client';

import { Profiler, useEffect, useState } from 'react';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';
import { useClientAPI } from '@/components/clientAPI';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useSocket } from '@/contexts/socketContext';



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

  // const { connect, disconnect, message, lastMessage } = useSocket();
  // const session_id = useAppSelector((state) => state.userReducer.session_id);

  useEffect(() => {

    useClientAPI({
      class: 'fantasy_draft_order',
      function: 'test',
      arguments: {
        fantasy_group_id,
      },
    }).then((r) => {
      console.log(r)
    }).catch((err) => {
      // nothing for now
    });
  }, []);


  return (
    <Profiler id="FantasyGroup.Contents.Draft.Client" onRender={(id, phase, actualDuration) => {
      console.log(id, phase, actualDuration);
    }}>
    <Contents>
      <div>hello world</div>
    </Contents>
    </Profiler>
  );
};

export { Client, ClientSkeleton };
