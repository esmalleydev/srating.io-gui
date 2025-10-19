'use server';

import { Client } from '@/components/generic/Team/Contents/Stats/Client';
import { useServerAPI } from '@/components/serverAPI';
import { StatisticRanking as CBBStatisticRanking } from '@/types/cbb';
import { StatisticRanking as CFBStatisticRanking } from '@/types/cfb';
import { Players } from '@/types/general';

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

  type RosterStats = {
    players: Players,
    player_statistic_rankings: object,
  }

  const rosterStats: RosterStats = await useServerAPI({
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

  let player_ids: string[] = [];

  if (rosterStats && 'players' in rosterStats) {
    player_ids = Object.keys(rosterStats.players);
  }

  const player_team_seasons = await useServerAPI({
    class: 'player_team_season',
    function: 'read',
    arguments: {
      organization_id,
      player_id: player_ids,
    },
    cache: revalidateSeconds,
  });

  return (
    <>
      <Client organization_id = {organization_id} division_id = {division_id} season = {season} teamStats = {teamStats} rosterStats = {rosterStats} player_team_seasons = {player_team_seasons} />
    </>
  );
};

export default Server;
