'use server';


import { Client } from '@/components/generic/Player/Contents/Stats/Client';
import { useServerAPI } from '@/components/serverAPI';


const Server = async ({ organization_id, division_id, season, player_id }) => {
  const revalidateSeconds = 60 * 30; // 30 mins

  const player_statistic_ranking = await useServerAPI({
    class: 'player_statistic_ranking',
    function: 'getStats',
    arguments: {
      organization_id,
      division_id,
      player_id,
      season,
      current: '1',
    },
    cache: revalidateSeconds,
  });


  return (
    <>
      <Client organization_id = {organization_id} division_id = {division_id} season = {season} player_statistic_ranking = {player_statistic_ranking} />
    </>
  );
};

export default Server;
