'use client';

import Navigation from '@/components/helpers/Navigation';
import { useTheme } from '@/components/hooks/useTheme';
import Button from '@/components/ux/buttons/Button';
import Paper from '@/components/ux/container/Paper';
import Tile from '@/components/ux/container/Tile';
import Typography from '@/components/ux/text/Typography';
import { useAppSelector } from '@/redux/hooks';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import StadiumIcon from '@mui/icons-material/Stadium';
import { useState } from 'react';

const Entries = () => {
  const theme = useTheme();
  const navigation = new Navigation();
  const fantasy_entrys = useAppSelector((state) => state.fantasyGroupReducer.fantasy_entrys);
  const initialLimit = 10;
  const [limit, setLimit] = useState(initialLimit);

  const entries = Object.values(fantasy_entrys || {});

  const handleTileClick = (e, fantasy_entry_id) => {
    navigation.fantasy_entry(`/fantasy_entry/${fantasy_entry_id}`);
  };

  const rows = entries.map((row, index) => {
    if (index > limit) {
      return null;
    }
    return (
      <Tile
        icon={<StadiumIcon style = {{ color: theme.deepOrange[500] }} />}
        primary={row.name}
        // secondary={row.email}
        buttons = {[
          <Button title = 'View' value = {row.fantasy_entry_id} ink handleClick={handleTileClick} />,
        ]}
      />
    );
  }).filter((r) => r !== null);

  const buttons: React.JSX.Element[] = [];

  if (rows.length > limit) {
    buttons.push(
      <Button
        value = 'view-all'
        title = {`View all (${rows.length})`}
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
    if (rows.length) {
      return rows;
    }

    return (
      <div style = {{ padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', fontStyle: 'italic', color: theme.text.secondary }}>
        <span style = {{ display: 'flex', marginRight: 10 }}><SentimentVeryDissatisfiedIcon /></span>
        <Typography type = 'body1' style = {{ color: theme.text.secondary }}>No entries yet!</Typography>
      </div>
    );
  };



  return (
    <div>
      <Typography type = 'h6'>Entries</Typography>
      <Paper style={{ padding: 16 }}>
        {getContents()}
        <div style = {{ textAlign: 'right' }}>{buttons}</div>
      </Paper>
    </div>
  );
};

export default Entries;
