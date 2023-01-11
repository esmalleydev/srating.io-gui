import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useWindowDimensions from '../../../hooks/useWindowDimensions';


import Typography from '@mui/material/Typography';

import CompareStatistic from '../../../component/CompareStatistic';
import HelperCBB from '../../../helpers/CBB';
  
const Betting = (props) => {
  const self = this;

  const { height, width } = useWindowDimensions();

  const game = props.game;

  // console.log(game);

  const awayStats = (game.stats && game.stats[game.away_team_id]) || {};
  const homeStats = (game.stats && game.stats[game.home_team_id]) || {};

  const offensiveCategoryPointsAway = 0;
  const offensiveCategoryPointsHome = 0;

  const theme = useTheme();

  const CBB = new HelperCBB({
    'cbb_game': game,
  });

  const overviewRows = [
    {
      'name': 'Win %',
      'away': (game.away_team_rating * 100).toFixed(2) + '%',
      'home': (game.home_team_rating * 100).toFixed(2) + '%',
      'awayCompareValue': game.away_team_rating,
      'homeCompareValue': game.home_team_rating,
      'favored': 'higher',
      'showDifference': false,
    },
    {
      'name': 'O Rating',
      'title': 'Offensive rating',
      'away': awayStats.offensive_rating,
      'home': homeStats.offensive_rating,
      'awayCompareValue': awayStats.offensive_rating,
      'homeCompareValue': homeStats.offensive_rating,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'D Rating',
      'title': 'Defensive rating',
      'away': awayStats.defensive_rating,
      'home': homeStats.defensive_rating,
      'awayCompareValue': awayStats.defensive_rating,
      'homeCompareValue': homeStats.defensive_rating,
      'favored': 'higher',
      'showDifference': true,
    },
  ];

  
  


  return (
    <div style = {{'padding': 20}}>
      <div style = {{'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '10px', 'flexWrap': 'nowrap'}}>
        <Typography style = {{'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'margin': '0px 5px'}}variant = 'h5'>{CBB.getTeamName('away')}</Typography>
        <Typography style = {{'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'margin': '0px 5px'}}variant = 'h5'>{CBB.getTeamName('home')}</Typography>
      </div>
      <CompareStatistic rows = {overviewRows} />
    </div>
  );
}

export default Betting;