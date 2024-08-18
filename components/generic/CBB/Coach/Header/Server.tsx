'use server';

import React from 'react';

import { Client } from '@/components/generic/CBB/Coach/Header/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';



const Server = async ({ season, coach_id }) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 2; // 2 hours

  const organization_id = 'f1c37c98-3b4c-11ef-94bc-2a93761010b8'; // NCAAM Basketball
  const division_id = 'bf602dc4-3b4a-11ef-94bc-2a93761010b8'; // D1

  // only add season here if you add a season picker in the gui. ex: the season might be 2024 but bruce weber stopped in 2022, so his data would be not get grabbed
  const coach_statistic_rankings = await useServerAPI({
    class: 'coach_statistic_ranking',
    function: 'readStats',
    arguments: {
      organization_id,
      division_id,
      coach_id,
      current: '1',
    },
  }, { revalidate: revalidateSeconds });


  return (
    <>
      <Client coach_statistic_rankings = {coach_statistic_rankings} season = {season} />
    </>
  );
};

export default Server;
