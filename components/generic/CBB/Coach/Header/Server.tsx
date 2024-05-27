'use server';
import React from 'react';

import HeaderClient from '@/components/generic/CBB/Coach/Header/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';



const Server = async({season, coach_id}) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 2; // 2 hours

  const cbb_coach_statistic_ranking = await useServerAPI({
    'class': 'cbb_coach_statistic_ranking',
    'function': 'get',
    'arguments': {
      'coach_id': coach_id,
      'season': season,
      'current': '1'
    },
  }, {revalidate: revalidateSeconds});


  return (
    <>
      <HeaderClient cbb_coach_statistic_ranking = {cbb_coach_statistic_ranking} season = {season} />
    </>
  );
}

export default Server;
