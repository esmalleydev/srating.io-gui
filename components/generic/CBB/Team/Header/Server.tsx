'use server';
import React from 'react';

import HeaderClient from '@/components/generic/CBB/Team/Header/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { CoachTeamSeason, TeamSeasonConferences } from '@/types/cbb';



const Server = async({season, team_id}) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 2; // 2 hours

  const team = await useServerAPI({
    'class': 'team',
    'function': 'loadTeam',
    'arguments': {
      'team_id': team_id,
      'season': season,
    },
  }, {revalidate: revalidateSeconds});

  const team_season_conferences: TeamSeasonConferences = await useServerAPI({
    'class': 'team_season_conference',
    'function': 'read',
    'arguments': {
      'team_id': team_id
    }
  });

  const coach_team_season: CoachTeamSeason = await useServerAPI({
    'class': 'coach_team_season',
    'function': 'get',
    'arguments': {
      'team_id': team_id,
      'season': season,
    }
  });
  
  const coach = await useServerAPI({
    'class': 'coach',
    'function': 'get',
    'arguments': {
      'coach_id': coach_team_season.coach_id,
    }
  });

  const seasons = Object.values(team_season_conferences).map((row => row.season));

  return (
    <>
      <HeaderClient team = {team} season = {season} seasons = {seasons} coach = {coach} />
    </>
  );
}

export default Server;
