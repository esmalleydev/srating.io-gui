'use server';

import { Client } from '@/components/generic/Game/Contents/Charts/Client';
import { useServerAPI } from '@/components/serverAPI';
import { GamePlayers, GamePulses, Oddsz, Players } from '@/types/general';

const Server = async ({ game }) => {
  const { game_id } = game;
  const revalidateSeconds = 30;

  const game_pulses: GamePulses = await useServerAPI({
    class: 'game_pulse',
    function: 'read',
    arguments: { game_id },
    cache: revalidateSeconds,
  });

  const odds: Oddsz = await useServerAPI({
    class: 'odds',
    function: 'read',
    arguments: {
      odds_id: Object.values(game_pulses).map((row) => row.odds_id),
    },
    cache: revalidateSeconds,
  });

  const game_players: GamePlayers = await useServerAPI({
    class: 'game_player',
    function: 'read',
    arguments: { game_id },
    cache: revalidateSeconds,
  });

  const players: Players = await useServerAPI({
    class: 'player',
    function: 'read',
    arguments: {
      player_id: Object.values(game_players).map((r) => r.player_id),
    },
    cache: revalidateSeconds,
  });

  return (
    <>
      <Client game = {game} game_pulses = {game_pulses} odds = {odds} game_players = {game_players} players = {players} />
    </>
  );
};

export default Server;
