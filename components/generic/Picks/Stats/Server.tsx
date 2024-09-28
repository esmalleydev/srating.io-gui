'use server';

import React from 'react';

import Client from '@/components/generic/Picks/Stats/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';


const Server = async ({ organization_id, division_id, date, season }) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 5; // cache for 5 minss

  const stats = await useServerAPI({
    class: 'odds',
    function: 'getStatsData',
    arguments: {
      organization_id,
      division_id,
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
