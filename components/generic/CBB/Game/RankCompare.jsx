import React, { useState } from 'react';


import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import RankChart from './Charts/Rank';

const RankCompare = (props) => {
  const self = this;

  const game = props.game;

  const [selectedStatChip, setSelectedStatChip] = useState('elo_rank');

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

  return (
    <div>
      <Typography style = {{'margin': '10px 0px'}} variant = 'body1'>Rank compare</Typography>
      {statsCompareChips}
      {<RankChart game = {game} compareKey = {selectedStatChip} />}
    </div>
  );
}

export default RankCompare;
