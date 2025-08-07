'use server';

import { Client } from '@/components/generic/Compare/Contents/Trends/StatCompare/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async ({ organization_id, division_id, season, home_team_id, away_team_id }) => {
  const revalidateSeconds = 3600; // 60 * 60; // 1 hour

  const statistic_rankings = await useServerAPI({
    class: 'statistic_ranking',
    function: 'readStats',
    arguments: {
      organization_id,
      division_id,
      team_id: [away_team_id, home_team_id],
      season,
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
