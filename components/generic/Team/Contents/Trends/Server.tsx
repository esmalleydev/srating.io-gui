'use server';

import { Client, TrendsType } from '@/components/generic/Team/Contents/Trends/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async ({ organization_id, division_id, team_id, season }) => {
  const revalidateSeconds = 60 * 60 * 6; // 6 hours

  const data: TrendsType = await useServerAPI({
    class: 'team',
    function: 'getTrends',
    arguments: {
      organization_id,
      division_id,
      team_id,
      season,
    },
    cache: revalidateSeconds,
  });

  return (
    <>
      <Client organization_id = {organization_id} division_id = {division_id} season = {season} data = {data} />
    </>
  );
};

export default Server;
