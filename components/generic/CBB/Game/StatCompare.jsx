import React, { useState } from 'react';


import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import RankChart from './Charts/Rank';

import Api from './../../../Api.jsx';
const api = new Api();

const StatCompare = (props) => {
  const self = this;

  const game = props.game;

  const [requestedStats, setRequestedStats] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [selectedStatChip, setSelectedStatChip] = useState('elo_rank');

   if (!requestedStats) {
    setRequestedStats(true);
    api.Request({
      'class': 'cbb_statistic_ranking',
      'function': 'read',
      'arguments': {
        'season': game.season,
        'team_id': [game.home_team_id, game.away_team_id],
      },
    }).then((response) => {
      setStatsData(response || {});
    }).catch((e) => {
      setStatsData({});
    });
  }

  const statsCompare = [
    {
      'label': 'Elo',
      'value': 'elo_rank',
    },
    {
      'label': 'KP',
      'value': 'kenpom_rank',
    },
    {
      'label': 'SRS',
      'value': 'srs_rank',
    },
    {
      'label': 'NET',
      'value': 'net_rank',
    },
  ];

  let statsCompareChips = [];

  for (let i = 0; i < statsCompare.length; i++) {
    statsCompareChips.push(
      <Chip
        key = {statsCompare[i].value}
        sx = {{'margin': '5px 5px 10px 5px'}}
        variant = {selectedStatChip === statsCompare[i].value ? 'filled' : 'outlined'}
        color = {selectedStatChip === statsCompare[i].value ? 'success' : 'primary'}
        onClick = {() => {setSelectedStatChip(statsCompare[i].value);}}
        label = {statsCompare[i].label}
      />
    );
  }


  // todo show popular stats in chips, then a show more button that goes to a stat selector screen

  return (
    <div>
      <Typography style = {{'margin': '10px 0px'}} variant = 'body1'>Rank compare</Typography>
      {statsCompareChips}
      {<RankChart game = {game} compareKey = {selectedStatChip} />}
    </div>
  );
}

export default StatCompare;
