'use server';

import React from 'react';

import { Client, TrendsType } from '@/components/generic/CBB/Team/Trends/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';


const Server = async ({ team_id, season }) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 6; // 6 hours

  const data: TrendsType = await useServerAPI({
    class: 'team',
    function: 'getTrends',
    arguments: {
      team_id,
      season,
    },
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client data = {data} />
    </>
  );
};

export default Server;
