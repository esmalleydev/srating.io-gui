'use server';

import { Client } from '@/components/generic/Picks/StatsLoader/Client';
import { useServerAPI } from '@/components/serverAPI';


const Server = async ({ game_ids, organization_id, division_id, season }) => {
  const revalidateSeconds = 60 * 60 * 12; // 12 hours

  const gameStats: object = await useServerAPI({
    class: 'game',
    function: 'getAllStats',
    arguments: {
      organization_id,
      division_id,
      season,
      game_ids,
    },
    cache: revalidateSeconds,
  });

  return (
    <>
      <Client gameStats={gameStats} />
    </>
  );
};

export default Server;
