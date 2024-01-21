'use client';
import React, { useState, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TeamStats from '@/components/generic/CBB/Team/TeamStats';
import Roster from '@/components/generic/CBB/Team/Roster';


const Stats = ({season, team_id}) => {
  const self = this;
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const scrollRef = useRef(null);

  let subView = searchParams?.get('subview') || 'team';
  let tabOrder = ['team', 'player'];

  const [tabIndex, setTabIndex] = useState(tabOrder.indexOf(subView) > -1 ? tabOrder.indexOf(subView) : 0);

  let tabOptions = {
    'team': 'Team',
    'player': 'Players'
  };

  let tabs: React.JSX.Element[] = [];


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
      {selectedTab == 'team' ? <TeamStats season = {season} team_id = {team_id} /> : ''}
      {selectedTab == 'player' ? <Roster season = {season} team_id = {team_id} /> : ''}
    </div>
  );
}

export default Stats;