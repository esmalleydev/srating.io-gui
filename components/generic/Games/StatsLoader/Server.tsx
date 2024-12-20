'use server';

import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { Client } from './Client';

const Server = async ({ game_ids, organization_id, division_id }) => {
  unstable_noStore();

  const revalidateSeconds = 60 * 60 * 6; // 6 hours

  const gameStats: object = await useServerAPI({
    class: 'game',
    function: 'getAllStats',
    arguments: {
      organization_id,
      division_id,
      game_ids,
    },
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client gameStats={gameStats} />
    </>
  );
};

export default Server;
