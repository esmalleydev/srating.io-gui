'use server';
import React from 'react';

import Client from '@/components/generic/CBB/Game/Odds/Client';
import Api from '@/components/Api.jsx';

const api = new Api();

const Server = async({cbb_game}) => {
  // const tag = 'cbb.games.'+ cbb_game_id;

  const cbb_game_id = cbb_game.cbb_game_id;
  const revalidateSeconds = 60 * 60; // 1 hour

  const oddsStats = await api.Request({
    'class': 'cbb_game',
    'function': 'getOddsStats',
    'arguments': cbb_game_id,
  }, {next: { revalidate: revalidateSeconds}});

  return (
    <>
      <Client cbb_game = {cbb_game} oddsStats = {oddsStats} />
    </>
  );
}

export default Server;
