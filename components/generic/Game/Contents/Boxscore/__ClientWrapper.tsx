/*'use client';

import { Suspense, useState } from 'react';
import { Client, ClientSkeleton } from './Client';
import { useClientAPI } from '@/components/clientAPI';
import { Boxscore as BoxscoreCBB, PlayerBoxscores} from '@/types/cbb';
import { Boxscore as BoxscoreCFB } from '@/types/cfb';

const load = async ({ game_id, organization_id, division_id }) => {
  const revalidateSeconds = 30;

  const boxscores: BoxscoreCBB[] | BoxscoreCFB[] = await useClientAPI({
    class: 'boxscore',
    function: 'readBoxscore',
    arguments: { game_id, organization_id, division_id },
    cache: revalidateSeconds,
  });

  const player_boxscores: PlayerBoxscores = await useClientAPI({
    class: 'player_boxscore',
    function: 'readPlayerBoxscore',
    arguments: { game_id, organization_id, division_id },
    cache: revalidateSeconds,
  });

  const players_ids = Object.values(player_boxscores).filter((player_boxscore) => (player_boxscore.player_id)).map((player_boxscore) => player_boxscore.player_id);

  let players = {};

  if (players_ids.length) {
    players = await useClientAPI({
      class: 'player',
      function: 'read',
      arguments: { player_id: players_ids },
      cache: revalidateSeconds,
    });
  }

  return { boxscores, player_boxscores, players };
};

const ClientWrapper = ({ game }) => {
  const { game_id, organization_id, division_id } = game;

  const [requested, setRequested] = useState(false);
  const [data, setData] = useState(null);

  if (!requested) {
    setRequested(true);
    load({ game_id, organization_id, division_id })
      .then((response) => {
        console.log(response)
        setData(response || {});
      }).catch((e) => {
        setData({});
      });
  }

  return (
    <div>
      <Suspense fallback = {<ClientSkeleton />}>
        <Client game = {game} boxscores = {data?.boxscores} player_boxscores = {player_boxscores} players = {players} />
      </Suspense>
    </div>
  );
};

export default ClientWrapper;
*/
