'use server';

import React from 'react';

import { Client } from '@/components/generic/CBB/Game/Momentum/Client';
import { useServerAPI } from '@/components/serverAPI';


const Server = async ({ game }) => {
  // const tag = 'cbb.games.'+ game_id;

  const { game_id } = game;
  const revalidateSeconds = 3600; // 60 * 60; // 1 hour

  const momentumData = await useServerAPI({
    class: 'game',
    function: 'getMomentumData',
    arguments: game_id,
  }, { revalidate: revalidateSeconds });

  const stats = await useServerAPI({
    class: 'game',
    function: 'getStats',
    arguments: {
      game_id,
    },
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client game = {game} momentumData = {momentumData} stats = {stats} />
    </>
  );
};

export default Server;
