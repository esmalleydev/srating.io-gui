'use server';

import React from 'react';

import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { Client } from './Client';

const Server = async ({ organization_id, division_id, home_team_id, away_team_id, teams, season }) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 2; // 2 hours

  let games = {};

  if (home_team_id && away_team_id) {
    games = await useServerAPI({
      class: 'game',
      function: 'getPreviousMatchups',
      arguments: {
        organization_id,
        division_id,
        home_team_id,
        away_team_id,
        season,
      },
    }, { revalidate: revalidateSeconds });
  }

  return (
    <>
      <Client games = {games} teams={teams} home_team_id={home_team_id} away_team_id={away_team_id} />
    </>
  );
};

export default Server;
