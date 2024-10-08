'use server';

import React from 'react';

import { Client } from '@/components/generic/Game/Odds/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async ({ game }) => {
  const { game_id } = game;
  const revalidateSeconds = 60 * 60; // 1 hour

  const oddsStats = await useServerAPI({
    class: 'game',
    function: 'getOddsStats',
    arguments: { game_id },
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client game = {game} oddsStats = {oddsStats} />
    </>
  );
};

export default Server;
