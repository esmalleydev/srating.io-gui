'use server';

import React from 'react';

import Client from '@/components/generic/CBB/Picks/Stats/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';


const Server = async ({ date, season }) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 5; // cache for 5 minss

  const stats = await useServerAPI({
    class: 'odds',
    function: 'getStatsData',
    arguments: {
      date,
      season,
    },
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client stats = {stats} date = {date} />
    </>
  );
};

export default Server;
