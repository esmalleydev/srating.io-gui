'use server';
import React from 'react';

import HeaderClient from '@/components/generic/CBB/Conference/Header/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { TeamSeasonConferences } from '@/types/cbb';


const Server = async({season, conference_id}) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 2; // 2 hours

  const cbb_conference_statistic_ranking = await useServerAPI({
    'class': 'cbb_conference_statistic_ranking',
    'function': 'get',
    'arguments': {
      'conference_id': conference_id,
      'current': '1'
    },
  }, {revalidate: revalidateSeconds});

  const team_season_conferences: TeamSeasonConferences = await useServerAPI({
    'class': 'team_season_conference',
    'function': 'read',
    'arguments': {
      'conference_id': conference_id
    }
  });


  const allSeasons = Object.values(team_season_conferences).map((row) => row.season);
  // gets only the unique ones
  const seasons = [...new Set(allSeasons)];

  return (
    <>
      <HeaderClient cbb_conference_statistic_ranking = {cbb_conference_statistic_ranking} season = {season} conference_id = {conference_id} seasons = {seasons} />
    </>
  );
}

export default Server;
