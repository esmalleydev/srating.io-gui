'use server';
import React from 'react';

import Client from '@/components/generic/CBB/Game/PreviousMatchups/Client';
import { useServerAPI } from '@/components/serverAPI';
import { gamesDataType } from '@/components/generic/types';

const Server = async({cbb_game}) => {
  // const tag = 'cbb.games.'+ cbb_game_id;

  const cbb_game_id = cbb_game.cbb_game_id;
  const revalidateSeconds = 3600; // 60 * 60; // 1 hour

  const previousMatchups: gamesDataType | any = await useServerAPI({
    'class': 'cbb_game',
    'function': 'getPreviousMatchups',
    'arguments': {
      'cbb_game_id': cbb_game_id,
      'limit': 10,
    },
  }, { revalidate: revalidateSeconds});

  return (
    <>
      <Client cbb_game = {cbb_game} previousMatchups = {previousMatchups} />
    </>
  );
}

export default Server;
