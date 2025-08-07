'use server';

import { useServerAPI } from '@/components/serverAPI';
import { Client } from './Client';

const Server = async ({ organization_id, division_id, home_team_id, away_team_id, season }) => {
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
      cache: revalidateSeconds,
    });
  }

  return (
    <>
      <Client games = {games} />
    </>
  );
};

export default Server;
