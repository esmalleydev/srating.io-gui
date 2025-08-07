'use server';

import { useServerAPI } from '@/components/serverAPI';
import { Client } from './Client';

const Server = async ({ organization_id, division_id, home_team_id, away_team_id, season }) => {
  const revalidateSeconds = 3600; // 60 * 60; // 1 hour

  const statistic_rankings = await useServerAPI({
    class: 'statistic_ranking',
    function: 'readStats',
    arguments: {
      organization_id,
      division_id,
      team_id: [home_team_id, away_team_id],
      season,
      current: '1',
    },
    cache: revalidateSeconds,
  });


  return (
    <>
      <Client statistic_rankings = {statistic_rankings} />
    </>
  );
};

export default Server;
