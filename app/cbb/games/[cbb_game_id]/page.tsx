import GamePage from './game-page';
import { Metadata, ResolvingMetadata } from 'next';

import cacheData from 'memory-cache';

import HelperCBB from '@/components/helpers/CBB';
import Api from '@/components/Api.jsx';
import { revalidateTag } from 'next/cache';

const api = new Api();

type Props = {
  params: { cbb_game_id: string };
};


const revalidateSeconds = 0;

export const revalidate = revalidateSeconds;

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const cbb_game = await getData(params);

  const CBB = new HelperCBB({
    'cbb_game': cbb_game,
  });

  return {
    title: 'sRating | ' + CBB.getTeamName('away') + ' vs ' + CBB.getTeamName('home'),
    description: 'View predicted result, matchup, trends, odds',
    openGraph: {
      title: CBB.getTeamName('away') + ' vs ' + CBB.getTeamName('home'),
      description: 'View predicted result, matchup, trends, odds',
    },
    twitter: {
      card: 'summary',
      title: CBB.getTeamName('away') + ' vs ' + CBB.getTeamName('home'),
      description: 'View predicted result, matchup, trends, odds'
    }
  };
};

async function getData(params) {
  const cbb_games = await api.Request({
    'class': 'cbb_game',
    'function': 'getGamesFull',
    'arguments': {
      'cbb_game_id': params.cbb_game_id,
    }
  },
  {next : {revalidate: revalidateSeconds}});

  return cbb_games[params.cbb_game_id] || {};
}

export default async function Page({ params }) {
  const data = await getData(params);
  return <GamePage cbb_game = {data} />;
};
