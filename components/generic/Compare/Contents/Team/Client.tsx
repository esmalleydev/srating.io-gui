'use client';

import React from 'react';
import TableView from './TableView';
import CompareView from './CompareView';
import { LinearProgress } from '@mui/material';
import { getHeaderHeight } from '../../Header/ClientWrapper';
import { getNavHeaderHeight } from '../../NavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { useAppSelector } from '@/redux/hooks';

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
  const paddingTop = getHeaderHeight() + getNavHeaderHeight();

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

const Client = ({ statistic_rankings }) => {
  const subview = useAppSelector((state) => state.compareReducer.subview);
  return (
    <Contents>
      {subview === 'table' ? <TableView statistic_rankings = {statistic_rankings} /> : <CompareView statistic_rankings = {statistic_rankings} />}
    </Contents>
  );
};

export { Client, ClientSkeleton };
