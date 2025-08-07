'use server';

import { Client } from '@/components/generic/Compare/Contents/Player/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async ({ organization_id, division_id, home_team_id, away_team_id, season }) => {
  const revalidateSeconds = 3600; // 60 * 60; // 1 hour

  const { player_statistic_rankings, players } = await useServerAPI({
    class: 'team',
    function: 'getRosterStats',
    arguments: {
      organization_id,
      division_id,
      team_id: [away_team_id, home_team_id],
      season,
    },
    cache: revalidateSeconds,
  });


  return (
    <>
      <Client player_statistic_rankings = {player_statistic_rankings} players = {players} />
    </>
  );
};

export default Server;
