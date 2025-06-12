'use server';

import { Client } from '@/components/generic/Game/Contents/Playbyplay/Client';
import { useServerAPI } from '@/components/serverAPI';

const Server = async ({ game }) => {
  // const tag = 'cbb.games.' + game.game_id;

  const { game_id } = game;
  const revalidateSeconds = 30;

  const play_by_plays = await useServerAPI({
    class: 'play_by_play',
    function: 'readPlaybyPlay',
    arguments: {
      game_id,
    },
    cache: revalidateSeconds,
  });

  return (
    <>
      <Client play_by_plays = {play_by_plays} />
    </>
  );
};

export default Server;
