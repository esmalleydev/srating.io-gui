'use server';

import Client from '@/components/generic/Picks/Stats/Client';
import { useServerAPI } from '@/components/serverAPI';


const Server = async ({ organization_id, division_id, date, season }) => {
  const revalidateSeconds = 60 * 5; // cache for 5 mins

  const stats = await useServerAPI({
    class: 'odds',
    function: 'getStatsData',
    arguments: {
      organization_id,
      division_id,
      date,
      season,
    },
    cache: revalidateSeconds,
  });

  return (
    <>
      <Client stats = {stats} date = {date} />
    </>
  );
};

export default Server;
