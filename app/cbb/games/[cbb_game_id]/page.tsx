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
  // this next setting is supposed to cache for only 30 seconds... but it doesnt actually work lol
  // so use my own caching since this is apparently complicated
  const seconds = 30; // cache for 30 seconds

  /*
  const tag = 'cbb_game.getGamesFull.'+params.cbb_game_id;

  const cachedLocation = 'CBB.GAMES.LOAD.getGamesFull.' + params.cbb_game_id;
  const cached = cacheData.get(cachedLocation);

  let data = {};

  // so this will use my cache first (which works), if not, when we send a request, purge it right away so when this actually runs again, it should not be cached
  if (!cached) {
    const cbb_games = await api.Request({
      'class': 'cbb_game',
      'function': 'getGamesFull',
      'arguments': {
        'cbb_game_id': params.cbb_game_id,
      }
    },
    {next : {revalidate: seconds, tags: tag}});

    data = cbb_games[params.cbb_game_id];

    cacheData.put(cachedLocation, data, 1000 * seconds);
    revalidateTag(tag);
  } else {
    data = cached;
  }

  return data;
  */

  const cbb_games = await api.Request({
    'class': 'cbb_game',
    'function': 'getGamesFull',
    'arguments': {
      'cbb_game_id': params.cbb_game_id,
    }
  },
  {next : {revalidate: seconds}});

  return cbb_games[params.cbb_game_id] || {};
}

export default async function Page({ params }) {
  const data = await getData(params);
  return <GamePage cbb_game = {data} />;
};
