'use client';
import React, { useState } from 'react';

import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';


import Stats from '@/components/generic/CBB/Player/Stats';
import GameLogs from '@/components/generic/CBB/Player/GameLogs';
import Trends from '@/components/generic/CBB/Player/Trends';
import FavoritePicker from '@/components/generic/FavoritePicker';


const Player = (props) => {
  console.log(props)
  const self = this;

  const theme = useTheme();
  const { width } = useWindowDimensions() as Dimensions;

  const player = props.player;

  const name = player.first_name + ' ' + player.last_name;

  const [tabIndex, setTabIndex] = useState(0);


  let marginTop = 64;

  if (width < 600) {
    marginTop = 56;
  }


  let tabOptions = {
    'stats': 'Stats',
    'gamelogs': 'Game Log',
    'trends': 'Trends',
  };

  let tabOrder = ['stats', 'gamelogs', 'trends'];

  let tabs: React.JSX.Element[] = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {tabOptions[tabOrder[i]]} />);
  }

  const selectedTab = tabOrder[tabIndex];


  const handleTabClick = (value) => {
    setTabIndex(value);
  };

  const titleHeight = 112;

  const titleStyle: React.CSSProperties = {
    'padding': '20px',
    'height': titleHeight,
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
          <Typography style = {{'whiteSpace': 'nowrap', 'textOverflow': 'ellipsis', 'overflow': 'hidden'}} variant = {width < 600 ? 'h4' : 'h3'}>
            {name}
          </Typography>
          <FavoritePicker player_id = {player.player_id} />
        </div>
        <Typography variant = 'h6'>
          #{player.number} {player.position} {player.height}
        </Typography>
      </div>
      <AppBar position="sticky" style = {{'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light, 'top': marginTop + titleHeight, 'position': 'fixed'}}>
        <Tabs /*todo if width less than x variant="scrollable" scrollButtons="auto"*/ value={tabIndex} onChange={(e, value) => {handleTabClick(value)}} centered indicatorColor="secondary" textColor="inherit">
          {tabs}
        </Tabs>
      </AppBar>
      <div style = {{'padding': '48px 20px 20px 20px'}}>
        {selectedTab == 'stats' ? <Stats key = {player.player_id} player = {player} player_team_season = {player.player_team_season} team = {player.team} /> : ''}
        {selectedTab == 'gamelogs' ? <GameLogs key = {player.player_id} player = {player} player_team_season = {player.player_team_season} team = {player.team} /> : ''}
        {selectedTab == 'trends' ? <Trends key = {player.player_id} /> : ''}
      </div>
    </div>
  );
}


export default Player;