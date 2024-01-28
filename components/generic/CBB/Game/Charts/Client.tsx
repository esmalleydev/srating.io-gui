'use client';
import React, { useState } from 'react';


import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import Score from '@/components/generic/CBB/Game/Charts/Score';
import OddsML from '@/components/generic/CBB/Game/Charts/OddsML';
import OddsSpread from '@/components/generic/CBB/Game/Charts/OddsSpread';
import OddsOverUnder from '@/components/generic/CBB/Game/Charts/OddsOverUnder';


const Client = ({ cbb_game, cbb_game_score_intervals, /*tag*/}) => {
  const [selectedIntervalChip, setSelectedIntervalChip] = useState('scoring');


  const intervalCompare = [
    {
      'label': 'Scoring',
      'value': 'scoring',
    },
    {
      'label': 'Live ML',
      'value': 'liveML',
    },
    {
      'label': 'Live Spread',
      'value': 'liveSpread',
    },
    {
      'label': 'Live O/U',
      'value': 'liveOverUnder',
    },
  ];

  let intervalCompareChips: React.JSX.Element[] = [];

  for (let i = 0; i < intervalCompare.length; i++) {
    intervalCompareChips.push(
      <Chip
        key = {intervalCompare[i].value}
        sx = {{'margin': '5px 5px 10px 5px'}}
        variant = {selectedIntervalChip === intervalCompare[i].value ? 'filled' : 'outlined'}
        color = {selectedIntervalChip === intervalCompare[i].value ? 'success' : 'primary'}
        onClick = {() => {setSelectedIntervalChip(intervalCompare[i].value);}}
        label = {intervalCompare[i].label} 
      />
    );
  }

  let intervalChart: React.JSX.Element | null = null;

  if (selectedIntervalChip === 'scoring') {
    intervalChart = <Score cbb_game = {cbb_game} cbb_game_score_intervals = {cbb_game_score_intervals} />;
  } else if (selectedIntervalChip === 'liveML') {
    intervalChart = <OddsML cbb_game = {cbb_game} cbb_game_score_intervals = {cbb_game_score_intervals} />;
  } else if (selectedIntervalChip === 'liveSpread') {
    intervalChart = <OddsSpread cbb_game = {cbb_game} cbb_game_score_intervals = {cbb_game_score_intervals} />;
  } else if (selectedIntervalChip === 'liveOverUnder') {
    intervalChart = <OddsOverUnder cbb_game_score_intervals = {cbb_game_score_intervals} />;
  }


  return (
    <div style = {{'padding': 20}}>
      <Typography variant = 'body1'>Intervals</Typography>
      {intervalCompareChips}
      {intervalChart}
    </div>
  );
}

export default Client;
