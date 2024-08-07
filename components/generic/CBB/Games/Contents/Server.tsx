'use server';

import React, { Suspense } from 'react';

import { Client } from '@/components/generic/CBB/Games/Contents/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { ClientSkeleton } from '../StatsLoader/Client';
import StatsLoaderServer from '../StatsLoader/Server';


const Server = async ({ cbb_games, date }) => {
  unstable_noStore();
  const revalidateScoresSeconds = 20; // cache scores for 20 seconds

  const scores = await useServerAPI({
    class: 'cbb_game',
    function: 'getScores',
    arguments: {
      start_date: date,
    },
  }, { revalidate: revalidateScoresSeconds });

  for (const cbb_game_id in scores) {
    if (cbb_game_id in cbb_games) {
      delete scores[cbb_game_id].home_team_rating;
      delete scores[cbb_game_id].away_team_rating;
      Object.assign(cbb_games[cbb_game_id], scores[cbb_game_id]);
    }
  }

  return (
    <>
      <Client cbb_games = {cbb_games} date = {date} />
      <Suspense fallback = {<ClientSkeleton />}>
        <StatsLoaderServer cbb_game_ids = {Object.keys(cbb_games)} />
      </Suspense>
    </>
  );
};

export default Server;
