'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Paper from '@/components/ux/container/Paper';
import Tile from '@/components/ux/container/Tile';
import Typography from '@/components/ux/text/Typography';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import PersonIcon from '@mui/icons-material/Person';
import { useAppSelector } from '@/redux/hooks';
import { useState } from 'react';
import Button from '@/components/ux/buttons/Button';

const Members = () => {
  const theme = useTheme();
  const fantasy_group_users = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group_users);

  const initialLimit = 5;
  const [limit, setLimit] = useState(initialLimit);

  const members = Object.values(fantasy_group_users || {});

  const memberRows = members.map((row, index) => {
    if (index > limit) {
      return null;
    }
    return (
      <Tile
        icon={<PersonIcon />}
        primary={row.name || row.user_id}
        secondary={row.email}
      />
    );
  }).filter((r) => r !== null);


  const buttons: React.JSX.Element[] = [];

  if (members.length > limit) {
    buttons.push(
      <Button
        value = 'view-all'
        title = {`View all (${members.length})`}
        ink
        handleClick={() => setLimit(Infinity)}
      />,
    );
  } else if (limit === Infinity) {
    buttons.push(
      <Button
        value = 'hide-extra'
        title = {'Show less'}
        ink
        handleClick={() => setLimit(initialLimit)}
      />,
    );
  }

  const getContents = () => {
    if (memberRows.length) {
      return memberRows;
    }


    return (
      <div style = {{ padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', fontStyle: 'italic', color: theme.text.secondary }}>
        <span style = {{ display: 'flex', marginRight: 10 }}><SentimentVeryDissatisfiedIcon /></span>
        <Typography type = 'body1' style = {{ color: theme.text.secondary }}>No members yet!</Typography>
      </div>
    );
  };

  return (
    <div>
      <Typography type = 'h6'>Members</Typography>
      <Paper style={{ padding: 20 }}>
        {getContents()}
      </Paper>
    </div>
  );
};

export default Members;
