'use server';

import { useServerAPI } from '@/components/serverAPI';
import { Client } from './Client';

const Server = async ({ game_ids, organization_id, division_id, season }) => {
  const revalidateSeconds = 60 * 60 * 6; // 6 hours

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
