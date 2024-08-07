'use client';

import React from 'react';
import TableView from './TableView';
import CompareView from './CompareView';
import { LinearProgress } from '@mui/material';
import { getHeaderHeight } from '../Header/ClientWrapper';
import { getSubNavHeaderHeight } from '../SubNavBar';
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
  const paddingTop = getHeaderHeight() + getSubNavHeaderHeight();

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 120;
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

const Client = ({ home_team_id, away_team_id, teams, season, subview }) => {
  return (
    <Contents>
    {subview === 'table' ? <TableView teams = {teams} season = {season} /> : <CompareView home_team_id = {home_team_id} away_team_id = {away_team_id} teams = {teams} season = {season} />}
    </Contents>
  );
};

export { Client, ClientSkeleton };
