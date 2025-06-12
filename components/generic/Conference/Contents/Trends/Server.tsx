'use server';

import { Client, TrendsType } from '@/components/generic/Conference/Contents/Trends/Client';
import { useServerAPI } from '@/components/serverAPI';


const Server = async ({ organization_id, conference_id, season }) => {
  const revalidateSeconds = 60 * 60 * 12; // 12 hours

  const data: TrendsType = await useServerAPI({
    class: 'conference',
    function: 'getTrends',
    arguments: {
      organization_id,
      conference_id,
      season,
    },
    cache: revalidateSeconds,
  });

  return (
    <>
      <Client organization_id = {organization_id} conference_id = {conference_id} data = {data} />
    </>
  );
};

export default Server;
