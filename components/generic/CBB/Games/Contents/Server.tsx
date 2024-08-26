'use server';

import React, { Suspense } from 'react';

import { Client } from '@/components/generic/CBB/Games/Contents/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { ClientSkeleton } from '../StatsLoader/Client';
import StatsLoaderServer from '../StatsLoader/Server';


const Server = async ({ games, date }) => {
  unstable_noStore();
  const revalidateScoresSeconds = 20; // cache scores for 20 seconds

  const scores = await useServerAPI({
    class: 'game',
    function: 'getScores',
    arguments: {
      start_date: date,
    },
  }, { revalidate: revalidateScoresSeconds });

  for (const game_id in scores) {
    if (game_id in games) {
      delete scores[game_id].prediction;
      delete scores[game_id].prediction;
      Object.assign(games[game_id], scores[game_id]);
    }
  }

  return (
    <>
      <Client games = {games} date = {date} />
      <Suspense fallback = {<ClientSkeleton />}>
        <StatsLoaderServer game_ids = {Object.keys(games)} />
      </Suspense>
    </>
  );
};

export default Server;
