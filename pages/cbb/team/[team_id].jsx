import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useWindowDimensions from '../../../components/hooks/useWindowDimensions';

import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';


import HelperCBB from '../../../components/helpers/CBB';
import HelperTeam from '../../../components/helpers/Team';


import Schedule from '../../../components/generic/CBB/Team/Schedule';
import Stats from '../../../components/generic/CBB/Team/Stats';
import Trends from '../../../components/generic/CBB/Team/Trends';
import SeasonPicker from '../../../components/generic/CBB/SeasonPicker';
import BackdropLoader from '../../../components/generic/BackdropLoader';

import Api from '../../../components/Api.jsx';
import FavoritePicker from '../../../components/generic/FavoritePicker';
const api = new Api();


const Team = (props) => {
  const self = this;
  const router = useRouter();
  const theme = useTheme();

  const team = props.team;

  const team_id = router.query && router.query.team_id;

  const [season, setSeason] = useState((router.query && router.query.season) || new HelperCBB().getCurrentSeason());
  const [spin, setSpin] = useState(false);
  let view = router.query && router.query.view || 'schedule';

  const { height, width } = useWindowDimensions();

  let tabOptions = {
    'schedule': 'Schedule',
    'stats': 'Stats / Roster',
    'trends': 'Trends',
  };

  const tabOrder = ['schedule', 'stats', 'trends'];

  const [tabIndex, setTabIndex] = useState(tabOrder.indexOf(view) > -1 ? tabOrder.indexOf(view) : 0);

  let marginTop = 64;

  if (width < 600) {
    marginTop = 56;
  }

  let tabs = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {tabOptions[tabOrder[i]]} />);
  }

  const selectedTab = tabOrder[tabIndex];


  const team_ = new HelperTeam({'team': team});

  const handleSeason = (season) => {
    setSpin(true);
    router.query.season = season;

    router.push(router).then(() => {
      setSpin(false);
    });

    setSeason(season);
  }


  const handleTabClick = (value) => {
    setTabIndex(value);

    view = tabOrder[value];

    router.replace({
      query: {...router.query, view: view},
    });

    if (value > 0 && props.scrollRef && props.scrollRef.current) {
      props.scrollRef.current.scrollTo(0, 0);
    }
  };

  const headerHeight = 100;

  const titleStyle = {
    'padding': '20px',
    'height': headerHeight,
    'textAlign': 'center',
    'position': 'sticky',
    'top': marginTop,
    'backgroundColor': theme.palette.background.default,
    'zIndex': 1100,
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
        <div style = {{'display': 'flex', 'justifyContent': 'center'}}>
          <Typography style = {{'whiteSpace': 'nowrap', 'textOverflow': 'ellipsis', 'overflow': 'hidden'}} variant = {width < 600 ? 'h5' : 'h4'}>
            {team_.getRank() ? <span style = {{'fontSize': '20px', 'verticalAlign': 'super'}}>{team_.getRank()}</span> : ''} {team_.getName()} <span style = {{'fontSize': '16px', 'verticalAlign': 'middle'}}>({team.stats.wins || 0}-{team.stats.losses || 0})</span>
          </Typography>
          <FavoritePicker team_id = {team_id} />
        </div>
        <SeasonPicker selected = {season} actionHandler = {handleSeason} />
      </div>
      <AppBar position="sticky" style = {{'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light, 'top': marginTop + headerHeight, 'position': 'fixed'}}>
        <Tabs /*todo if width less than x variant="scrollable" scrollButtons="auto"*/ value={tabIndex} onChange={(e, value) => {handleTabClick(value)}} centered indicatorColor="secondary" textColor="inherit">
          {tabs}
        </Tabs>
      </AppBar>
      {selectedTab == 'schedule' ? <Schedule key = {team_id} team_id = {team_id} season = {season} team = {team} /> : ''}
      {selectedTab == 'stats' ? <Stats key = {team_id} team_id = {team_id} season = {season} team = {team} stats = {team.stats} /> : ''}
      {selectedTab == 'trends' ? <Trends key = {team_id} team_id = {team_id} season = {season} team = {team} /* ranking = {team.cbb_ranking} elo = {team.cbb_elo} games = {team.cbb_games} */ /> : ''}
      <BackdropLoader open = {(spin === true)} />
    </div>
  );
}


export async function getServerSideProps(context) {
  const CBB = new HelperCBB();

  const team_id = context.query && context.query.team_id;
  const season =  (context.query && context.query.season) || CBB.getCurrentSeason();

  const seconds = 60 * 5; // cache for 5 mins
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage='+seconds+', stale-while-revalidate=59'
  );

  let team = null;

  if (team_id) {
    team = await api.Request({
      'class': 'team',
      'function': 'get',
      'arguments': {
        'team_id': team_id,
      }
    });

    const cbb_ranking = await api.Request({
      'class': 'cbb_ranking',
      'function': 'get',
      'arguments': {
        'team_id': team_id,
        'season': season,
        'current': '1'
      }
    });

    team.cbb_ranking = {};

    if (cbb_ranking && cbb_ranking.cbb_ranking_id) {
      team.cbb_ranking[cbb_ranking.cbb_ranking_id] = cbb_ranking;
    }

    team.stats = await api.Request({
      'class': 'team',
      'function': 'getStats',
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