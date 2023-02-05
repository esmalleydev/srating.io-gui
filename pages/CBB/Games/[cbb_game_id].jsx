import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useWindowDimensions from '../../../components/hooks/useWindowDimensions';


import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from "@mui/material/Box";

import HelperCBB from '../../../components/helpers/CBB';
import Api from '../../../components/Api.jsx';

import ScoreTitle from '../../../components/generic/CBB/Game/ScoreTitle.jsx';
import Boxscore from '../../../components/generic/CBB/Game/Boxscore.jsx';
import Trends from '../../../components/generic/CBB/Game/Trends.jsx';
import Matchup from '../../../components/generic/CBB/Game/Matchup.jsx';
import Betting from '../../../components/generic/CBB/Game/Betting.jsx';

const api = new Api();

let intervalRefresher = null;

const Game = (props) => {
  const self = this;

  const router = useRouter();
  const cbb_game_id = router.query && router.query.cbb_game_id;

  const theme = useTheme();
  const { height, width } = useWindowDimensions();

  const [request, setRequest] = useState(false);
  const [games, setGames] = useState({});
  const [spin, setSpin] = useState(true);
  const [game, setGame] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const CBB = new HelperCBB({
    'cbb_game': game,
  });

  const getGame = () => {
    api.Request({
      'class': 'cbb_game',
      'function': 'getGamesFull',
      'arguments': {
        'cbb_game_id': cbb_game_id,
      }
    }).then(cbb_games => {
      setGames(cbb_games);
      setGame(cbb_games[cbb_game_id]);
      setRequest(true);
    }).catch((err) => {
      // console.log(err);
      setRequest(true);
    });
  };

  if (!request && cbb_game_id) {
    getGame();
  }

  useEffect(() => {
    if (game && game.status === 'live') {
      intervalRefresher = setInterval(function() {
        getGame()
      }, 30000);
    }
    return function clean_up() {
      clearInterval(intervalRefresher);
    };
  });

  if (!game) {
    return (<div style = {{'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center'}}><CircularProgress /></div>);
  }
  

  let marginTop = '64px';

  if (width < 600) {
    marginTop = '56px';
  }


  let tabOptions = {
    'boxscore': 'Boxscore',
    'trends': 'Trends',
    'matchup': 'Matchup',
    'betting': 'Momentum',
  };

  let tabOrder = ['matchup', 'trends', 'betting'];
  if (CBB.isInProgress() || CBB.isFinal()) {
    tabOrder = ['boxscore', 'matchup', 'trends', 'betting'];
  }


  let tabs = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {tabOptions[tabOrder[i]]} />);
  }

  const selectedTab = tabOrder[tabIndex];

  const handleTabClick = (e, value) => {
    setTabIndex(value);
    if (props.scrollRef && props.scrollRef.current) {
      props.scrollRef.current.scrollTo(0, 0);
    }
  };


  return (
    <div>
      <div style = {{'padding': '20px'}}><ScoreTitle key={cbb_game_id} game={game} /></div>
      <AppBar position="sticky" style = {{'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light, 'top': marginTop}}>
        <Box display="flex" justifyContent="center">
          <Tabs variant="scrollable" scrollButtons="auto" value={tabIndex} onChange={handleTabClick} indicatorColor="secondary" textColor="inherit">
            {tabs}
          </Tabs>
        </Box>
      </AppBar>
      {selectedTab == 'boxscore' ? <Boxscore game = {game} /> : ''}
      {selectedTab == 'trends' ? <Trends game = {game} /> : ''}
      {selectedTab == 'matchup' ? <Matchup game = {game} awayTeam={game.teams[game.away_team_id]} awayStats={game.stats[game.away_team_id]} homeTeam={game.teams[game.home_team_id]} homeStats={game.stats[game.home_team_id]} /> : ''}
      {selectedTab == 'betting' ? <Betting game = {game} /> : ''}
    </div>
  );
}

export default Game;