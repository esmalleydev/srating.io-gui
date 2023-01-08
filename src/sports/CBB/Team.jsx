import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import useWindowDimensions from '../../hooks/useWindowDimensions';

import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

import moment from 'moment';


import HelperCBB from '../../helpers/CBB';
import HelperTeam from '../../helpers/Team';


import Schedule from './Team/Schedule';
import Stats from './Team/Stats';
import Trends from './Team/Trends';

import Api from './../../Api.jsx';
const api = new Api();



const Team = (props) => {
  const self = this;
  let params = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { height, width } = useWindowDimensions();

  let sessionData = sessionStorage.getItem('CBB.TEAM.DATA') ? JSON.parse(sessionStorage.getItem('CBB.TEAM.DATA')) : {};

  if (
    (
      sessionData.expire_session &&
      sessionData.expire_session < new Date().getTime()
    ) ||
    (
      sessionData &&
      sessionData.team &&
      sessionData.team.team_id != params.team_id
    )
  ) {
    sessionData = {};
  }


  const [request, setRequest] = useState(sessionData.request || false);
  const [spin, setSpin] = useState(('spin' in sessionData) ? sessionData.spin : true);
  const [team, setTeam] = useState(sessionData.team || {});
  const [tabIndex, setTabIndex] = useState(0);


  useEffect(() => {
    sessionStorage.setItem('CBB.TEAM.DATA', JSON.stringify({
      'request': request,
      'team': team,
      'spin': false,
      'expire_session': new Date().getTime() + (6 * 60 * 1000), // 6 mins from now
    }));
  });


  if (!request) {
    setRequest(true);
    api.Request({
      'class': 'team',
      'function': 'getCBBTeam',
      'arguments': {
        'team_id': params.team_id,
      }
    }).then(team => {
      setTeam(team);
      setSpin(false);
    }).catch((err) => {
      console.log(err);
    });
  }


  let marginTop = 64;

  if (width < 600) {
    marginTop = 56;
  }


  let tabOptions = {
    'schedule': 'Schedule',
    'stats': 'Stats',
    'trends': 'Trends',
  };

  let tabOrder = ['schedule', 'stats', 'trends'];

  let tabs = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {tabOptions[tabOrder[i]]} />);
  }

  const selectedTab = tabOrder[tabIndex];

  const team_ = new HelperTeam({'team': team});

  if (spin) {
    return <div style = {{'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center'}}><CircularProgress /></div>;
  }

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
  };


  return (
    <div>
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
      </div>
    </div>
  );
}

export default Team;