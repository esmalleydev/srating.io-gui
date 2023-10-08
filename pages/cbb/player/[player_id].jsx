import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useWindowDimensions from '../../../components/hooks/useWindowDimensions';

import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

import moment from 'moment';


import HelperCBB from '../../../components/helpers/CBB';
import HelperTeam from '../../../components/helpers/Team';

import Stats from '../../../components/generic/CBB/Player/Stats';
import GameLogs from '../../../components/generic/CBB/Player/GameLogs';
import Trends from '../../../components/generic/CBB/Player/Trends';


import Api from '../../../components/Api.jsx';
import FavoritePicker from '../../../components/generic/FavoritePicker';
const api = new Api();


const Player = (props) => {
  const self = this;
  const router = useRouter();
  const player_id = router.query && router.query.player_id;
  const season = router.query && router.query.season || new HelperCBB().getCurrentSeason();

  const player = props.player;

  const name = player.first_name + ' ' + player.last_name;

  const theme = useTheme();
  const { height, width } = useWindowDimensions();


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

  let tabs = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {tabOptions[tabOrder[i]]} />);
  }

  const selectedTab = tabOrder[tabIndex];

  // const team_ = new HelperTeam({'team': team});


  const handleTabClick = (value) => {
    setTabIndex(value);

  //   if (value > 0 && props.scrollRef && props.scrollRef.current) {
  //     props.scrollRef.current.scrollTo(0, 0);
  //   }
  };

  const titleHeight = 112;

  const titleStyle = {
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
      <Head>
        <title>sRating | {name}</title>
        <meta name = 'description' content = {name + ' statistics'} key = 'desc'/>
        <meta property="og:title" content = {name + ' statistics'} />
        <meta property="og:description" content = {name + ' statistics'} />
        <meta name="twitter:card" content="summary" />
        <meta name = 'twitter:title' content = {name + ' statistics'} />
      </Head>
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

export async function getServerSideProps(context) {
  const player_id = context.query && context.query.player_id;

  const seconds = 60 * 5; // cache for 5 mins
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage='+seconds+', stale-while-revalidate=59'
  );

  let player = null;

  if (player_id) {
    player = await api.Request({
      'class': 'player',
      'function': 'getCBBPlayer',
      'arguments': {
        'player_id': player_id,
      }
    });
  }

  return {
    'props': {
      'player': player,
    },
  }
}

export default Player;