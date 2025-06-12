'use server';

import { Client } from '@/components/generic/Coach/Header/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async ({ organization_id, division_id, season, coach_id }) => {
  const revalidateSeconds = 60 * 60 * 2; // 2 hours

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
    cache: revalidateSeconds,
  });


  return (
    <>
      <Client organization_id={organization_id} division_id={division_id} coach_statistic_rankings = {coach_statistic_rankings} season = {season} />
    </>
  );
};

export default Server;
