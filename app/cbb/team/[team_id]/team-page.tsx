'use client';
import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import useWindowDimensions from '../../../../components/hooks/useWindowDimensions';

import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';


import HelperCBB from '../../../../components/helpers/CBB';
import HelperTeam from '../../../../components/helpers/Team';


import Schedule from '../../../../components/generic/CBB/Team/Schedule';
import Stats from '../../../../components/generic/CBB/Team/Stats';
import Trends from '../../../../components/generic/CBB/Team/Trends';
import SeasonPicker from '../../../../components/generic/CBB/SeasonPicker';
import BackdropLoader from '../../../../components/generic/BackdropLoader';
import FavoritePicker from '../../../../components/generic/FavoritePicker';


const Team = (props) => {
  const self = this;

  interface Dimensions {
    width: number;
    height: number;
  };

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();

  const team = props.team;
  const team_id = team.team_id;

  const [season, setSeason] = useState(searchParams?.get('season') || new HelperCBB().getCurrentSeason());
  const [spin, setSpin] = useState(false);
  let view = searchParams?.get('view') || 'schedule';

  const { width } = useWindowDimensions() as Dimensions;

  let tabOptions = {
    'schedule': 'Schedule',
    'stats': 'Stats / Roster',
    'trends': 'Trends',
  };

  const tabOrder = ['schedule', 'stats', 'trends'];

  const [tabIndex, setTabIndex] = useState(tabOrder.indexOf(view) > -1 ? tabOrder.indexOf(view) : 0);

  let marginTop = 64;

  if (width < 600) {
    marginTop = 56;
  }

  let tabs: React.JSX.Element[] = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {tabOptions[tabOrder[i]]} />);
  }

  const selectedTab = tabOrder[tabIndex];


  const team_ = new HelperTeam({'team': team});

  const handleSeason = (season) => {
    if (searchParams) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('season', season);
      const search = current.toString();
      const query = search ? `?${search}` : "";
      setSpin(true);
      startTransition(() => {
        router.push(`${pathName}${query}`);
        setSpin(false);
      });
    }

    setSeason(season);
  }


  const handleTabClick = (value) => {
    setTabIndex(value);

    view = tabOrder[value];

    if (searchParams) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('view', view);
      const search = current.toString();
      const query = search ? `?${search}` : "";

      // https://github.com/vercel/next.js/pull/58335

      // this is dumb but w/e...
      setTimeout(function() {
        router.replace(`${pathName}${query}`);
      }, 0);
    }

    // router.replace({
    //   query: {...router.query, view: view},
    // });

    if (value > 0 && props.scrollRef && props.scrollRef.current) {
      props.scrollRef.current.scrollTo(0, 0);
    }
  };

  const headerHeight = 100;

  const titleStyle: React.CSSProperties = {
    'padding': '20px',
    'height': headerHeight,
    'textAlign': 'center',
    'position': 'sticky',
    'top': marginTop,
    'backgroundColor': theme.palette.background.default,
    'zIndex': 1100,
  };


  return (
    <div>
      <div style = {titleStyle}>
        <div style = {{'display': 'flex', 'justifyContent': 'center'}}>
          <Typography style = {{'whiteSpace': 'nowrap', 'textOverflow': 'ellipsis', 'overflow': 'hidden'}} variant = {width < 600 ? 'h5' : 'h4'}>
            {team_.getRank() ? <span style = {{'fontSize': '20px', 'verticalAlign': 'super'}}>{team_.getRank()}</span> : ''} {team_.getName()} <span style = {{'fontSize': '16px', 'verticalAlign': 'middle'}}>({team.stats.wins || 0}-{team.stats.losses || 0})</span>
          </Typography>
          <FavoritePicker team_id = {team_id} />
        </div>
        <SeasonPicker selected = {season} actionHandler = {handleSeason} />
      </div>
      <AppBar position="sticky" style = {{'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light, 'top': marginTop + headerHeight, 'position': 'fixed'}}>
        <Tabs /*todo if width less than x variant="scrollable" scrollButtons="auto"*/ value={tabIndex} onChange={(e, value) => {handleTabClick(value)}} centered indicatorColor="secondary" textColor="inherit">
          {tabs}
        </Tabs>
      </AppBar>
      {selectedTab == 'schedule' ? <Schedule key = {team_id} team_id = {team_id} season = {season} team = {team} /> : ''}
      {selectedTab == 'stats' ? <Stats key = {team_id} team_id = {team_id} season = {season} team = {team} stats = {team.stats} /> : ''}
      {selectedTab == 'trends' ? <Trends key = {team_id} team_id = {team_id} season = {season} team = {team} /* ranking = {team.cbb_ranking} elo = {team.cbb_elo} games = {team.cbb_games} */ /> : ''}
      <BackdropLoader open = {(spin === true)} />
    </div>
  );
}


export default Team;