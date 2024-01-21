import { useServerAPI } from '@/components/serverAPI';
import PlayerPage from './player-page';
import { Metadata, ResolvingMetadata } from 'next';
import { unstable_noStore } from 'next/cache';

type Props = {
  params: { team_id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const player: any = await getData(params);

  const name = player.first_name + ' ' + player.last_name;

  return {
    title: 'sRating | ' + name,
    description: name + ' statistics',
    openGraph: {
      title: name,
      description: name + ' statistics',
    },
    twitter: {
      card: 'summary',
      title: name,
      description: name + ' statistics'
    }
  };
};


async function getData(params) {
  unstable_noStore();
  const revalidateSeconds = 300; // 60 * 5; // cache for 5 mins
  const player_id = params.player_id;

  const player = await useServerAPI({
    'class': 'player',
    'function': 'getCBBPlayer',
    'arguments': {
      'player_id': player_id,
    }
  }, {revalidate: revalidateSeconds});

  return player;
};


export default async function Page({ params }) {
  const data = await getData(params);
  return <PlayerPage player = {data} />;
};
