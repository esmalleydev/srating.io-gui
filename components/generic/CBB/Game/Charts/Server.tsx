'use server';
import React from 'react';

import Client from '@/components/generic/CBB/Game/Charts/Client';
import Api from '@/components/Api.jsx';

const api = new Api();

const Server = async({cbb_game}) => {
  // const tag = 'cbb.games.'+ cbb_game_id;

  const cbb_game_id = cbb_game.cbb_game_id;
  const revalidateSeconds = 30;

  const cbb_game_score_intervals = await api.Request({
    'class': 'cbb_game_score_interval',
    'function': 'read',
    'arguments': {'cbb_game_id': cbb_game_id}
  }, {next: { revalidate: revalidateSeconds}});


  return (
    <>
      <Client cbb_game = {cbb_game} cbb_game_score_intervals = {cbb_game_score_intervals} />
    </>
  );
}

export default Server;
