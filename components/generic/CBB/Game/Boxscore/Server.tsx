'use server';
import React from 'react';

import Client from '@/components/generic/CBB/Game/Boxscore/Client';
import Api from '@/components/Api.jsx';

const api = new Api();

const Server = async({cbb_game}) => {
  const tag = 'cbb.games.' + cbb_game.cbb_game_id;

  const cbb_game_id = cbb_game.cbb_game_id;
  const revalidateSeconds = 30;

  const cbb_boxscores: object = await api.Request({
    'class': 'cbb_boxscore',
    'function': 'read',
    'arguments': {'cbb_game_id': cbb_game_id}
  }, {next: { tags: [tag], revalidate: revalidateSeconds}});

  const cbb_player_boxscores: object = await api.Request({
    'class': 'cbb_player_boxscore',
    'function': 'read',
    'arguments': {'cbb_game_id': cbb_game_id}
  }, {next: { tags: [tag], revalidate: revalidateSeconds}});
      
  const players_ids = Object.values(cbb_player_boxscores).filter(cbb_player_boxscore => (cbb_player_boxscore.player_id)).map(cbb_player_boxscore => cbb_player_boxscore.player_id);
      
  let players = {};
      
  if (players_ids.length) {
    players = await api.Request({
      'class': 'player',
      'function': 'read',
      'arguments': {'player_id': players_ids}
    }, {next: { revalidate: revalidateSeconds}});
  }

  return (
    <>
      <Client cbb_game = {cbb_game} cbb_boxscores = {cbb_boxscores} cbb_player_boxscores = {cbb_player_boxscores} players = {players} />
    </>
  );
}

export default Server;
