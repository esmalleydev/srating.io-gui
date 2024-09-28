'use server';

import React from 'react';

import { Client, TrendsType } from '@/components/generic/Team/Trends/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';


const Server = async ({ organization_id, division_id, team_id, season }) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 6; // 6 hours

  const data: TrendsType = await useServerAPI({
    class: 'team',
    function: 'getTrends',
    arguments: {
      organization_id,
      division_id,
      team_id,
      season,
    },
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client organization_id = {organization_id} division_id = {division_id} data = {data} />
    </>
  );
};

export default Server;
