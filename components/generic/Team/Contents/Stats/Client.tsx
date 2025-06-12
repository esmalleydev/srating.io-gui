'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';
import Team from './Team';
import { getNavHeaderHeight } from '../../NavBar';
import { getSubNavHeaderHeight } from '../../SubNavbar';
import Roster from './Roster';
import { LinearProgress } from '@mui/material';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';

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
  const paddingTop = getNavHeaderHeight() + getSubNavHeaderHeight();

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

const Client = ({ organization_id, division_id, season, teamStats, rosterStats }) => {
  const searchParams = useSearchParams();
  const subView = searchParams?.get('subview') || 'team';

  return (
    <Contents>
      {subView === 'team' ? <Team organization_id = {organization_id} division_id = {division_id} season = {season} teamStats = {teamStats} /> : ''}
      {subView === 'player' ? <Roster organization_id = {organization_id} rosterStats = {rosterStats} /> : ''}
    </Contents>
  );
};

export { Client, ClientSkeleton };
