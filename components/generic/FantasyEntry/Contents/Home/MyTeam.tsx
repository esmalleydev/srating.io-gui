'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Paper from '@/components/ux/container/Paper';
import Tile from '@/components/ux/container/Tile';
import Typography from '@/components/ux/text/Typography';
import { useAppSelector } from '@/redux/hooks';

import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import React from 'react';


const MyTeam = () => {
  const theme = useTheme();
  const fantasy_group = useAppSelector((state) => state.fantasyEntryReducer.fantasy_group);
  const fantasy_entry = useAppSelector((state) => state.fantasyEntryReducer.fantasy_entry);
  const fantasy_entry_players = useAppSelector((state) => state.fantasyEntryReducer.fantasy_entry_players);
  const player_team_seasons = useAppSelector((state) => state.fantasyEntryReducer.player_team_seasons);
  const players = useAppSelector((state) => state.fantasyEntryReducer.players);


  const getEntry = () => {
    const tiles: React.JSX.Element[] = [];

    for (const fantasy_entry_player_id in fantasy_entry_players) {
      const row = fantasy_entry_players[fantasy_entry_player_id];
      const player = (
        row.player_team_season_id &&
        row.player_team_season_id in player_team_seasons &&
        players[player_team_seasons[row.player_team_season_id].player_id]
      );
      const player_name = player ? `${player.first_name} ${player.last_name}` : 'Unknown';

      tiles.push(
        <Tile
          primary = {player_name}
        />,
      );
    }

    return (
      <div>
        <Typography type = 'body1' style = {{ color: theme.info.main }}>{fantasy_entry.name}</Typography>
        {tiles}
      </div>
    );
  };

  const getContents = () => {
    if (fantasy_group.drafted) {
      return getEntry();
    }

    return (
      <div style = {{ padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', fontStyle: 'italic', color: theme.text.secondary }}>
        <span style = {{ display: 'flex', marginRight: 10 }}><SentimentVeryDissatisfiedIcon /></span>
        <Typography type = 'body1' style = {{ color: theme.text.secondary }}>Draft has not started yet!</Typography>
      </div>
    );
  };

  return (
    <div>
      <Typography type = 'h6'>My team</Typography>
      <Paper style={{ padding: 20 }}>
        {getContents()}
      </Paper>
    </div>
  );
};

export default MyTeam;
