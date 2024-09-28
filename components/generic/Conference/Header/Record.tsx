'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import { Skeleton, Typography } from '@mui/material';


const Record = () => {
  const statistic_rankings = useAppSelector((state) => state.conferenceReducer.statistic_rankings);

  let totalWins = 0;
  let totalLosses = 0;

  for (const statistic_ranking_id in statistic_rankings) {
    const row = statistic_rankings[statistic_ranking_id];

    totalLosses += row.losses || 0;
    totalWins += row.wins || 0;
  }

  return (
    <Typography variant = 'overline' color = 'text.secondary'>
      {
        false ?
          <Skeleton style={{
            marginLeft: '5px', width: 50, height: 25, display: 'inline-block',
          }} />
          :
          ` (${totalWins}-${totalLosses})`
      }
    </Typography>
  );
};

export default Record;
