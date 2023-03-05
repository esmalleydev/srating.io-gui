import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';

const Stats = (props) => {
  const self = this;

  const [requestedStats, setRequestedStats] = useState(false);
  const [statsData, setStatsData] = useState(null);

  const date = props.date || null;

  if (!requestedStats && date) {
    setRequestedStats(true);
    api.Request({
      'class': 'cbb_game_odds',
      'function': 'getStatsData',
      'arguments': {
        'date': date,
      },
    }).then((response) => {
      setStatsData(response || {});
    }).catch((e) => {
      setStatsData({});
    });
  }


  return (
    <div>
      {
      statsData === null ?
        <Paper elevation = {3} style = {{'padding': 10}}>
          <div>
            <Typography variant = 'h5'><Skeleton /></Typography>
            <Typography variant = 'h5'><Skeleton /></Typography>
            <Typography variant = 'h5'><Skeleton /></Typography>
            <Typography variant = 'h5'><Skeleton /></Typography>
            <Typography variant = 'h5'><Skeleton /></Typography>
          </div>
        </Paper>
        : ''
      }
    </div>
  );
}

export default Stats;