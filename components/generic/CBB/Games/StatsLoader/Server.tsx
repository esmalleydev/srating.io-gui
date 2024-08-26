'use server';

import React from 'react';

import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { Client } from './Client';



const Server = async ({ game_ids }) => {
  unstable_noStore();

  const revalidateSeconds = 60 * 60 * 12; // 12 hours

  const gameStats: object = await useServerAPI({
    class: 'game',
    function: 'getAllStats',
    arguments: {
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
