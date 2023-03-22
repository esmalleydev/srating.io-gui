import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';

import HelperCBB from '../../../helpers/CBB';

import Charts from './Charts';
import Boxscore from './Boxscore';
import Playbyplay from './Playbyplay';


const GameDetails = (props) => {
  const self = this;

  const theme = useTheme();
 
  const [tabIndex, setTabIndex] = useState(0);

  const game = props.game;

  const CBB = new HelperCBB({
    'cbb_game': game,
  });


  let tabOptions = {
    'charts': 'Charts',
    'boxscore': 'Boxscore',
    'pbp': 'Play by play',
  };

  let tabOrder = ['boxscore', 'charts', 'pbp'];
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
      <div>
        {selectedTab == 'charts' ? <Charts game = {game} /> : ''}
        {selectedTab == 'boxscore' ? <Boxscore game = {game} /> : ''}
        {selectedTab == 'pbp' ? <Playbyplay game = {game} /> : ''}
      </div>
    </div>
  );
}

export default GameDetails;