'use server';
import React from 'react';

import Client from '@/components/generic/CBB/Game/PreviousMatchups/Client';
import Api from '@/components/Api.jsx';

const api = new Api();

const Server = async({cbb_game}) => {
  // const tag = 'cbb.games.'+ cbb_game_id;

  const cbb_game_id = cbb_game.cbb_game_id;
  const revalidateSeconds = 60 * 60; // 1 hour

  const previousMatchups = await api.Request({
    'class': 'cbb_game',
    'function': 'getPreviousMatchups',
    'arguments': cbb_game_id,
  }, {next: { revalidate: revalidateSeconds}});

  return (
    <>
      <Client cbb_game = {cbb_game} previousMatchups = {previousMatchups} />
    </>
  );
}

export default Server;
