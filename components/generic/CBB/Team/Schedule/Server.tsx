'use server';

import React, { Suspense } from 'react';

import { Client } from '@/components/generic/CBB/Team/Schedule/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { ClientSkeleton } from './StatsLoader/Client';
import StatsLoaderServer from './StatsLoader/Server';
import { Games } from '@/types/cbb';



const Server = async ({ season, team_id }) => {
  unstable_noStore();

  const revalidateSeconds = 60;

  const games: Games = await useServerAPI({
    class: 'team',
    function: 'getSchedule',
    arguments: {
      team_id,
      season,
    },
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client games = {games} team_id = {team_id} />
      <Suspense fallback = {<ClientSkeleton />}>
        <StatsLoaderServer game_ids = {Object.keys(games)} />
      </Suspense>
    </>
  );
};

export default Server;
