'use client';
import React, { useState, useTransition } from 'react';
import { IconButton, Tab, Tabs, Tooltip, useTheme } from '@mui/material';
import { getBreakPoint, getHeaderHeight, getMarginTop } from './Header/ClientWrapper';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { setScrollTop, setSubView, setTopPlayersOnly, setView } from '@/redux/features/compare-slice';


import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import BackdropLoader from '@/components/generic/BackdropLoader';
import PlayerAdditionalOptions from './PlayerAdditionalOptions';
import TeamAdditionalOptions from './TeamAdditionalOptions';

import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { useScrollContext } from '@/contexts/scrollContext';
// import GroupsIcon from '@mui/icons-material/Groups';
// import StadiumIcon from '@mui/icons-material/Stadium';
// import LocalAirportIcon from '@mui/icons-material/LocalAirport';
// import HealingIcon from '@mui/icons-material/Healing';

const getSubNavHeaderHeight = () => {
  return 48;
};


export { getSubNavHeaderHeight };

const SubNavBar = ({ view, home_team_id, away_team_id, neutral_site }) => {
  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const [spin, setSpin] = useState(false);
  const subHeaderHeight = getSubNavHeaderHeight();
  const { width } = useWindowDimensions() as Dimensions;

  const scrollRef  = useScrollContext();

  // const view = useAppSelector(state => state.compareReducer.view);
  const subview = useAppSelector(state => state.compareReducer.subview);
  // const home_team_id = useAppSelector(state => state.compareReducer.home_team_id);
  // const away_team_id = useAppSelector(state => state.compareReducer.away_team_id);
  const topPlayersOnly = useAppSelector(state => state.compareReducer.topPlayersOnly);


  const tabOrder: string[] = ['team', 'player', 'trends'];
  const tabOptions = {
    'team': 'Team',
    'player': 'Players',
    'trends': 'Trends',
  };

  const [tabIndex, setTabIndex] = useState(tabOrder.indexOf(view) > -1 ? tabOrder.indexOf(view) : 0);

  let tabs: React.JSX.Element[] = [];
    
  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {(<span style = {{'fontSize': '12px'}}>{tabOptions[tabOrder[i]]}</span>)} />);
  }


  const handleView = (value) => {
    setTabIndex(value);
    setSpin(true);
    startTransition(() => {
      const newView = tabOrder[value];
      if (newView !== view) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('view', newView);
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.replace(`${pathName}${query}`);
      }
      dispatch(setView(newView));
      dispatch(setScrollTop(0));
      setSpin(false);

      if (scrollRef && scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    });
  };

  const handleSubView = () => {
    setSpin(true);
    startTransition(() => {
      const newView = (subview === 'table' ? null : 'table');
      if (newView !== subview) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        if (newView) {
          current.set('subview', newView);
        } else {
          current.delete('subview');
        }
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.replace(`${pathName}${query}`);
      }
      dispatch(setSubView(newView));
      dispatch(setScrollTop(0));
      setSpin(false);

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
    'height': subHeaderHeight,
    'position': 'fixed',
    'backgroundColor': theme.palette.background.default,
    'zIndex': theme.zIndex.drawer,
    'display': 'flex',
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'top': getHeaderHeight() + getMarginTop(),
    'left': 0,
    'right': 0,
    'padding': (width < getBreakPoint() ? '0px 5px' : '0px 20px'),
  };

  const leftButtons: React.JSX.Element[] = [];
  const middleButtons: React.JSX.Element[] = [];
  const rightButtons: React.JSX.Element[] = [];
  
  
  // BEWARE !!!! ON MOBILE, IF YOU ADD MORE BUTTONS, NEED TO REDESIGN, TABS TAKE UP TOO MUCH SPACE, SCROLL UP TO minSubBarWidth

  middleButtons.push(
    <Tabs key = {'tabs'} variant="scrollable" scrollButtons="auto" value={tabIndex} onChange={(e, value) => {handleView(value)}} indicatorColor="secondary" textColor="inherit">
      {tabs}
    </Tabs>
  );

  if (view === 'team') {
    rightButtons.push(<TeamAdditionalOptions key = {'team-additional'} neutral_site = {neutral_site} />);

    leftButtons.push(
      <Tooltip key = {'table-button'} title = {subview === 'table' ? 'View compare mode' : 'View table mode'}>
        <IconButton
          id = 'table-card-button'
          onClick = {handleSubView}
        >
          <CalendarViewMonthIcon color = {subview === 'table' ? 'success' : 'primary'} />
        </IconButton>
      </Tooltip>
    );
  } else if (view === 'player') {
    rightButtons.push(<PlayerAdditionalOptions key = {'player-additional'} />);

    leftButtons.push(
      <Tooltip key = {'top-player-button'} title = {topPlayersOnly ? 'Show all players' : 'View top MPG players'}>
        <IconButton
          id = 'top-players-button'
          onClick = {() => {dispatch(setTopPlayersOnly(!topPlayersOnly))}}
        >
          <SensorOccupiedIcon color = {topPlayersOnly ? 'success' : 'primary'} />
        </IconButton>
      </Tooltip>
    )
  }

  return (
    <>
    {
      home_team_id && away_team_id ?
      <div style = {subHeaderStyle}>
        {spin ? <BackdropLoader /> : ''}
        <div style = {{'minWidth': minSubBarWidth, 'display': 'flex', 'justifyContent': 'flex-start'}}>
          {leftButtons}
        </div>

        <div style = {{'minWidth': minSubBarWidth, 'display': 'flex', 'justifyContent': 'center'}}>
          {middleButtons}
        </div>

        <div style = {{'minWidth': minSubBarWidth, 'display': 'flex', 'justifyContent': 'flex-end'}}>
          {rightButtons}
        </div>
      </div>
      : ''
    }
    </>
  );
};

export default SubNavBar;