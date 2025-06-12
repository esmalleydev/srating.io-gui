'use server';

import { Client } from '@/components/generic/Coach/Contents/Trends/Client';
import { useServerAPI } from '@/components/serverAPI';
import { CoachElo, CoachElos, Games } from '@/types/general';

const Server = async ({ organization_id, division_id, coach_id }) => {
  const revalidateSeconds = 60 * 60 * 2; // 2 hours

  const coach_elos: CoachElos = await useServerAPI({
    class: 'coach_elo',
    function: 'read',
    arguments: {
      organization_id,
      division_id,
      coach_id,
    },
    cache: revalidateSeconds,
  });

  const games: Games = await useServerAPI({
    class: 'game',
    function: 'read',
    arguments: {
      game_id: Object.values(coach_elos).map((row: CoachElo) => row.game_id),
    },
    cache: revalidateSeconds,
  });

  return (
    <>
      <Client coach_elos = {coach_elos} games = {games} />
    </>
  );
};

export default Server;
