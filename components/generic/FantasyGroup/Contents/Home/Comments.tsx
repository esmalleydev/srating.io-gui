'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Paper from '@/components/ux/container/Paper';
import Typography from '@/components/ux/text/Typography';
import { useAppSelector } from '@/redux/hooks';

const Comments = () => {
  const theme = useTheme();

  const fantasy_group_comments = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group_comments);


  return (
    <div>
      <Typography type = 'h6'>Comments</Typography>
      <Paper style={{ padding: 20 }}>
        {JSON.stringify(fantasy_group_comments)}
      </Paper>
    </div>
  );
};

export default Comments;
