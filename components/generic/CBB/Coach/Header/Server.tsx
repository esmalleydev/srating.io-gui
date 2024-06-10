'use server';
import React from 'react';

import HeaderClient from '@/components/generic/CBB/Coach/Header/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';

// need to retro cbb_coach_statistic_ranking
// look at bruce weber, his record is 0-0
// then after retro add to the ranking page a toggle to show all time coaches (not active) etc filters

// check api users to see how many I have


const Server = async({season, coach_id}) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 2; // 2 hours

  const cbb_coach_statistic_rankings = await useServerAPI({
    'class': 'cbb_coach_statistic_ranking',
    'function': 'read',
    'arguments': {
      'coach_id': coach_id,
      'current': '1'
    },
  }, {revalidate: revalidateSeconds});

  console.log(cbb_coach_statistic_rankings)


  return (
    <>
      <HeaderClient cbb_coach_statistic_rankings = {cbb_coach_statistic_rankings} season = {season} />
    </>
  );
}

export default Server;
