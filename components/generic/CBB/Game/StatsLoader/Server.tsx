'use server';

import React from 'react';

import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { Client } from './Client';



const Server = async ({ cbb_game_ids }) => {
  unstable_noStore();

  const revalidateSeconds = 60 * 60 * 12; // 12 hours

  const gameStats: object = await useServerAPI({
    class: 'cbb_game',
    function: 'getAllStats',
    arguments: {
      cbb_game_ids,
    },
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client gameStats={gameStats} />
    </>
  );
};

export default Server;
