'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Typography from '@/components/ux/text/Typography';
import { useAppSelector } from '@/redux/hooks';
import { Game } from '@/types/general';
import { Skeleton } from '@mui/material';

const CoachRecord = (
  { game, coach_id }:
  { game: Game; coach_id: string; },
) => {
  const theme = useTheme();
  const coachStats = useAppSelector((state) => state.gameReducer.coachStats);
  const gameStatsLoading = useAppSelector((state) => state.gameReducer.gameStatsLoading);

  // const current = (coachStats[game.game_id] && coachStats[game.game_id].current[coach_id]) || null;
  const historical = (coachStats[game.game_id] && coachStats[game.game_id].historical[coach_id]) || null;
  const statistic_ranking = historical;

  const wins = (statistic_ranking && statistic_ranking.wins) || 0;
  const losses = (statistic_ranking && statistic_ranking.losses) || 0;

  return (
    <Typography type = 'overline' style = {{ color: theme.text.secondary, fontSize: 11, lineHeight: 'initial', display: 'inline-block', marginLeft: '5px' }}>
      {
        gameStatsLoading ?
          <Skeleton style={{
            width: 25, height: 10,
          }} />
          :
          ` (${wins}-${losses})`
      }
    </Typography>
  );
};

export default CoachRecord;
