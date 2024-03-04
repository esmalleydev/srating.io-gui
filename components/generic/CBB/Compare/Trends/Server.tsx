'use server';
import React from 'react';

import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import Client from './Client';

const Server = async({ home_team_id, away_team_id, teams, season}) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 2; // 2 hours

  let cbb_games = {};

  if (home_team_id && away_team_id) {
    cbb_games = await useServerAPI({
      'class': 'cbb_game',
      'function': 'getPreviousMatchups',
      'arguments': {
        'home_team_id': home_team_id,
        'away_team_id': away_team_id,
        'season': season,
      },
    }, {revalidate: revalidateSeconds});
  }

  return (
    <>
      <Client cbb_games = {cbb_games} teams={teams} home_team_id={home_team_id} away_team_id={away_team_id} />
    </>
  );
}

export default Server;
