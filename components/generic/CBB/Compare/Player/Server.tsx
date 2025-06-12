'use server';

import { Client } from '@/components/generic/CBB/Compare/Player/Client';
import { useServerAPI } from '@/components/serverAPI';
import Objector from '@/components/utils/Objector';

const Server = async ({ home_team_id, away_team_id, teams, season }) => {
  const revalidateSeconds = 3600; // 60 * 60; // 1 hour

  const organization_id = 'f1c37c98-3b4c-11ef-94bc-2a93761010b8'; // NCAAM Basketball
  const division_id = 'bf602dc4-3b4a-11ef-94bc-2a93761010b8'; // D1

  // Nextjs secretly does not let you modify these objects. They mark them as read only >.>
  const teamsCloned = Objector.deepClone(teams);

  if (home_team_id && home_team_id in teamsCloned) {
    teamsCloned[home_team_id].playerStats = await useServerAPI({
      class: 'team',
      function: 'getRosterStats',
      arguments: {
        organization_id,
        division_id,
        team_id: home_team_id,
        season,
      },
      cache: revalidateSeconds,
    });
  }

  if (away_team_id && away_team_id in teamsCloned) {
    teamsCloned[away_team_id].playerStats = await useServerAPI({
      class: 'team',
      function: 'getRosterStats',
      arguments: {
        organization_id,
        division_id,
        team_id: away_team_id,
        season,
      },
      cache: revalidateSeconds,
    });
  }

  return (
    <>
      <Client teams = {teamsCloned} />
    </>
  );
};

export default Server;
