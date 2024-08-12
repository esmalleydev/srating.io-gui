'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import { Skeleton, Typography } from '@mui/material';


const Record = ({ cbb_game, team_id }) => {
  const gameStats = useAppSelector((state) => state.gamesReducer.gameStats);
  const gameStatsLoading = useAppSelector((state) => state.gamesReducer.gameStatsLoading);
  // const showScheduleHistoricalRankRecord = useAppSelector((state) => state.gamesReducer.showScheduleHistoricalRankRecord);

  const current = (gameStats[cbb_game.cbb_game_id] && gameStats[cbb_game.cbb_game_id].current[team_id]) || null;
  // const historical = (gameStats[cbb_game.cbb_game_id] && gameStats[cbb_game.cbb_game_id].historical[team_id]) || null;
  const statistic_ranking = current;

  const wins = (statistic_ranking && statistic_ranking.wins) || 0;
  const losses = (statistic_ranking && statistic_ranking.losses) || 0;

  return (
    <Typography variant = 'overline' color = 'text.secondary'>
      {
        gameStatsLoading ?
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
