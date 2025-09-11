'use server';

import { Suspense } from 'react';

import { Client } from '@/components/generic/Games/Contents/Client';
import { useServerAPI } from '@/components/serverAPI';
import { ClientSkeleton } from '../StatsLoader/Client';
import StatsLoaderServer from '../StatsLoader/Server';


const Server = async ({ games, date, organization_id, division_id, season }) => {
  const revalidateSeconds = 20; // cache scores for 20 seconds

  const scores = await useServerAPI({
    class: 'game',
    function: 'getScores',
    arguments: {
      organization_id,
      division_id,
      start_date: date,
    },
    cache: revalidateSeconds,
  });

  if (scores) {
    for (const game_id in scores) {
      if (game_id in games) {
        delete scores[game_id].prediction;
        delete scores[game_id].prediction;
        Object.assign(games[game_id], scores[game_id]);
      }
    }
  }

  return (
    <>
      <Client games = {games} date = {date} />
      <Suspense fallback = {<ClientSkeleton />}>
        <StatsLoaderServer game_ids = {Object.keys(games)} organization_id = {organization_id} division_id = {division_id} season = {season} />
      </Suspense>
    </>
  );
};

export default Server;
