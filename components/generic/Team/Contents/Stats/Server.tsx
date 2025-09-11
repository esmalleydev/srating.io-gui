'use server';

import { Client } from '@/components/generic/Team/Contents/Stats/Client';
import { useServerAPI } from '@/components/serverAPI';
import { StatisticRanking as CBBStatisticRanking } from '@/types/cbb';
import { StatisticRanking as CFBStatisticRanking } from '@/types/cfb';

const Server = async ({ organization_id, division_id, season, team_id }) => {
  const revalidateSeconds = 60 * 30; // 30 mins

  const teamStats: CBBStatisticRanking | CFBStatisticRanking = await useServerAPI({
    class: 'team',
    function: 'getStats',
    arguments: {
      organization_id,
      division_id,
      team_id,
      season,
    },
    cache: revalidateSeconds,
  });

  const rosterStats: object = await useServerAPI({
    class: 'team',
    function: 'getRosterStats',
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
      <Client organization_id = {organization_id} division_id = {division_id} season = {season} teamStats = {teamStats} rosterStats = {rosterStats} />
    </>
  );
};

export default Server;
