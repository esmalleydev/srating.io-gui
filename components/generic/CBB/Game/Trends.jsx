import React, { useState } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';

import HelperCBB from '../../../helpers/CBB';


import StatCompare from './StatCompare';
import PreviousMatchups from './PreviousMatchups';
import OddsTrends from './OddsTrends';
import Momentum from './Momentum';

const Trends = (props) => {
  const self = this;

  const [tabIndex, setTabIndex] = useState(0);

  const game = props.game;

  const CBB = new HelperCBB({
    'cbb_game': game,
  });


  let tabOptions = {
    'stat_compare': 'Stat compare',
    'previous_matchups': 'Prev. Matchups',
    'odds': 'Odds',
    'momentum': 'Momentum',
  };

  let tabOrder = ['stat_compare', 'previous_matchups', 'odds', 'momentum'];
  let tabs = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {(<span style = {{'fontSize': '12px'}}>{tabOptions[tabOrder[i]]}</span>)} />);
  }

  const selectedTab = tabOrder[tabIndex];

  const handleTabClick = (e, value) => {
    setTabIndex(value);
  }


  return (
    <div>
      <Box display="flex" justifyContent="center" /*sx = {{'position': 'sticky', 'top': 100}}*/>
        <Tabs variant="scrollable" scrollButtons="auto" value={tabIndex} onChange={handleTabClick} indicatorColor="secondary" textColor="inherit">
          {tabs}
        </Tabs>
      </Box>
      <div style = {{'padding': 20}}>
        {selectedTab == 'stat_compare' ? <StatCompare game = {game} /> : ''}
        {selectedTab == 'previous_matchups' ? <PreviousMatchups game = {game} /> : ''}
        {selectedTab == 'odds' ? <OddsTrends game = {game} /> : ''}
        {selectedTab == 'momentum' ? <Momentum game = {game} /> : ''}
      </div>
    </div>
  );
}

export default Trends;
