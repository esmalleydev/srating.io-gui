'use server';

import React from 'react';

import { Client } from '@/components/generic/CBB/Game/Odds/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async ({ cbb_game }) => {
  // const tag = 'cbb.games.'+ cbb_game_id;

  const { cbb_game_id } = cbb_game;
  const revalidateSeconds = 60 * 60; // 1 hour

  const oddsStats = await useServerAPI({
    class: 'cbb_game',
    function: 'getOddsStats',
    arguments: cbb_game_id,
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client cbb_game = {cbb_game} oddsStats = {oddsStats} />
    </>
  );
};

export default Server;
