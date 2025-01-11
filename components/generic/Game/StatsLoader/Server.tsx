'use server';

import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { Client } from './Client';

const Server = async (
  { game_ids, coach_ids, organization_id, division_id }:
  { game_ids: string[]; coach_ids: string[]; organization_id: string; division_id: string; },
) => {
  unstable_noStore();

  const revalidateSeconds = 60 * 60 * 12; // 12 hours

  const gameStats: object = await useServerAPI({
    class: 'game',
    function: 'getAllStats',
    arguments: {
      organization_id,
      division_id,
      game_ids,
    },
  }, { revalidate: revalidateSeconds });


  const coachStats: object = await useServerAPI({
    class: 'coach',
    function: 'getAllStats',
    arguments: {
      organization_id,
      division_id,
      game_ids,
      coach_ids,
    },
  }, { revalidate: revalidateSeconds });

  const conferenceStats: object = await useServerAPI({
    class: 'conference',
    function: 'getAllStats',
    arguments: {
      organization_id,
      division_id,
      game_ids,
    },
  }, { revalidate: revalidateSeconds });


  return (
    <>
      <Client gameStats={gameStats} coachStats = {coachStats} conferenceStats = {conferenceStats} />
    </>
  );
};

export default Server;
