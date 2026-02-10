'use client';

import { Profiler } from 'react';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';
import { useAppSelector } from '@/redux/hooks';
import Columns from '@/components/ux/layout/Columns';
import Title from './Title';
import DraftBoard from './DraftBoard';
import DraftZone from './DraftZone';
import Loader from '@/components/generic/Ranking/Contents/Loader';
import MyPicks from './MyPicks';



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
  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);

  const getContents = () => {
    if (fantasy_group.drafted) {
      return (
        <>
          <Title />
          <Columns>
            <MyPicks />
            <DraftBoard />
          </Columns>
        </>
      );
    }

    return (
      <>
        {
          fantasy_group &&
          fantasy_group.fantasy_group_id ?
          <Loader organization_id={fantasy_group.organization_id} division_id={fantasy_group.division_id} season = {fantasy_group.season} view = 'player' />
            : ''
        }
        <Title />
        <Columns>
          <MyPicks />
          <DraftBoard />
        </Columns>
        <DraftZone />
      </>
    );
  };


  return (
    <Profiler id="FantasyGroup.Contents.Draft.Client" onRender={(id, phase, actualDuration) => {
      console.log(id, phase, actualDuration);
    }}>
    <Contents>
      {getContents()}
    </Contents>
    </Profiler>
  );
};

export { Client, ClientSkeleton };
