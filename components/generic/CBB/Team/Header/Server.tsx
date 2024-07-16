'use server';
import React from 'react';

import HeaderClient from '@/components/generic/CBB/Team/Header/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { Coach, CoachStatistic, CoachTeamSeason, TeamSeasonConferences } from '@/types/cbb';



const Server = async({season, team_id}) => {
  unstable_noStore();
  // console.time('header')
  const revalidateSeconds = 60 * 60 * 2; // 2 hours
  
  // console.time('header 1')
  const team = await useServerAPI({
    'class': 'team',
    'function': 'loadTeam',
    'arguments': {
      'team_id': team_id,
      'season': season,
    },
  }, {revalidate: revalidateSeconds});
  // console.timeEnd('header 1')

  // console.time('header 2')
  const team_season_conferences: TeamSeasonConferences = await useServerAPI({
    'class': 'team_season_conference',
    'function': 'read',
    'arguments': {
      'team_id': team_id,
      'organization_id': 'f1c37c98-3b4c-11ef-94bc-2a93761010b8',
    }
  });
  // console.timeEnd('header 2')

  // console.time('header 3')
  const coach_team_season: CoachTeamSeason = await useServerAPI({
    'class': 'coach_team_season',
    'function': 'get',
    'arguments': {
      'team_id': team_id,
      'season': season,
      'organization_id': 'f1c37c98-3b4c-11ef-94bc-2a93761010b8',
    }
  });
  // console.timeEnd('header 3')
  
  let coach: Coach | null = null;
  let cbb_coach_statistic_ranking: CoachStatistic | null = null;
  
  if (coach_team_season && coach_team_season.coach_id) {
    // console.time('header 4')
    coach = await useServerAPI({
      'class': 'coach',
      'function': 'get',
      'arguments': {
        'coach_id': coach_team_season.coach_id,
      }
    });
    // console.timeEnd('header 4')
    
    // console.time('header 5')
    cbb_coach_statistic_ranking = await useServerAPI({
      'class': 'cbb_coach_statistic_ranking',
      'function': 'get',
      'arguments': {
        'coach_id': coach_team_season.coach_id,
        'season': coach_team_season.season,
        'current': '1',
      }
    });
    // console.timeEnd('header 5')
  }

  // console.time('header 6')
  const cbb_conference_statistic_ranking = await useServerAPI({
    'class': 'cbb_conference_statistic_ranking',
    'function': 'get',
    'arguments': {
      'conference_id': team.conference_id,
      'season': season,
      'current': '1',
    }
  });
  // console.timeEnd('header 6')

  const seasons = Object.values(team_season_conferences).map((row => row.season));
  // above should be unique already... but if not, uncomment
  // const seasons = [...new Set(allSeasons)];
  // console.timeEnd('header')
  return (
    <>
      <HeaderClient team = {team} season = {season} seasons = {seasons} coach = {coach} cbb_coach_statistic_ranking = {cbb_coach_statistic_ranking} cbb_conference_statistic_ranking = {cbb_conference_statistic_ranking} />
    </>
  );
}

export default Server;
