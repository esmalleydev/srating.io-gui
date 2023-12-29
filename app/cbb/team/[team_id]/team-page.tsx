'use client';
import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


import HelperCBB from '@/components/helpers/CBB';
import Schedule from '@/components/generic/CBB/Team/Schedule';
import Stats from '@/components/generic/CBB/Team/Stats';
import Trends from '@/components/generic/CBB/Team/Trends';
import TeamTitle, { getMarginTop, getHeaderHeight } from '@/components/generic/CBB/Team/TeamTitle';


const Team = (props) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const theme = useTheme();

  const team = props.team;
  const team_id = team.team_id;

  const season = searchParams?.get('season') || new HelperCBB().getCurrentSeason();
  let view = searchParams?.get('view') || 'schedule';

  let tabOptions = {
    'schedule': 'Schedule',
    'stats': 'Stats / Roster',
    'trends': 'Trends',
  };

  const tabOrder = ['schedule', 'stats', 'trends'];

  const [tabIndex, setTabIndex] = useState(tabOrder.indexOf(view) > -1 ? tabOrder.indexOf(view) : 0);


  let tabs: React.JSX.Element[] = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {tabOptions[tabOrder[i]]} />);
  }

  const selectedTab = tabOrder[tabIndex];


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


  return (
    <div>
      <TeamTitle season = {season} team = {team} />
      <AppBar position="sticky" style = {{'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light, 'top': getMarginTop() + getHeaderHeight(), 'position': 'fixed'}}>
        <Tabs /*todo if width less than x variant="scrollable" scrollButtons="auto"*/ value={tabIndex} onChange={(e, value) => {handleTabClick(value)}} centered indicatorColor="secondary" textColor="inherit">
          {tabs}
        </Tabs>
      </AppBar>
      {selectedTab == 'schedule' ? <Schedule key = {team_id} team_id = {team_id} season = {season} team = {team} /> : ''}
      {selectedTab == 'stats' ? <Stats key = {team_id} team_id = {team_id} season = {season} team = {team} stats = {team.stats} /> : ''}
      {selectedTab == 'trends' ? <Trends key = {team_id} team_id = {team_id} season = {season} team = {team} /* ranking = {team.cbb_ranking} elo = {team.cbb_elo} games = {team.cbb_games} */ /> : ''}
    </div>
  );
}


export default Team;