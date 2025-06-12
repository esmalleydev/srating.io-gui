'use client';

import { useTransition } from 'react';
import {
  IconButton, Tooltip,
} from '@mui/material';
import { getHeaderHeight, getMarginTop } from './Header/ClientWrapper';
import { getNavHeaderHeight } from './NavBar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import HistoryIcon from '@mui/icons-material/History';
import { usePathname, useRouter } from 'next/navigation';
import { setLoading } from '@/redux/features/display-slice';
import { setDataKey } from '@/redux/features/team-slice';
import AdditionalOptions from './Contents/Schedule/AdditionalOptions';
import { useTheme } from '@/components/hooks/useTheme';
import Style from '@/components/utils/Style';
import Tab from '@/components/ux/buttons/Tab';

const getSubNavHeaderHeight = () => 42;

export { getSubNavHeaderHeight };

const SubNavBar = ({ view }) => {
  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const [isPending, startTransition] = useTransition();


  const dispatch = useAppDispatch();
  const scheduleView = useAppSelector((state) => state.teamReducer.scheduleView);
  const showScheduleDifferentials = useAppSelector((state) => state.teamReducer.showScheduleDifferentials);
  const showScheduleHistoricalRankRecord = useAppSelector((state) => state.teamReducer.showScheduleHistoricalRankRecord);
  const subview = useAppSelector((state) => state.teamReducer.subview) || (view === 'stats' ? 'team' : 'stats');


  let tabOrder: string[] = [];
  let tabOptions = {};

  if (view === 'stats') {
    tabOrder = ['team', 'player'];
    tabOptions = {
      team: 'Team',
      player: 'Players',
    };
  } else if (view === 'trends') {
    tabOrder = ['stats', 'ranking'];
    tabOptions = {
      ranking: 'Ranking',
      stats: 'Stats',
    };
  }


  const subHeaderHeight = getSubNavHeaderHeight();

  const minSubBarWidth = 75;

  const subHeaderStyle: React.CSSProperties = {
    height: subHeaderHeight,
    position: 'fixed',
    backgroundColor: theme.background.main,
    zIndex: Style.getStyle().zIndex.appBar,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: getHeaderHeight() + getMarginTop() + getNavHeaderHeight(),
    left: 0,
    right: 0,
    padding: '0px 20px',
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
            onClick = {() => dispatch(setDataKey({ key: 'showScheduleDifferentials', value: !showScheduleDifferentials }))}
          >
            <LegendToggleIcon color = {showScheduleDifferentials ? 'success' : 'primary'} />
          </IconButton>
        </Tooltip>,
      );

      leftButtons.push(
        <Tooltip key = {'toggle-all-historical-ranking-tooltip'} title = {showScheduleHistoricalRankRecord ? 'Show current record / rank' : 'Show historical record / rank at time of game'}>
          <IconButton
            id = 'historical-button'
            onClick = {() => dispatch(setDataKey({ key: 'showScheduleHistoricalRankRecord', value: !showScheduleHistoricalRankRecord }))}
          >
            <HistoryIcon color = {showScheduleHistoricalRankRecord ? 'success' : 'primary'} />
          </IconButton>
        </Tooltip>,
      );
    }

    rightButtons.push(<AdditionalOptions key = {'additional-options'} />);
  } else if (tabOrder.length) {
    const tabs: React.JSX.Element[] = [];

    const handleTabClick = (e, value) => {
      const newSubview = value;

      if (newSubview !== subview) {
        dispatch(setDataKey({ key: 'subview', value: newSubview }));
        dispatch(setDataKey({ key: 'loadingView', value: true }));

        const current = new URLSearchParams(window.location.search);
        current.set('subview', newSubview);

        window.history.replaceState(null, '', `?${current.toString()}`);

        // use pushState if we want to add to back button history
        // window.history.pushState(null, '', `?${current.toString()}`);

        const search = current.toString();
        const query = search ? `?${search}` : '';

        startTransition(() => {
          router.replace(`${pathName}${query}`);
        });
        // const current = new URLSearchParams(Array.from(searchParams.entries()));
        // current.set('subview', subView);
        // const search = current.toString();
        // const query = search ? `?${search}` : '';

        // dispatch(setLoading(true));
        // startTransition(() => {
        //   router.replace(`${pathName}${query}`);
        // });
      }
    };


    for (let i = 0; i < tabOrder.length; i++) {
      const selected = tabOrder[i] === subview;
      tabs.push(<Tab key = {tabOrder[i]} title = {tabOptions[tabOrder[i]]} value = {tabOrder[i]} selected = {selected} handleClick={handleTabClick}/>);
    }


    middleButtons.push(
      <div style = {{ width: '100%', display: 'flex', justifyContent: 'center', overflowX: 'scroll', overflowY: 'hidden', scrollbarWidth: 'none' }}>
        {tabs}
      </div>,
    );
  }

  return (
    <div style = {subHeaderStyle}>
      <div style = {{ minWidth: minSubBarWidth, display: 'flex' }}>
        {leftButtons}
      </div>

      <div style = {{ minWidth: minSubBarWidth, display: 'flex' }}>
        {middleButtons}
      </div>

      <div style = {{ minWidth: minSubBarWidth, display: 'flex', justifyContent: 'end' }}>
        {rightButtons}
      </div>
    </div>
  );
};

export default SubNavBar;
