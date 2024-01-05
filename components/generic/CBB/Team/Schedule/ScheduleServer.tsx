'use server';
import React from 'react';

import ScheduleClient from '@/components/generic/CBB/Team/Schedule/ScheduleClient';
import Api from '@/components/Api.jsx';
import { headers } from 'next/headers';

const api = new Api();


const ScheduleServer = async({season, team_id}) => {

  const schedule: object = await api.Request({
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
