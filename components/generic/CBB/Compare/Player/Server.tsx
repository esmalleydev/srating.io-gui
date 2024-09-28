'use server';

import React from 'react';

import { Client } from '@/components/generic/CBB/Compare/Player/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';

const Server = async ({ home_team_id, away_team_id, teams, season }) => {
  unstable_noStore();
  const revalidateSeconds = 3600; // 60 * 60; // 1 hour

  const organization_id = 'f1c37c98-3b4c-11ef-94bc-2a93761010b8'; // NCAAM Basketball
  const division_id = 'bf602dc4-3b4a-11ef-94bc-2a93761010b8'; // D1

  if (home_team_id && home_team_id in teams) {
    // eslint-disable-next-line no-param-reassign
    teams[home_team_id].playerStats = await useServerAPI({
      class: 'team',
      function: 'getRosterStats',
      arguments: {
        organization_id,
        division_id,
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
        organization_id,
        division_id,
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
