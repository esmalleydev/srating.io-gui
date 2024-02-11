'use server';
import React from 'react';

import ScheduleClient from '@/components/generic/CBB/Team/Schedule/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';



const Server = async({season, team_id}) => {
  unstable_noStore();

  const revalidateSeconds = 60;

  const cbb_games: object = await useServerAPI({
    'class': 'team',
    'function': 'getSchedule',
    'arguments': {
      'team_id': team_id,
      'season': season,
    },
  }, {revalidate: revalidateSeconds});

  return (
    <>
      <ScheduleClient cbb_games = {cbb_games} team_id = {team_id} />
    </>
  );
}

export default Server;
