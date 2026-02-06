'use client';

import { Profiler } from 'react';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';
import Columns from '@/components/ux/layout/Columns';
import { useAppSelector } from '@/redux/hooks';
import FantasyGroup from '@/components/helpers/FantasyGroup';
import MyTeam from './MyTeam';
import Bracket from './Bracket';
import { useClientAPI } from '@/components/clientAPI';



/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div>
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

const Client = ({ fantasy_entry_id }) => {
  const fantasy_group = useAppSelector((state) => state.fantasyEntryReducer.fantasy_group);
  const fantasy_entry = useAppSelector((state) => state.fantasyEntryReducer.fantasy_entry);

  const fantasyHelper = new FantasyGroup({ fantasy_group });

  return (
    <Profiler id="FantasyEntry.Contents.Home.Client" onRender={(id, phase, actualDuration) => {
      console.log(id, phase, actualDuration);
    }}>
    <Contents>
      {
        fantasyHelper.isDraft() ?
          <div style = {{ padding: 5 }}><MyTeam /></div>
          : ''
      }
      {
        fantasyHelper.isNCAABracket() ?
          <Bracket />
          : ''
      }
    </Contents>
    </Profiler>
  );
};

export { Client, ClientSkeleton };
