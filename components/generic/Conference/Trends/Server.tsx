'use server';

import { Client, TrendsType } from '@/components/generic/Conference/Trends/Client';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';


const Server = async ({ organization_id, conference_id, season }) => {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 12; // 12 hours

  const data: TrendsType = await useServerAPI({
    class: 'conference',
    function: 'getTrends',
    arguments: {
      organization_id,
      conference_id,
      season,
    },
  }, { revalidate: revalidateSeconds });

  return (
    <>
      <Client organization_id = {organization_id} conference_id = {conference_id} data = {data} />
    </>
  );
};

export default Server;
