'use server';
import React from 'react';

import StatsClient from '@/components/generic/CBB/Team/Stats/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';



const Server = async({season, team_id}) => {
  unstable_noStore();

  const revalidateSeconds = 60 * 30; // 30 mins

  const teamStats: object = await useServerAPI({
    'class': 'team',
    'function': 'getStats',
    'arguments': {
      'team_id': team_id,
      'season': season,
    },
  }, {revalidate: revalidateSeconds});

  const rosterStats: object = await useServerAPI({
    'class': 'team',
    'function': 'getRosterStats',
    'arguments': {
      'team_id': team_id,
      'season': season,
    },
  }, {revalidate: revalidateSeconds});

  return (
    <>
      <StatsClient teamStats = {teamStats} rosterStats = {rosterStats} />
    </>
  );
}

export default Server;
