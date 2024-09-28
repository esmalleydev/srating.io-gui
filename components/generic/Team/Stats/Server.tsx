'use server';

import React from 'react';

import { Client } from '@/components/generic/Team/Stats/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';



const Server = async ({ organization_id, division_id, season, team_id }) => {
  unstable_noStore();

  const revalidateSeconds = 60 * 30; // 30 mins

  const teamStats: object = await useServerAPI({
    class: 'team',
    function: 'getStats',
    arguments: {
      organization_id,
      division_id,
      team_id,
      season,
    },
  }, { revalidate: revalidateSeconds });

  const rosterStats: object = await useServerAPI({
    class: 'team',
    function: 'getRosterStats',
    arguments: {
      organization_id,
      division_id,
      team_id,
      season,
    },
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client organization_id = {organization_id} division_id = {division_id} season = {season} teamStats = {teamStats} rosterStats = {rosterStats} />
    </>
  );
};

export default Server;
