'use server';
import React from 'react';

import ScheduleClient from '@/components/generic/CBB/Team/Schedule/ScheduleClient';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';



const ScheduleServer = async({season, team_id}) => {
  unstable_noStore();
  const schedule: object = await useServerAPI({
    'class': 'team',
    'function': 'getSchedule',
    'arguments': {
      'team_id': team_id,
      'season': season,
    },
  });

  return (
    <>
      <ScheduleClient schedule = {schedule} team_id = {team_id} />
    </>
  );
}

export default ScheduleServer;
