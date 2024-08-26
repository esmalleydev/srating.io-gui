'use server';

import React from 'react';

import { Client } from '@/components/generic/CBB/Coach/Trends/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { CoachElo, CoachElos, Games } from '@/types/cbb';



const Server = async ({ coach_id }) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 2; // 2 hours

  const organization_id = 'f1c37c98-3b4c-11ef-94bc-2a93761010b8'; // NCAAM Basketball
  const division_id = 'bf602dc4-3b4a-11ef-94bc-2a93761010b8'; // D1

  const coach_elos: CoachElos = await useServerAPI({
    class: 'coach_elo',
    function: 'read',
    arguments: {
      organization_id,
      division_id,
      coach_id,
    },
  }, { revalidate: revalidateSeconds });

  const games: Games = await useServerAPI({
    class: 'game',
    function: 'read',
    arguments: {
      game_id: Object.values(coach_elos).map((row: CoachElo) => row.game_id),
    },
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client coach_elos = {coach_elos} games = {games} />
    </>
  );
};

export default Server;
