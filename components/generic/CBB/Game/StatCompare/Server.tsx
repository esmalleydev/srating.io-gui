'use server';
import React from 'react';

import Client from '@/components/generic/CBB/Game/StatCompare/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async({cbb_game}) => {
  // const tag = 'cbb.games.'+ cbb_game_id;

  const cbb_game_id = cbb_game.cbb_game_id;
  const revalidateSeconds = 3600; // 60 * 60; // 1 hour

  const rankings = await useServerAPI({
    'class': 'cbb_game',
    'function': 'getTrendsRankings',
    'arguments': {
      'cbb_game_id': cbb_game_id
    },
  }, { revalidate: revalidateSeconds});

  return (
    <>
      <Client cbb_game = {cbb_game} rankings = {rankings} />
    </>
  );
}

export default Server;
