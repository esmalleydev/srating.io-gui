'use server';
import React from 'react';

import HeaderClient from '@/components/generic/CBB/Team/Header/HeaderClient';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';



const HeaderServer = async({season, team_id}) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 2; // 2 hours

  const team = await useServerAPI({
    'class': 'team',
    'function': 'loadTeam',
    'arguments': {
      'team_id': team_id,
      'season': season,
    },
  }, {revalidate: revalidateSeconds});

  return (
    <>
      <HeaderClient team = {team} season = {season} />
    </>
  );
}

export default HeaderServer;
