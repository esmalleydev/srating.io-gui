'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import { Skeleton, Typography } from '@mui/material';


const Record = ({ game, team_id }) => {
  const scheduleStats = useAppSelector((state) => state.teamReducer.scheduleStats);
  const scheduleStatsLoading = useAppSelector((state) => state.teamReducer.scheduleStatsLoading);
  const showScheduleHistoricalRankRecord = useAppSelector((state) => state.teamReducer.showScheduleHistoricalRankRecord);

  const current = (scheduleStats[game.game_id] && scheduleStats[game.game_id].current[team_id]) || null;
  const historical = (scheduleStats[game.game_id] && scheduleStats[game.game_id].historical[team_id]) || null;
  const statistic_ranking = showScheduleHistoricalRankRecord ? historical : current;

  const wins = (statistic_ranking && statistic_ranking.wins) || 0;
  const losses = (statistic_ranking && statistic_ranking.losses) || 0;


  return (
    <Typography variant = 'overline' color = 'text.secondary'>
      {
        scheduleStatsLoading ?
          <Skeleton style={{
            marginLeft: '5px', width: 25, height: 30, display: 'inline-block',
          }} />
          :
          ` (${wins}-${losses})`
      }
    </Typography>
  );
};

export default Record;
