'use server';
import React from 'react';

import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import Client from './Client';

const Server = async({ home_team_id, away_team_id, season, teams, subview}) => {
  unstable_noStore();
  const revalidateSeconds = 3600; // 60 * 60; // 1 hour

  if (home_team_id && home_team_id in teams) {
    teams[home_team_id].stats = await useServerAPI({
      'class': 'team',
      'function': 'getStats',
      'arguments': {
        'team_id': home_team_id,
        'season': season
      },
    }, {revalidate: revalidateSeconds});


    teams[home_team_id].elo = await useServerAPI({
      'class': 'cbb_elo',
      'function': 'get',
      'arguments': {
        'team_id': home_team_id,
        'season': season,
        'current': '1',
      },
    }, {revalidate: revalidateSeconds});
  }

  if (away_team_id && away_team_id in teams) {

    teams[away_team_id].stats = await useServerAPI({
      'class': 'team',
      'function': 'getStats',
      'arguments': {
        'team_id': away_team_id,
        'season': season
      },
    }, {revalidate: revalidateSeconds});



    teams[away_team_id].elo = await useServerAPI({
      'class': 'cbb_elo',
      'function': 'get',
      'arguments': {
        'team_id': away_team_id,
        'season': season,
        'current': '1',
      },
    }, {revalidate: revalidateSeconds});
  }
 

  return (
    <>
      <Client home_team_id={home_team_id} away_team_id={away_team_id} teams={teams} season={season} subview={subview} />
    </>
  );
}

export default Server;
