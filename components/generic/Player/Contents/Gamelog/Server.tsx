'use server';

import { Client } from '@/components/generic/Player/Contents/Gamelog/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async ({ organization_id, division_id, seasons, player_id }) => {
  const revalidateSeconds = 60 * 60 * 6; // 6 hours

  const gamelogs = await useServerAPI({
    class: 'player',
    function: 'getGameLogs',
    arguments: {
      organization_id,
      division_id,
      season: seasons,
      player_id,
    },
    cache: revalidateSeconds,
  });



  return (
    <>
      <Client organization_id={organization_id} gamelogs = {gamelogs} />
    </>
  );
};

export default Server;
