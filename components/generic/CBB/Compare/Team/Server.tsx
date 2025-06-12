'use server';

import { useServerAPI } from '@/components/serverAPI';
import { Client } from './Client';
import Objector from '@/components/utils/Objector';

const Server = async ({ home_team_id, away_team_id, season, teams, subview }) => {
  const revalidateSeconds = 3600; // 60 * 60; // 1 hour

  const organization_id = 'f1c37c98-3b4c-11ef-94bc-2a93761010b8'; // NCAAM Basketball
  const division_id = 'bf602dc4-3b4a-11ef-94bc-2a93761010b8'; // D1

  // Nextjs secretly does not let you modify these objects. They mark them as read only >.>
  const teamsCloned = Objector.deepClone(teams);

  if (home_team_id && home_team_id in teamsCloned) {
    teamsCloned[home_team_id].stats = await useServerAPI({
      class: 'team',
      function: 'getStats',
      arguments: {
        organization_id,
        division_id,
        team_id: home_team_id,
        season,
      },
      cache: revalidateSeconds,
    });

    teamsCloned[home_team_id].elo = await useServerAPI({
      class: 'elo',
      function: 'get',
      arguments: {
        organization_id,
        division_id,
        team_id: home_team_id,
        season,
        current: '1',
      },
      cache: revalidateSeconds,
    });
  }

  if (away_team_id && away_team_id in teamsCloned) {
    teamsCloned[away_team_id].stats = await useServerAPI({
      class: 'team',
      function: 'getStats',
      arguments: {
        organization_id,
        division_id,
        team_id: away_team_id,
        season,
      },
      cache: revalidateSeconds,
    });


    teamsCloned[away_team_id].elo = await useServerAPI({
      class: 'elo',
      function: 'get',
      arguments: {
        organization_id,
        division_id,
        team_id: away_team_id,
        season,
        current: '1',
      },
      cache: revalidateSeconds,
    });
  }

  return (
    <>
      <Client organization_id = {organization_id} division_id = {division_id} home_team_id={home_team_id} away_team_id={away_team_id} teams={teamsCloned} season={season} subview={subview} />
    </>
  );
};

export default Server;
