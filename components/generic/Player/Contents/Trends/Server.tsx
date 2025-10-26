'use server';

import { useServerAPI } from '@/components/serverAPI';
import { Client, TrendsType } from './Client';

const Server = async ({ organization_id, division_id, player_id, season, trendsSeasons }) => {
  const revalidateSeconds = 60 * 60 * 6; // 6 hours

  const s = trendsSeasons || season;

  const data: TrendsType = await useServerAPI({
    class: 'player',
    function: 'getTrends',
    arguments: {
      organization_id,
      division_id,
      player_id,
      season: s,
    },
    cache: revalidateSeconds,
  });

  return (
    <>
      <Client organization_id = {organization_id} division_id = {division_id} season = {season} player_id = {player_id} data = {data} />
    </>
  );
};

export default Server;
