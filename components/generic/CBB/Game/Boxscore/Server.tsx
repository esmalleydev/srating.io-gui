'use server';

import React from 'react';

import { Client } from '@/components/generic/CBB/Game/Boxscore/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async ({ cbb_game }) => {
  const tag = `cbb.games.${cbb_game.cbb_game_id}`;

  const { cbb_game_id } = cbb_game;
  const revalidateSeconds = 30;

  const cbb_boxscores: object = await useServerAPI({
    class: 'cbb_boxscore',
    function: 'read',
    arguments: { cbb_game_id },
  }, { revalidate: revalidateSeconds });

  const cbb_player_boxscores: object = await useServerAPI({
    class: 'cbb_player_boxscore',
    function: 'read',
    arguments: { cbb_game_id },
  }, { revalidate: revalidateSeconds });

  const players_ids = Object.values(cbb_player_boxscores).filter((cbb_player_boxscore) => (cbb_player_boxscore.player_id)).map((cbb_player_boxscore) => cbb_player_boxscore.player_id);

  let players = {};

  if (players_ids.length) {
    players = await useServerAPI({
      class: 'player',
      function: 'read',
      arguments: { player_id: players_ids },
    }, { revalidate: revalidateSeconds });
  }

  return (
    <>
      <Client cbb_game = {cbb_game} cbb_boxscores = {cbb_boxscores} cbb_player_boxscores = {cbb_player_boxscores} players = {players} />
    </>
  );
};

export default Server;
