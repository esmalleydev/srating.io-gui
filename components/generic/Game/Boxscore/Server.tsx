'use server';

import { Client } from '@/components/generic/Game/Boxscore/Client';
import { useServerAPI } from '@/components/serverAPI';
import { Boxscore as BoxscoreCBB, PlayerBoxscores } from '@/types/cbb';
import { Boxscore as BoxscoreCFB } from '@/types/cfb';
import { Game } from '@/types/general';

const Server = async (
  { game }:
  { game: Game },
) => {
  const { game_id, organization_id, division_id } = game;
  const revalidateSeconds = 30;

  const boxscores: BoxscoreCBB[] | BoxscoreCFB[] = await useServerAPI({
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
