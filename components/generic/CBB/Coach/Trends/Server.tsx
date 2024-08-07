'use server';

import React from 'react';

import { Client } from '@/components/generic/CBB/Coach/Trends/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { CoachElo, CoachElos, Games } from '@/types/cbb';



const Server = async ({ coach_id }) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 2; // 2 hours

  const cbb_coach_elos: CoachElos = await useServerAPI({
    class: 'cbb_coach_elo',
    function: 'read',
    arguments: {
      coach_id,
    },
  }, { revalidate: revalidateSeconds });

  const cbb_games: Games = await useServerAPI({
    class: 'cbb_game',
    function: 'read',
    arguments: {
      cbb_game_id: Object.values(cbb_coach_elos).map((row: CoachElo) => row.cbb_game_id),
    },
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client cbb_coach_elos = {cbb_coach_elos} cbb_games = {cbb_games} />
    </>
  );
};

export default Server;
