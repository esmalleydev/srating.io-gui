'use server';
import React from 'react';

import Client from '@/components/generic/CBB/Game/Matchup/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async({cbb_game}) => {
  // const tag = 'cbb.games.'+ cbb_game_id;

  const cbb_game_id = cbb_game.cbb_game_id;
  const revalidateSeconds = 3600; // 60 * 60; // 1 hour

  const stats = await useServerAPI({
    'class': 'cbb_game',
    'function': 'getStats',
    'arguments': {
      'cbb_game_id': cbb_game_id
    },
  }, {revalidate: revalidateSeconds});

  const rankings = await useServerAPI({
    'class': 'cbb_game',
    'function': 'getRankings',
    'arguments': {
      'cbb_game_id': cbb_game_id
    },
  }, {revalidate: revalidateSeconds});

  const elo = await useServerAPI({
    'class': 'cbb_game',
    'function': 'getElos',
    'arguments': {
      'cbb_game_id': cbb_game_id
    },
  }, {revalidate: revalidateSeconds});

  return (
    <>
      <Client cbb_game = {cbb_game} stats = {stats} rankings = {rankings} elo = {elo} />
    </>
  );
}

export default Server;
