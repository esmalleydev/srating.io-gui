'use client';
import React, { useState, useTransition } from 'react';
import { IconButton, Tab, Tabs, Tooltip, useTheme } from '@mui/material';
import { getHeaderHeight, getMarginTop } from './Header/ClientWrapper';
import { getNavHeaderHeight } from './NavBar';
import ViewPicker from './ViewPicker';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import { setShowScheduleDifferentials } from '@/redux/features/team-slice';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const getSubNavHeaderHeight = () => {
  return 48;
};


export { getSubNavHeaderHeight };

const SubNavBar = ({ view }) => {
  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  
  const dispatch = useAppDispatch();
  const scheduleView = useAppSelector(state => state.teamReducer.scheduleView);
  const showScheduleDifferentials = useAppSelector(state => state.teamReducer.showScheduleDifferentials);
  
  const [spin, setSpin] = useState(false);

  let subView = searchParams?.get('subview') || 'team';

  let tabOrder: string[] = [];
  let tabOptions = {};
  
  if (view === 'stats') {
    tabOrder = ['team', 'player'];
    tabOptions = {
      'team': 'Team',
      'player': 'Players'
    };
  }

  const [tabIndex, setTabIndex] = useState(tabOrder.indexOf(subView) > -1 ? tabOrder.indexOf(subView) : 0);


  const subHeaderHeight = getSubNavHeaderHeight();

  let minSubBarWidth = 75;

  const subHeaderStyle: React.CSSProperties = {
    'height': subHeaderHeight,
    'position': 'fixed',
    'backgroundColor': theme.palette.background.default,
    'zIndex': 1100,
    'display': 'flex',
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'top': getHeaderHeight() + getMarginTop() + getNavHeaderHeight(),
    'left': 0,
    'right': 0,
    'padding': '0px 20px',
  };

  const leftButtons: React.JSX.Element[] = [];
  const middleButtons: React.JSX.Element[] = [];
  const rightButtons: React.JSX.Element[] = [];

  if (view === 'schedule') {
    if (scheduleView === 'default') {
      leftButtons.push(
        <Tooltip key = {'toggle-all-historical-charts-tooltip'} title = {'Toggle all historical charts'}>
          <IconButton
            id = 'differential-button'
            onClick = {() => dispatch(setShowScheduleDifferentials(!showScheduleDifferentials))}
          >
            <LegendToggleIcon color = {showScheduleDifferentials ? 'success' : 'primary'} />
          </IconButton>
        </Tooltip>
      );
    }
    rightButtons.push(<ViewPicker key = {'view-picker'} view = {view} />);
  } else if (view === 'stats') {
    let tabs: React.JSX.Element[] = [];
    
    const handleTabClick = (value) => {
      setTabIndex(value);
      
      subView = tabOrder[value];
      
      if (searchParams) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('subview', subView);
        const search = current.toString();
        const query = search ? `?${search}` : "";
      
        setSpin(true);
        startTransition(() => {
          router.replace(`${pathName}${query}`);
          setSpin(false);
        });
      }
      
      // router.replace({
      //   query: {...router.query, view: view},
      // });
        
      // todo scroll stuff?
      // if (value > 0 && props.scrollRef && props.scrollRef.current) {
      //   props.scrollRef.current.scrollTo(0, 0);
      // }
    };
  
  
    for (let i = 0; i < tabOrder.length; i++) {
      tabs.push(<Tab key = {tabOrder[i]} label = {(<span style = {{'fontSize': '12px'}}>{tabOptions[tabOrder[i]]}</span>)} />);
    }


    middleButtons.push(
      <Tabs key = {'tabs'} variant="scrollable" scrollButtons="auto" value={tabIndex} onChange={(e, value) => {handleTabClick(value)}} indicatorColor="secondary" textColor="inherit">
        {tabs}
      </Tabs>
    );
  }

  if (view === 'trends') {
    return null;
  }


  return (
    <div style = {subHeaderStyle}>
      <div style = {{'minWidth': minSubBarWidth, 'display': 'flex'}}>
        {leftButtons}
      </div>

      <div style = {{'minWidth': minSubBarWidth, 'display': 'flex'}}>
        {middleButtons}
      </div>

      <div style = {{'minWidth': minSubBarWidth, 'display': 'flex'}}>
        {rightButtons}
      </div>
    </div>
  );
};

export default SubNavBar;