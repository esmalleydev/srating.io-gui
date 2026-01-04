'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Paper from '@/components/ux/container/Paper';
import Typography from '@/components/ux/text/Typography';

const Ranking = () => {
  const theme = useTheme();


  return (
    <div>
      <Typography type = 'h6'>Ranking</Typography>
      <Paper style={{ padding: 20 }}>
        todo
      </Paper>
    </div>
  );
};

export default Ranking;
