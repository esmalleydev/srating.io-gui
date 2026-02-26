'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Typography from '@/components/ux/text/Typography';
import { useAppSelector } from '@/redux/hooks';
import { Skeleton } from '@mui/material';


const Record = () => {
  const theme = useTheme();
  const statistic_rankings = useAppSelector((state) => state.conferenceReducer.statistic_rankings);

  let totalWins = 0;
  let totalLosses = 0;

  for (const statistic_ranking_id in statistic_rankings) {
    const row = statistic_rankings[statistic_ranking_id];

    totalLosses += row.losses || 0;
    totalWins += row.wins || 0;
  }

  return (
    <Typography type = 'overline' style = {{ color: theme.text.secondary }}>
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
