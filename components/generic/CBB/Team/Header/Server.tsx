'use server';

import React from 'react';

import { Client } from '@/components/generic/CBB/Team/Header/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import {
  Coach, CoachStatistic, CoachTeamSeason, TeamSeasonConferences,
} from '@/types/cbb';



const Server = async ({ season, team_id }) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 2; // 2 hours

  const team = await useServerAPI({
    class: 'team',
    function: 'loadTeam',
    arguments: {
      team_id,
      season,
    },
  }, { revalidate: revalidateSeconds });

  const team_season_conferences: TeamSeasonConferences = await useServerAPI({
    class: 'team_season_conference',
    function: 'read',
    arguments: {
      team_id,
      organization_id: 'f1c37c98-3b4c-11ef-94bc-2a93761010b8',
    },
  });

  const coach_team_season: CoachTeamSeason = await useServerAPI({
    class: 'coach_team_season',
    function: 'get',
    arguments: {
      team_id,
      season,
      organization_id: 'f1c37c98-3b4c-11ef-94bc-2a93761010b8',
    },
  });

  let coach: Coach | null = null;
  let cbb_coach_statistic_ranking: CoachStatistic | null = null;

  if (coach_team_season && coach_team_season.coach_id) {
    coach = await useServerAPI({
      class: 'coach',
      function: 'get',
      arguments: {
        coach_id: coach_team_season.coach_id,
      },
    });

    cbb_coach_statistic_ranking = await useServerAPI({
      class: 'cbb_coach_statistic_ranking',
      function: 'get',
      arguments: {
        coach_id: coach_team_season.coach_id,
        season: coach_team_season.season,
        current: '1',
      },
    });
  }

  const cbb_conference_statistic_ranking = await useServerAPI({
    class: 'cbb_conference_statistic_ranking',
    function: 'get',
    arguments: {
      conference_id: team.conference_id,
      season,
      current: '1',
    },
  });

  const seasons = Object.values(team_season_conferences).map(((row) => row.season));
  // above should be unique already... but if not, uncomment
  // const seasons = [...new Set(allSeasons)];
  // console.timeEnd('header')
  return (
    <>
      <Client team = {team} season = {season} seasons = {seasons} coach = {coach} cbb_coach_statistic_ranking = {cbb_coach_statistic_ranking} cbb_conference_statistic_ranking = {cbb_conference_statistic_ranking} />
    </>
  );
};

export default Server;
