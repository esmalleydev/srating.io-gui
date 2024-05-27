'use server';
import React from 'react';

import HeaderClient from '@/components/generic/CBB/Team/Header/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';



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

  const team_season_conferences = await useServerAPI({
    'class': 'team_season_conference',
    'function': 'read',
    'arguments': {
      'team_id': team_id
    }
  });

  const seasons = Object.values(team_season_conferences).map((row => row.season));

  return (
    <>
      <HeaderClient team = {team} season = {season} seasons = {seasons} />
    </>
  );
}

export default Server;
