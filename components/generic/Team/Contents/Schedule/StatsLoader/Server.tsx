'use server';

import React from 'react';

import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { Client } from './Client';



const Server = async ({ game_ids, organization_id, division_id }) => {
  unstable_noStore();

  const revalidateSeconds = 60 * 60 * 12; // 12 hours

  const scheduleStats: object = await useServerAPI({
    class: 'game',
    function: 'getAllStats',
    arguments: {
      organization_id,
      division_id,
      game_ids,
    },
    cache: revalidateSeconds,
  });

  return (
    <>
      <Client scheduleStats={scheduleStats} />
    </>
  );
};

export default Server;
