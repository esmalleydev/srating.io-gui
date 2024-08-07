'use server';

import React, { Suspense } from 'react';

import { Client } from '@/components/generic/CBB/Team/Schedule/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { ClientSkeleton } from './StatsLoader/Client';
import StatsLoaderServer from './StatsLoader/Server';



const Server = async ({ season, team_id }) => {
  unstable_noStore();

  const revalidateSeconds = 60;

  const cbb_games: object = await useServerAPI({
    class: 'team',
    function: 'getSchedule',
    arguments: {
      team_id,
      season,
    },
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client cbb_games = {cbb_games} team_id = {team_id} />
      <Suspense fallback = {<ClientSkeleton />}>
        <StatsLoaderServer cbb_game_ids = {Object.keys(cbb_games)} />
      </Suspense>
    </>
  );
};

export default Server;
