'use server';

import React, { Suspense } from 'react';

import { Client } from '@/components/generic/Games/Contents/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { ClientSkeleton } from '../StatsLoader/Client';
import StatsLoaderServer from '../StatsLoader/Server';

export const getDates = async ({ season, organization_id, division_id }) => {
  unstable_noStore();
  const revalidateSeconds = 43200; // 60 * 60 * 12; // cache for 12 hours

  const dates: string[] = await useServerAPI({
    class: 'game',
    function: 'getSeasonDates',
    arguments: {
      organization_id,
      division_id,
      season,
    },
  }, { revalidate: revalidateSeconds });

  return dates;
};

export const getGames = async ({ date, organization_id, division_id }) => {
  unstable_noStore();
  const revalidateSeconds = 1200; // 60 * 20; // cache games for 20 mins

  const games = await useServerAPI({
    class: 'game',
    function: 'getGames',
    arguments: {
      organization_id,
      division_id,
      start_date: date,
    },
  }, { revalidate: revalidateSeconds });

  return games;
};


const Server = async ({ games, date, organization_id, division_id }) => {
  unstable_noStore();
  const revalidateScoresSeconds = 20; // cache scores for 20 seconds

  const scores = await useServerAPI({
    class: 'game',
    function: 'getScores',
    arguments: {
      organization_id,
      division_id,
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
        <StatsLoaderServer game_ids = {Object.keys(games)} organization_id = {organization_id} division_id = {division_id} />
      </Suspense>
    </>
  );
};

export default Server;
