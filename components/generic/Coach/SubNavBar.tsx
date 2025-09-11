'use client';

import React, { useState, useTransition } from 'react';
import { Tab, Tabs, useTheme } from '@mui/material';
import { getBreakPoint, getHeaderHeight, getMarginTop } from './Header/ClientWrapper';

import { useAppDispatch } from '@/redux/hooks';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';


import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { useScrollContext } from '@/contexts/scrollContext';
import { setLoading } from '@/redux/features/display-slice';


const getSubNavHeaderHeight = () => {
  return 48;
};


export { getSubNavHeaderHeight };

// not used atm

const SubNavBar = ({ view }) => {
  return null;
  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const subHeaderHeight = getSubNavHeaderHeight();
  const { width } = useWindowDimensions() as Dimensions;

  // const view = useAppSelector(state => state.compareReducer.view);

  const scrollRef = useScrollContext();

  const tabOrder: string[] = ['trends', 'seasons'];
  const tabOptions = {
    seasons: 'Seasons',
    trends: 'Trends',
  };

  const [tabIndex, setTabIndex] = useState(tabOrder.indexOf(view) > -1 ? tabOrder.indexOf(view) : 0);

  const tabs: React.JSX.Element[] = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {(<span style = {{ fontSize: '12px' }}>{tabOptions[tabOrder[i]]}</span>)} />);
  }

  const handleView = (value) => {
    setTabIndex(value);
    dispatch(setLoading(true));
    startTransition(() => {
      const newView = tabOrder[value];
      if (newView !== view) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('view', newView);
        const search = current.toString();
        const query = search ? `?${search}` : '';
        router.replace(`${pathName}${query}`);
      }
      // dispatch(setView(newView));
      // dispatch(setScrollTop(0));

      if (scrollRef && scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    });
  };



  let minSubBarWidth = 75;

  if (width < getBreakPoint()) {
    minSubBarWidth = 40;
  }

  const subHeaderStyle: React.CSSProperties = {
    height: subHeaderHeight,
    position: 'fixed',
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: getHeaderHeight() + getMarginTop(),
    left: 0,
    right: 0,
    padding: (width < getBreakPoint() ? '0px 5px' : '0px 20px'),
  };

  const leftButtons: React.JSX.Element[] = [];
  const middleButtons: React.JSX.Element[] = [];
  const rightButtons: React.JSX.Element[] = [];


  middleButtons.push(
    <Tabs key = {'tabs'} variant="scrollable" scrollButtons="auto" value={tabIndex} onChange={(e, value) => { handleView(value); }} indicatorColor="secondary" textColor="inherit">
      {tabs}
    </Tabs>,
  );

  return (
    <div style = {subHeaderStyle}>
      <div style = {{ minWidth: minSubBarWidth, display: 'flex', justifyContent: 'flex-start' }}>
        {leftButtons}
      </div>

      <div style = {{ minWidth: minSubBarWidth, display: 'flex', justifyContent: 'center' }}>
        {middleButtons}
      </div>

      <div style = {{ minWidth: minSubBarWidth, display: 'flex', justifyContent: 'flex-end' }}>
        {rightButtons}
      </div>
    </div>
  );
};

export default SubNavBar;
