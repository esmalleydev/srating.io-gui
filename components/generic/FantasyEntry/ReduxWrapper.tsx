'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/fantasy_entry-slice';
import {
  BracketTeams,
  FantasyBracketSlots,
  FantasyEntry,
  FantasyEntryPlayers,
  FantasyGroup,
  Games,
  Players,
  PlayerTeamSeasons,
  Teams,
} from '@/types/general';
import { updateDivisionID, updateOrganizationID } from '@/redux/features/organization-slice';

const ReduxWrapper = (
  {
    children,
    fantasy_group,
    fantasy_entry,
    fantasy_entry_players,
    player_team_seasons,
    players,
    fantasy_bracket_slots,
    bracket_teams,
    teams,
    games,
  }:
  {
    children: React.ReactNode;
    fantasy_group?: FantasyGroup;
    fantasy_entry?: FantasyEntry;
    fantasy_entry_players?: FantasyEntryPlayers;
    player_team_seasons?: PlayerTeamSeasons;
    players?: Players;
    fantasy_bracket_slots?: FantasyBracketSlots;
    bracket_teams?: BracketTeams;
    teams?: Teams;
    games?: Games;
  },
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (fantasy_group) {
      dispatch(updateOrganizationID(fantasy_group.organization_id));
      dispatch(updateDivisionID(fantasy_group.division_id));
      dispatch(setDataKey({ key: 'fantasy_group', value: fantasy_group }));
    }
    if (fantasy_entry) {
      dispatch(setDataKey({ key: 'fantasy_entry', value: fantasy_entry }));
    }
    if (fantasy_entry_players) {
      dispatch(setDataKey({ key: 'fantasy_entry_players', value: fantasy_entry_players }));
    }
    if (player_team_seasons) {
      dispatch(setDataKey({ key: 'player_team_seasons', value: player_team_seasons }));
    }
    if (players) {
      dispatch(setDataKey({ key: 'players', value: players }));
    }
    if (fantasy_bracket_slots) {
      dispatch(setDataKey({ key: 'fantasy_bracket_slots', value: fantasy_bracket_slots }));
    }
    if (bracket_teams) {
      dispatch(setDataKey({ key: 'bracket_teams', value: bracket_teams }));
    }
    if (teams) {
      dispatch(setDataKey({ key: 'teams', value: teams }));
    }
    if (games) {
      dispatch(setDataKey({ key: 'games', value: games }));
    }
  }, [
    dispatch,
    fantasy_group,
    fantasy_entry,
    fantasy_entry_players,
    player_team_seasons,
    players,
    fantasy_bracket_slots,
    bracket_teams,
    teams,
    games,
  ]);


  return (
    <div>
      {children}
    </div>
  );
};

export default ReduxWrapper;
