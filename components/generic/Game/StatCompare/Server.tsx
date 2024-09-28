'use server';

import React from 'react';

import { Client } from '@/components/generic/Game/StatCompare/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async ({ game }) => {
  const { game_id } = game;
  const revalidateSeconds = 3600; // 60 * 60; // 1 hour

  const data = await useServerAPI({
    class: 'game',
    function: 'getTrendsRankings',
    arguments: {
      game_id,
    },
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client game = {game} statistic_rankings = {data.statistic_rankings} elos = {data.elos} />
    </>
  );
};

export default Server;
