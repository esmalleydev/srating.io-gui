'use client';

import React, { useTransition } from 'react';
import { getBreakPoint, getHeaderHeight, getMarginTop } from './Header/ClientWrapper';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { setDataKey } from '@/redux/features/compare-slice';


import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import PlayerAdditionalOptions from './PlayerAdditionalOptions';
import TeamAdditionalOptions from './TeamAdditionalOptions';

import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { useScrollContext } from '@/contexts/scrollContext';
import Organization from '@/components/helpers/Organization';
import { useTheme } from '@/components/hooks/useTheme';
import Style from '@/components/utils/Style';
import Tab from '@/components/ux/buttons/Tab';
import Tooltip from '@/components/ux/hover/Tooltip';
import IconButton from '@/components/ux/buttons/IconButton';
// import GroupsIcon from '@mui/icons-material/Groups';
// import StadiumIcon from '@mui/icons-material/Stadium';
// import LocalAirportIcon from '@mui/icons-material/LocalAirport';
// import HealingIcon from '@mui/icons-material/Healing';

const getNavHeaderHeight = () => {
  return 48;
};

const getSubNavHeaderHeight = () => {
  return 40;
};



export { getNavHeaderHeight, getSubNavHeaderHeight };

const NavBar = () => {
  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const navHeaderHeight = getNavHeaderHeight();
  const { width } = useWindowDimensions() as Dimensions;

  const scrollRef = useScrollContext();

  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  // const division_id = useAppSelector((state) => state.organizationReducer.division_id);
  const view = useAppSelector((state) => state.compareReducer.view);
  const subview = useAppSelector((state) => state.compareReducer.subview) || (view === 'trends' ? 'stat_compare' : null);
  const home_team_id = useAppSelector((state) => state.compareReducer.home_team_id);
  const away_team_id = useAppSelector((state) => state.compareReducer.away_team_id);
  // const neutral_site = useAppSelector((state) => state.compareReducer.neutral_site);
  const topPlayersOnly = useAppSelector((state) => state.compareReducer.topPlayersOnly);


  const tabOptions = {
    team: 'Team',
    player: 'Players',
    trends: 'Trends',
  };

  const tabOrder: string[] = ['team', 'player', 'trends'];

  let subTabOptions = {};
  if (view === 'trends') {
    subTabOptions = {
      stat_compare: 'Stat compare',
      previous_matchups: 'Prev. Matchups',
    };
  }

  let subTabOrder: string[] = [];
  if (view === 'trends') {
    subTabOrder = ['stat_compare', 'previous_matchups'];
  }


  const handleView = (e, value) => {
    const newView = value;

    if (newView !== view) {
      dispatch(setDataKey({ key: 'view', value: newView }));
      dispatch(setDataKey({ key: 'subview', value: null }));
      dispatch(setDataKey({ key: 'loadingView', value: true }));
      dispatch(setDataKey({ key: 'scrollTop', value: 0 }));

      const current = new URLSearchParams(window.location.search);
      current.set('view', newView);
      current.delete('subview');

      window.history.replaceState(null, '', `?${current.toString()}`);

      // use pushState if we want to add to back button history
      // window.history.pushState(null, '', `?${current.toString()}`);

      const search = current.toString();
      const query = search ? `?${search}` : '';

      startTransition(() => {
        router.replace(`${pathName}${query}`);
      });
    }
  };

  const handleSubView = (e, value) => {
    const newSubView = value;

    if (newSubView !== view) {
      dispatch(setDataKey({ key: 'subview', value: newSubView }));
      dispatch(setDataKey({ key: 'loadingView', value: true }));
      dispatch(setDataKey({ key: 'scrollTop', value: 0 }));

      const current = new URLSearchParams(window.location.search);
      if (newSubView) {
        current.set('subview', newSubView);
      } else {
        current.delete('subview');
      }

      window.history.replaceState(null, '', `?${current.toString()}`);

      // use pushState if we want to add to back button history
      // window.history.pushState(null, '', `?${current.toString()}`);

      const search = current.toString();
      const query = search ? `?${search}` : '';

      if (scrollRef && scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }

      startTransition(() => {
        router.replace(`${pathName}${query}`);
      });
    }
  };


  const tabs: React.JSX.Element[] = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} value = {tabOrder[i]} selected = {tabOrder[i] === view} title = {tabOptions[tabOrder[i]]} handleClick = {handleView} />);
  }

  const subTabs: React.JSX.Element[] = [];

  for (let i = 0; i < subTabOrder.length; i++) {
    subTabs.push(
      <Tab key = {subTabOrder[i]} value = {subTabOrder[i]} selected = {subTabOrder[i] === subview} title = {subTabOptions[subTabOrder[i]]} handleClick = {handleSubView} />,
    );
  }


  let minSubBarWidth = 75;

  if (width < getBreakPoint()) {
    minSubBarWidth = 40;
  }

  const headerStyle: React.CSSProperties = {
    height: navHeaderHeight,
    position: 'fixed',
    backgroundColor: theme.background.main,
    zIndex: Style.getZIndex().drawer,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: getHeaderHeight() + getMarginTop(),
    left: 0,
    right: 0,
    padding: (width < getBreakPoint() ? '0px 5px' : '0px 20px'),
  };

  const subHeaderStyle: React.CSSProperties = {
    position: 'fixed',
    backgroundColor: theme.background.main,
    height: getSubNavHeaderHeight(),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    overflowX: 'scroll',
    overflowY: 'hidden',
    scrollbarWidth: 'none',
    top: getHeaderHeight() + getSubNavHeaderHeight() + getMarginTop() + 8,
    left: 0,
    right: 0,
    padding: (width < getBreakPoint() ? '0px 5px' : '0px 20px'),
  };

  const leftButtons: React.JSX.Element[] = [];
  const middleButtons: React.JSX.Element[] = [];
  const rightButtons: React.JSX.Element[] = [];


  middleButtons.push(
    <div key = {'middle-button-div-compare'} style = {{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      top: getMarginTop() + getHeaderHeight(),
      overflowX: 'scroll',
      overflowY: 'hidden',
      scrollbarWidth: 'none',
    }}>
      {tabs}
    </div>,
  );

  if (view === 'team') {
    rightButtons.push(<TeamAdditionalOptions key = {'team-additional'} />);

    leftButtons.push(
      <Tooltip onClickRemove key = {'table-button'} text = {subview === 'table' ? 'View compare mode' : 'View table mode'}>
        <IconButton
          value = 'table-card-button'
          onClick = {(e) => handleSubView(e, subview === 'table' ? null : 'table')}
          icon = {<CalendarViewMonthIcon color = {subview === 'table' ? 'success' : 'primary'} />}
        />
      </Tooltip>,
    );
  } else if (view === 'player') {
    if (Organization.getCFBID() !== organization_id) {
      rightButtons.push(<PlayerAdditionalOptions key = {'player-additional'} />);

      leftButtons.push(
        <Tooltip onClickRemove key = {'top-player-button'} text = {topPlayersOnly ? 'Show all players' : 'View top MPG players'}>
          <IconButton
            value = 'top-players-button'
            onClick = {() => { dispatch(setDataKey({ key: 'topPlayersOnly', value: !topPlayersOnly })); }}
            icon = {<SensorOccupiedIcon color = {topPlayersOnly ? 'success' : 'primary'} />}
          />
        </Tooltip>,
      );
    }
  }

  if (!home_team_id || !away_team_id) {
    return null;
  }

  return (
    <>
      <div style = {headerStyle}>
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
      {
      subTabOrder.length ?
        <div style = {subHeaderStyle}>
          {subTabs}
        </div>
        : ''
      }
    </>
  );
};

export default NavBar;
