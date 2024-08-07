'use server';

import React from 'react';

import { Client } from '@/components/generic/CBB/Compare/Player/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';

const Server = async ({ home_team_id, away_team_id, teams, season }) => {
  unstable_noStore();
  const revalidateSeconds = 3600; // 60 * 60; // 1 hour

  if (home_team_id && home_team_id in teams) {
    // eslint-disable-next-line no-param-reassign
    teams[home_team_id].playerStats = await useServerAPI({
      class: 'team',
      function: 'getRosterStats',
      arguments: {
        team_id: home_team_id,
        season,
      },
    }, { revalidate: revalidateSeconds });
  }

  if (away_team_id && away_team_id in teams) {
    // eslint-disable-next-line no-param-reassign
    teams[away_team_id].playerStats = await useServerAPI({
      class: 'team',
      function: 'getRosterStats',
      arguments: {
        team_id: away_team_id,
        season,
      },
    }, { revalidate: revalidateSeconds });
  }

  return (
    <>
      <Client teams = {teams} />
    </>
  );
};

export default Server;
