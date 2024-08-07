'use server';

import React from 'react';

import Client from '@/components/generic/CBB/Game/Header/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async ({ cbb_game_id }) => {
  const tag = `cbb.games.${cbb_game_id}`;

  const cbb_game = await useServerAPI({
    class: 'cbb_game',
    function: 'get',
    arguments: {
      cbb_game_id,
    },
  }, { revalidate: 30 });

  return (
    <>
      <Client cbb_game = {cbb_game} tag = {tag} />
    </>
  );
};

export default Server;
