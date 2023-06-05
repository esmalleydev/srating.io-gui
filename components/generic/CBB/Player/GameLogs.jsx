import React, { useState } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';

import GameLog from './GameLog';


const GameLogs = (props) => {
  const self = this;

  const season = props.season;
  const player = props.player;
  const player_team_seasons = props.player_team_season;
  const teams = props.team;


  let tabOptions = {};

  for (let player_team_season_id in player_team_seasons) {
    let player_team_season = player_team_seasons[player_team_season_id];
    tabOptions[player_team_season.season] = player_team_season_id;
  }

  let tabOrder = Object.keys(tabOptions).sort().reverse();

  let defaultIndex = 0;

  let tabs = [];
  for (let i = 0; i < tabOrder.length; i++) {
    if (season && +tabOrder[i] === +season) {
      defaultIndex = i;
    }

    tabs.push(<Tab key = {tabOrder[i]} label = {(<span style = {{'fontSize': '12px'}}>{tabOrder[i]}</span>)} />);
  }



  const [tabIndex, setTabIndex] = useState(defaultIndex);
  const [selectedSeason, setSelectedSeason] = useState(season || tabOrder[tabIndex]);


  const selectedTab = tabOrder[tabIndex];

  const handleTabClick = (e, value) => {
    setTabIndex(value);
    setSelectedSeason(tabOrder[value])
  }


  return (
    <div>
      <Box display="flex" justifyContent="center" /*sx = {{'position': 'sticky', 'top': 100}}*/>
        <Tabs variant="scrollable" scrollButtons="auto" value={tabIndex} onChange={handleTabClick} indicatorColor="secondary" textColor="inherit">
          {tabs}
        </Tabs>
      </Box>
      <div>
        <GameLog key = {tabOptions[selectedSeason]} player = {player} season = {selectedSeason} player_team_season = {player_team_seasons[tabOptions[selectedSeason]]} team = {teams[player_team_seasons[tabOptions[selectedSeason]].team_id]} />
      </div>
    </div>
  );
}

export default GameLogs;
