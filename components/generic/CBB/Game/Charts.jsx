import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';


import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import HelperCBB from '../../../helpers/CBB';
import Score from './Charts/Score';
import OddsML from './Charts/OddsML';
import OddsSpread from './Charts/OddsSpread';
import OddsOverUnder from './Charts/OddsOverUnder';

const GameDetails = (props) => {
  const self = this;

  const theme = useTheme();
  const [selectedIntervalChip, setSelectedIntervalChip] = useState('scoring');

  const game = props.game;



  const CBB = new HelperCBB({
    'cbb_game': game,
  });

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

  let intervalCompareChips = [];

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

  let intervalChart = null;

  if (selectedIntervalChip === 'scoring') {
    intervalChart = <Score game = {game} />;
  } else if (selectedIntervalChip === 'liveML') {
    intervalChart = <OddsML game = {game} />;
  } else if (selectedIntervalChip === 'liveSpread') {
    intervalChart = <OddsSpread game = {game} />;
  } else if (selectedIntervalChip === 'liveOverUnder') {
    intervalChart = <OddsOverUnder game = {game} />;
  }



  return (
    <div style = {{'padding': 20}}>
      <Typography variant = 'body1'>Intervals</Typography>
      {intervalCompareChips}
      {intervalChart}
    </div>
  );
}

export default GameDetails;