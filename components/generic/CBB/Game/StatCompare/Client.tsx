'use client';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Chip } from '@mui/material';
import RankChart from '@/components/generic/CBB/Game/Trends/RankChart';



const Client = ({cbb_game, rankings}) => {

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

  let statsCompareChips: React.JSX.Element[] = [];

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
    <div style = {{'padding': '0px 10px'}}>
      <Typography style = {{'margin': '10px 0px'}} variant = 'body1'>Rank compare</Typography>
      {statsCompareChips}
      {<RankChart cbb_game = {cbb_game} compareKey = {selectedStatChip} rankings = {rankings} />}
    </div>
  );
}

export default Client;
