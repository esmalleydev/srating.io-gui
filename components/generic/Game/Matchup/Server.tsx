'use server';

import React from 'react';

import Client from '@/components/generic/Game/Matchup/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async ({ game }) => {
  const { game_id } = game;
  const revalidateSeconds = 3600; // 60 * 60; // 1 hour

  const elo = await useServerAPI({
    class: 'game',
    function: 'getElos',
    arguments: {
      game_id,
    },
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client game = {game} elo = {elo} />
    </>
  );
};

export default Server;
