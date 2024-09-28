'use server';

import React from 'react';

import Client from '@/components/generic/Game/Header/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async ({ game_id }) => {
  const game = await useServerAPI({
    class: 'game',
    function: 'get',
    arguments: {
      game_id,
    },
  }, { revalidate: 30 });

  const tag = `games.${game_id}`;

  return (
    <>
      <Client game = {game} tag = {tag} />
    </>
  );
};

export default Server;
