'use client';

import { useAppSelector } from '@/redux/hooks';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/ux/contexts/themeContext';
import SentimentVeryDissatisfiedIcon from '@esmalley/react-material-icons/SentimentVeryDissatisfied';
import Roster from './Roster';
import { Games } from './Games';




const Client = ({ fantasy_entry_id }) => {
  const theme = useTheme();
  const fantasy_entry = useAppSelector((state) => state.fantasyEntryReducer.fantasy_entry);
  const fantasy_group = useAppSelector((state) => state.fantasyEntryReducer.fantasy_group);
  const fantasy_entry_players = useAppSelector((state) => state.fantasyEntryReducer.fantasy_entry_players);
  const player_team_seasons = useAppSelector((state) => state.fantasyEntryReducer.player_team_seasons);
  const players = useAppSelector((state) => state.fantasyEntryReducer.players);
  const fantasy_entry_player_statistic_rankings = useAppSelector((state) => state.fantasyEntryReducer.fantasy_entry_player_statistic_rankings);

  if (!fantasy_group.drafted) {
    return (
      <div style = {{ padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', fontStyle: 'italic', color: theme.text.secondary }}>
        <span style = {{ display: 'flex', marginRight: 10 }}><SentimentVeryDissatisfiedIcon style = {{ fontSize: 24 }} /></span>
        <Typography type = 'body1' style = {{ color: theme.text.secondary }}>Draft has not started yet!</Typography>
      </div>
    );
  }

  return (
    <div style={{ padding: 5, maxWidth: 1200, margin: 'auto' }}>
      <Roster
        fantasy_entry={fantasy_entry}
        fantasy_group = {fantasy_group}
        fantasy_entry_players={fantasy_entry_players}
        player_team_seasons={player_team_seasons}
        players={players}
        fantasy_entry_player_statistic_rankings={fantasy_entry_player_statistic_rankings}
      />
      <Games fantasy_entry_id={fantasy_entry_id} />
    </div>
  );
};

export { Client };
