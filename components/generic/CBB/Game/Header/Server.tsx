'use server';

import React from 'react';

import Client from '@/components/generic/CBB/Game/Header/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async ({ game_id }) => {
  const tag = `cbb.games.${game_id}`;

  const game = await useServerAPI({
    class: 'game',
    function: 'get',
    arguments: {
      game_id,
    },
  }, { revalidate: 30 });

  return (
    <>
      <Client game = {game} tag = {tag} />
    </>
  );
};

export default Server;
