'use server';

import React from 'react';

import { Client } from '@/components/generic/CBB/Game/Charts/Client';
import { useServerAPI } from '@/components/serverAPI';
import { GamePulses, Oddsz } from '@/types/cbb';

const Server = async ({ game }) => {
  const tag = `cbb.games.${game.game_id}`;

  const { game_id } = game;
  const revalidateSeconds = 30;

  const game_pulses: GamePulses = await useServerAPI({
    class: 'game_pulse',
    function: 'read',
    arguments: { game_id },
  }, { revalidate: revalidateSeconds });

  const odds: Oddsz = await useServerAPI({
    class: 'odds',
    function: 'read',
    arguments: {
      odds_id: Object.values(game_pulses).map((row) => row.odds_id),
    },
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client game = {game} game_pulses = {game_pulses} odds = {odds} />
    </>
  );
};

export default Server;
