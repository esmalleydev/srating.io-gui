'use client';

import FantasyGroup from '@/components/helpers/FantasyGroup';
import { useNavigation } from '@/components/hooks/useNavigation';
import { useTheme } from '@/components/ux/contexts/themeContext';
import Button from '@/components/ux/buttons/Button';
import Paper from '@/components/ux/container/Paper';
import Tile from '@/components/ux/container/Tile';
import Typography from '@/components/ux/text/Typography';
import { useAppSelector } from '@/redux/hooks';
import SentimentVeryDissatisfiedIcon from '@esmalley/react-material-icons/SentimentVeryDissatisfied';
import StadiumIcon from '@esmalley/react-material-icons/Stadium';
import React, { useState } from 'react';

const Entries = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);
  const fantasy_entrys = useAppSelector((state) => state.fantasyGroupReducer.fantasy_entrys);
  const fantasy_group_users = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group_users);
  const initialLimit = 10;
  const [limit, setLimit] = useState(initialLimit);

  const fantasyGroupHelper = new FantasyGroup({ fantasy_group });

  const entries = Object.values(fantasy_entrys || {});

  const user_id_x_fantasy_group_user = {};
  for (const fantasy_group_user_id in fantasy_group_users) {
    const row = fantasy_group_users[fantasy_group_user_id];

    user_id_x_fantasy_group_user[row.user_id] = row;
  }

  const handleTileClick = (e, fantasy_entry_id) => {
    navigation.fantasy_entry(`/fantasy_entry/${fantasy_entry_id}`);
  };

  const rows = entries.map((row, index) => {
    if (index > limit) {
      return null;
    }
    let secondary = row.user_id;
    if (row.user_id in user_id_x_fantasy_group_user) {
      secondary = user_id_x_fantasy_group_user[row.user_id].name || user_id_x_fantasy_group_user[row.user_id].email;
    }

    const buttons: React.JSX.Element[] = [];

    if (
      (fantasyGroupHelper.isNCAABracket() && fantasy_group.started) ||
      fantasyGroupHelper.isDraft()
    ) {
      buttons.push(
        <Button key = {row.fantasy_entry_id} title = 'View' value = {row.fantasy_entry_id} ink handleClick={handleTileClick} />,
      );
    }
    return (
      <Tile
        key = {row.fantasy_entry_id}
        icon={<StadiumIcon style = {{ fontSize: 24, color: theme.deepOrange[500] }} />}
        primary={row.name}
        secondary={secondary}
        buttons = {buttons}
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
        <span style = {{ display: 'flex', marginRight: 10 }}><SentimentVeryDissatisfiedIcon style = {{ fontSize: 24 }} /></span>
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
