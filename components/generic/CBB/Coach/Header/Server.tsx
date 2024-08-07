'use server';

import React from 'react';

import { Client } from '@/components/generic/CBB/Coach/Header/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';



const Server = async ({ season, coach_id }) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 2; // 2 hours

  // only add season here if you add a season picker in the gui. ex: the season might be 2024 but bruce weber stopped in 2022, so his data would be not get grabbed
  const cbb_coach_statistic_rankings = await useServerAPI({
    class: 'cbb_coach_statistic_ranking',
    function: 'read',
    arguments: {
      coach_id,
      current: '1',
    },
  }, { revalidate: revalidateSeconds });


  return (
    <>
      <Client cbb_coach_statistic_rankings = {cbb_coach_statistic_rankings} season = {season} />
    </>
  );
};

export default Server;
