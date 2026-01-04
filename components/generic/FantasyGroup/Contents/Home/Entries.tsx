'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Paper from '@/components/ux/container/Paper';
import Typography from '@/components/ux/text/Typography';

const Entries = () => {
  const theme = useTheme();


  return (
    <div>
      <Typography type = 'h6'>Entries</Typography>
      <Paper style={{ padding: 20 }}>
        todo
      </Paper>
    </div>
  );
};

export default Entries;
