'use server';

import React from 'react';

import { Client } from '@/components/generic/Game/Contents/Charts/Client';
import { useServerAPI } from '@/components/serverAPI';
import { GamePulses, Oddsz } from '@/types/general';

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

  return (
    <>
      <Client game = {game} game_pulses = {game_pulses} odds = {odds} />
    </>
  );
};

export default Server;
