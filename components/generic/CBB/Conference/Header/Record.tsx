'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import { Skeleton, Typography } from '@mui/material';


const Record = () => {
  const cbb_statistic_rankings = useAppSelector((state) => state.conferenceReducer.cbb_statistic_rankings);

  let totalWins = 0;
  let totalLosses = 0;

  for (const cbb_statistic_ranking_id in cbb_statistic_rankings) {
    const row = cbb_statistic_rankings[cbb_statistic_ranking_id];

    totalLosses += row.losses;
    totalWins += row.wins;
  }

  return (
    <Typography variant = 'overline' color = 'text.secondary'>
      {
        false ?
          <Skeleton style={{
            marginLeft: '5px', width: 50, height: 25, display: 'inline-block',
          }} />
          :
          ` (${totalLosses}-${totalWins})`
      }
    </Typography>
  );
};

export default Record;
