'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Paper from '@/components/ux/container/Paper';
import Typography from '@/components/ux/text/Typography';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const Ranking = () => {
  const theme = useTheme();

  const getContents = () => {
    // if (inviteRows.length) {
    //   return inviteRows;
    // }

    // if (canInvite && inviteRows.length === 0) {
    //   return (
    //     <div style = {{ padding: 16, textAlign: 'center' }}>
    //       <Button title = 'Invite people' value = 'invite' handleClick = {handleInvite} />
    //     </div>
    //   );
    // }

    return (
      <div style = {{ padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', fontStyle: 'italic', color: theme.text.secondary }}>
        <span style = {{ display: 'flex', marginRight: 10 }}><SentimentVeryDissatisfiedIcon /></span>
        <Typography type = 'body1' style = {{ color: theme.text.secondary }}>No rankings yet!</Typography>
      </div>
    );
  };



  return (
    <div>
      <Typography type = 'h6'>Leaderboard</Typography>
      <Paper style={{ padding: 16 }}>
        {getContents()}
      </Paper>
    </div>
  );
};

export default Ranking;
