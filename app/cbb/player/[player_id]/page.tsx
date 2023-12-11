import PlayerPage from './player-page';
import { Metadata, ResolvingMetadata } from 'next';

import Api from '../../../../components/Api.jsx';

const api = new Api();

type Props = {
  params: { team_id: string };
};


export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const player = await getData(params);

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
  const seconds = 60 * 5; // cache for 5 mins

  const player_id = params.player_id;

  const player = await api.Request({
    'class': 'player',
    'function': 'getCBBPlayer',
    'arguments': {
      'player_id': player_id,
    }
  },
  {next : {revalidate: seconds}});

  return player;
};


export default async function Page({ params }) {
  const data = await getData(params);
  return <PlayerPage player = {data} />;
};
