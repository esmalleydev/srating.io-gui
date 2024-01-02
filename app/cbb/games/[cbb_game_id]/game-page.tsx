'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';


import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from "@mui/material/Box";

import HelperCBB from '@/components/helpers/CBB';

import ScoreTitle from '@/components/generic/CBB/Game/ScoreTitle.jsx';
import GameDetails from '@/components/generic/CBB/Game/GameDetails.jsx';
import Trends from '@/components/generic/CBB/Game/Trends.jsx';
import Matchup from '@/components/generic/CBB/Game/Matchup.jsx';
import { useScrollContext } from '@/contexts/scrollContext';


let intervalRefresher: NodeJS.Timeout;

const Game = (props) => {
  const self = this;
  
  const game = props.cbb_game;

  const router = useRouter();
  const theme = useTheme();
  const { width } = useWindowDimensions() as Dimensions;

  const scrollRef  = useScrollContext();

  const [tabIndex, setTabIndex] = useState(0);

  // https://nextjs.org/docs/app/building-your-application/caching#router-cache
  // nextjs is turning into garbage with thier forced router caching...
  // basically, the router caches a page anywhere from 30 seconds to 5 mins
  // there is no way to clear this besides a router.refresh()...
  // so keep this in session storage, so I can refresh on landing

  const sessionDataKey = 'CBB.GAME.DATA.' + game.cbb_game_id + '.stored';

  // this wil get cleared when clicking scores again, but if I arrived here from a back button we want to preserve the state
  const sessionDataString = typeof window !== 'undefined' ? sessionStorage.getItem(sessionDataKey) : null;
  let sessionData = sessionDataString ? JSON.parse(sessionDataString) : null;


  // if stored session, refresh in 1 seconds, else normal 30 seconds
  const [refreshRate, setRefreshRate] = useState(sessionData ? 2 : 30);

  if (!sessionData) {
    sessionStorage.setItem(sessionDataKey, '1');
  }

  const CBB = new HelperCBB({
    'cbb_game': game,
  });


  useEffect(() => {
    if (game && game.status === 'live') {
      intervalRefresher = setInterval(function() {
        setRefreshRate(30);
        router.refresh();
      }, refreshRate * 1000);
    }
    return function clean_up() {
      clearInterval(intervalRefresher);
    };
  });


  let marginTop = '64px';

  if (width < 600) {
    marginTop = '56px';
  }


  let tabOptions = {
    'game_details': 'Game details',
    'trends': 'Trends',
    'matchup': 'Matchup',
  };

  let tabOrder = ['matchup', 'trends'];
  if (CBB.isInProgress() || CBB.isFinal()) {
    tabOrder = ['game_details', 'matchup', 'trends'];
  }


  let tabs: React.JSX.Element[] = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {tabOptions[tabOrder[i]]} />);
  }

  const selectedTab = tabOrder[tabIndex];

  const handleTabClick = (e, value) => {
    setTabIndex(value);
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  };


  return (
    <div>
      <div style = {{'padding': '20px'}}><ScoreTitle key={game.cbb_game_id} game={game} /></div>
      <AppBar position="sticky" style = {{'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light, 'top': marginTop}}>
        <Box display="flex" justifyContent="center">
          <Tabs variant="scrollable" scrollButtons="auto" value={tabIndex} onChange={handleTabClick} indicatorColor="secondary" textColor="inherit">
            {tabs}
          </Tabs>
        </Box>
      </AppBar>
      {selectedTab == 'game_details' ? <GameDetails key = {game.cbb_game_id} game = {game} /> : ''}
      {selectedTab == 'matchup' ? <Matchup key = {game.cbb_game_id} game = {game} awayTeam={game.teams[game.away_team_id]} awayStats={game.stats[game.away_team_id]} homeTeam={game.teams[game.home_team_id]} homeStats={game.stats[game.home_team_id]} /> : ''}
      {selectedTab == 'trends' ? <Trends key = {game.cbb_game_id} game = {game} /> : ''}
    </div>
  );
}

export default Game;