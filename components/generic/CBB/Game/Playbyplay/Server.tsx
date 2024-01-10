'use server';
import React from 'react';

import Client from '@/components/generic/CBB/Game/Playbyplay/Client';
import Api from '@/components/Api.jsx';

const api = new Api();

const Server = async({cbb_game}) => {
  const tag = 'cbb.games.' + cbb_game.cbb_game_id;

  const cbb_game_id = cbb_game.cbb_game_id;
  const revalidateSeconds = 30;

  const cbb_game_pbp = await api.Request({
    'class': 'cbb_game_pbp',
    'function': 'read',
    'arguments': {
      'cbb_game_id': cbb_game_id
    },
  }, {next: { tags: [tag], revalidate: revalidateSeconds}});

  return (
    <>
      <Client cbb_game_pbp = {cbb_game_pbp} />
    </>
  );
}

export default Server;
