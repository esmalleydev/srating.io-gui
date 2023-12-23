'use client';
import React, { useState, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
// import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TeamStats from './TeamStats';
import Roster from './Roster';


const Stats = (props) => {
  const self = this;
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const season = props.season;
  const team = props.team;
  const stats = props.stats;

  // const theme = useTheme();
  const scrollRef = useRef(null);

  let subView = router.query && router.query.subview || 'team';
  let tabOrder = ['team', 'player'];

  const [tabIndex, setTabIndex] = useState(tabOrder.indexOf(subView) > -1 ? tabOrder.indexOf(subView) : 0);

  let tabOptions = {
    'team': 'Team',
    'player': 'Players'
  };

  let tabs = [];


  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {(<span style = {{'fontSize': '12px'}}>{tabOptions[tabOrder[i]]}</span>)} />);
  }

  const selectedTab = tabOrder[tabIndex];

  const handleTabClick = (e, value) => {
    setTabIndex(value);

    subView = tabOrder[value];

    if (searchParams) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('subview', subView);
      const search = current.toString();
      const query = search ? `?${search}` : "";

      // https://github.com/vercel/next.js/pull/58335

      // this is dumb but w/e...
      setTimeout(function() {
        router.replace(`${pathName}${query}`);
      }, 0);
    }

    // router.replace({
    //   query: {...router.query, subview: subView},
    // });
  }

  return (
    <div style = {{'padding': '48px 20px 20px 20px'}} ref = {scrollRef}>
      <Box display="flex" justifyContent="center" /*sx = {{'position': 'sticky', 'top': 100}}*/>
        <Tabs variant="scrollable" scrollButtons="auto" value={tabIndex} onChange={handleTabClick} indicatorColor="secondary" textColor="inherit">
          {tabs}
        </Tabs>
      </Box>
      {selectedTab == 'team' ? <TeamStats season = {season} team = {team} stats = {stats} /> : ''}
      {selectedTab == 'player' ? <Roster season = {season} team = {team} /> : ''}
    </div>
  );
}

export default Stats;