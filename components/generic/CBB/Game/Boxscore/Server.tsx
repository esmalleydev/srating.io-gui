'use server';

import React from 'react';

import { Client } from '@/components/generic/CBB/Game/Boxscore/Client';
import { useServerAPI } from '@/components/serverAPI';
import { Boxscores, PlayerBoxscores } from '@/types/cbb';

const Server = async ({ game }) => {
  const tag = `cbb.games.${game.game_id}`;

  const { game_id } = game;
  const revalidateSeconds = 30;
  const organization_id = 'f1c37c98-3b4c-11ef-94bc-2a93761010b8'; // NCAAM Basketball
  const division_id = 'bf602dc4-3b4a-11ef-94bc-2a93761010b8'; // D1

  const boxscores: Boxscores = await useServerAPI({
    class: 'boxscore',
    function: 'readBoxscore',
    arguments: { game_id, organization_id, division_id },
  }, { revalidate: revalidateSeconds });

  const player_boxscores: PlayerBoxscores = await useServerAPI({
    class: 'player_boxscore',
    function: 'readPlayerBoxscore',
    arguments: { game_id, organization_id, division_id },
  }, { revalidate: revalidateSeconds });

  const players_ids = Object.values(player_boxscores).filter((player_boxscore) => (player_boxscore.player_id)).map((player_boxscore) => player_boxscore.player_id);

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
      <Client game = {game} boxscores = {boxscores} player_boxscores = {player_boxscores} players = {players} />
    </>
  );
};

export default Server;
