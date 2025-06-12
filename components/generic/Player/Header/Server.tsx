'use server';

import { Client } from '@/components/generic/Player/Header/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async ({ organization_id, division_id, season, player_id, team_id }) => {
  const revalidateSeconds = 60 * 60 * 6; // 6 hours

  const player_statistic_ranking = await useServerAPI({
    class: 'player_statistic_ranking',
    function: 'getStats',
    arguments: {
      organization_id,
      division_id,
      season,
      player_id,
      current: '1',
    },
    cache: revalidateSeconds,
  });


  const statistic_ranking = await useServerAPI({
    class: 'statistic_ranking',
    function: 'getStats',
    arguments: {
      organization_id,
      division_id,
      team_id,
      season,
      current: '1',
    },
    cache: revalidateSeconds,
  });


  return (
    <>
      <Client organization_id={organization_id} division_id={division_id} player_statistic_ranking = {player_statistic_ranking} statistic_ranking = {statistic_ranking} season = {season} />
    </>
  );
};

export default Server;
