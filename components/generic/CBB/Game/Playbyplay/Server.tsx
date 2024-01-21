'use server';
import React from 'react';

import Client from '@/components/generic/CBB/Game/Playbyplay/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async({cbb_game}) => {
  // const tag = 'cbb.games.' + cbb_game.cbb_game_id;

  const cbb_game_id = cbb_game.cbb_game_id;
  const revalidateSeconds = 30;

  const cbb_game_pbp = await useServerAPI({
    'class': 'cbb_game_pbp',
    'function': 'read',
    'arguments': {
      'cbb_game_id': cbb_game_id
    },
  }, {revalidate: revalidateSeconds});

  return (
    <>
      <Client cbb_game_pbp = {cbb_game_pbp} />
    </>
  );
}

export default Server;
