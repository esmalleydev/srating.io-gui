'use client';

import Navigation from '@/components/helpers/Navigation';
import { useTheme } from '@/components/hooks/useTheme';
import Button from '@/components/ux/buttons/Button';
import Paper from '@/components/ux/container/Paper';
import Tile from '@/components/ux/container/Tile';
import Typography from '@/components/ux/text/Typography';
import { FantasyGroups } from '@/types/general';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { useState } from 'react';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const MyGroups = (
  {
    fantasy_groups,
  }:
  {
    fantasy_groups: FantasyGroups;
  },
) => {
  const theme = useTheme();
  const navigation = new Navigation();
  const initialLimit = 10;
  const [limit, setLimit] = useState(initialLimit);

  const groups = Object.values(fantasy_groups);

  const handleTileClick = (e, fantasy_group_id) => {
    navigation.fantasy_group(`/fantasy_group/${fantasy_group_id}`);
  };

  const rows = groups.map((row, index) => {
    if (index > limit) {
      return null;
    }
    return (
      <Tile
        key = {row.fantasy_group_id}
        icon={<SportsEsportsIcon style = {{ color: theme.success.main }} />}
        primary={row.name}
        // secondary={row.email}
        buttons = {[
          <Button key = {`view- ${row.fantasy_group_id}`} title = 'View' value = {row.fantasy_group_id} ink handleClick={handleTileClick} />,
        ]}
      />
    );
  }).filter((r) => r !== null);

  const buttons: React.JSX.Element[] = [];

  if (rows.length > limit) {
    buttons.push(
      <Button
        key = {'view-all'}
        value = 'view-all'
        title = {`View all (${rows.length})`}
        ink
        handleClick={() => setLimit(Infinity)}
      />,
    );
  } else if (limit === Infinity) {
    buttons.push(
      <Button
        key = {'hide-extra'}
        value = 'hide-extra'
        title = {'Show less'}
        ink
        handleClick={() => setLimit(initialLimit)}
      />,
    );
  }

  const getContents = () => {
    if (rows.length) {
      return rows;
    }

    return (
      <div style = {{ padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', fontStyle: 'italic', color: theme.text.secondary }}>
        <span style = {{ display: 'flex', marginRight: 10 }}><SentimentVeryDissatisfiedIcon /></span>
        <Typography type = 'body1' style = {{ color: theme.text.secondary }}>Not in any leagues! Join a public one below!</Typography>
      </div>
    );
  };


  return (
    <div>
      <Typography type = 'h6'>My fantasy leagues</Typography>
      <Paper style={{ padding: 16 }}>
        {getContents()}
        <div style = {{ textAlign: 'right' }}>{buttons}</div>
      </Paper>
    </div>
  );
};

export default MyGroups;
