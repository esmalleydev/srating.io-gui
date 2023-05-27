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


import Schedule from '../../../components/generic/CBB/Team/Schedule';
import Stats from '../../../components/generic/CBB/Team/Stats';
import Trends from '../../../components/generic/CBB/Team/Trends';
import Roster from '../../../components/generic/CBB/Team/Roster';

import Api from '../../../components/Api.jsx';
const api = new Api();

// TODO need a season selector, stored in the url so the backend can retrieve
// THen pass in the season to all the components



const Team = (props) => {
  const self = this;
  const router = useRouter();
  const team_id = router.query && router.query.team_id;
  const season = router.query && router.query.season || new HelperCBB().getCurrentSeason();

  const team = props.team;

  // console.log(team);

  const theme = useTheme();
  const { height, width } = useWindowDimensions();


  const [tabIndex, setTabIndex] = useState(0);


  let marginTop = 64;

  if (width < 600) {
    marginTop = 56;
  }


  let tabOptions = {
    'schedule': 'Schedule',
    'stats': 'Stats',
    'trends': 'Trends',
    'roster': 'Roster',
  };

  let tabOrder = ['schedule', 'stats', 'trends', 'roster'];

  let tabs = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {tabOptions[tabOrder[i]]} />);
  }

  const selectedTab = tabOrder[tabIndex];

  const team_ = new HelperTeam({'team': team});


  const handleTabClick = (value) => {
    setTabIndex(value);

    if (value > 0 && props.scrollRef && props.scrollRef.current) {
      props.scrollRef.current.scrollTo(0, 0);
    }
  };

  const titleStyle = {
    'padding': '20px',
    'height': '96px',
    'textAlign': 'center',
    'position': 'sticky',
    'top': marginTop,
    'backgroundColor': theme.palette.background.default,
    'zIndex': 9000,
  };


  return (
    <div>
      <Head>
        <title>sRating | {team_.getName()}</title>
        <meta name = 'description' content = {team_.getName() + ' schedule, trends, statistics, roster'} key = 'desc'/>
        <meta property="og:title" content = {team_.getName() + ' schedule, trends, statistics, roster'} />
        <meta property="og:description" content = {team_.getName() + ' schedule, trends, statistics, roster'} />
        <meta name="twitter:card" content="summary" />
        <meta name = 'twitter:title' content = {team_.getName() + ' schedule, trends, statistics, roster'} />
      </Head>
      <div style = {titleStyle}>
        <Typography style = {{'whiteSpace': 'nowrap', 'textOverflow': 'ellipsis', 'overflow': 'hidden'}} variant = {width < 600 ? 'h4' : 'h3'}>
          {team_.getRank() ? <sup style = {{'fontSize': '24px'}}>{team_.getRank()}</sup> : ''} {team_.getName()} ({team.stats.wins}-{team.stats.losses})
        </Typography>
      </div>
      <AppBar position="sticky" style = {{'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light, 'top': marginTop + 96}}>
        <Tabs /*todo if width less than x variant="scrollable" scrollButtons="auto"*/ value={tabIndex} onChange={(e, value) => {handleTabClick(value)}} centered indicatorColor="secondary" textColor="inherit">
          {tabs}
        </Tabs>
      </AppBar>
      <div style = {{'padding': '20px'}}>
        {selectedTab == 'schedule' ? <Schedule team = {team} games = {team.cbb_games} /> : ''}
        {selectedTab == 'stats' ? <Stats team = {team} stats = {team.stats} /> : ''}
        {selectedTab == 'trends' ? <Trends team = {team} ranking = {team.cbb_ranking} elo = {team.cbb_elo} games = {team.cbb_games} /> : ''}
        {selectedTab == 'roster' ? <Roster team = {team} players = {team.players} season = {season} /> : ''}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const team_id = context.query && context.query.team_id;
  const season = context.query && context.query.season;

  const seconds = 60 * 5; // cache for 5 mins
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage='+seconds+', stale-while-revalidate=59'
  );

  let team = null;

  if (team_id) {
    team = await api.Request({
      'class': 'team',
      'function': 'getCBBTeam',
      'arguments': {
        'team_id': team_id,
        'season': season,
      }
    });
  }

  return {
    'props': {
      'team': team,
    },
  }
}

export default Team;