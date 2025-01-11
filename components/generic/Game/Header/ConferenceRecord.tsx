'use client';

import { useAppSelector } from '@/redux/hooks';
import { Game } from '@/types/general';
import { Skeleton, Typography } from '@mui/material';

const ConferenceRecord = (
  { game, team_id }:
  { game: Game; team_id: string; },
) => {
  const gameStats = useAppSelector((state) => state.gameReducer.gameStats);
  const gameStatsLoading = useAppSelector((state) => state.gameReducer.gameStatsLoading);

  // const current = (gameStats[game.game_id] && gameStats[game.game_id].current[team_id]) || null;
  const historical = (gameStats[game.game_id] && gameStats[game.game_id].historical[team_id]) || null;
  const statistic_ranking = historical;

  const wins = (statistic_ranking && statistic_ranking.confwins) || 0;
  const losses = (statistic_ranking && statistic_ranking.conflosses) || 0;

  return (
    <Typography variant = 'overline' color = 'text.secondary' style = {{ fontSize: 11, lineHeight: 'initial' }}>
      {
        gameStatsLoading ?
          <Skeleton style={{
            marginLeft: '5px', width: 25, height: 10, display: 'inline-block',
          }} />
          :
          ` (${wins}-${losses})`
      }
    </Typography>
  );
};

export default ConferenceRecord;
