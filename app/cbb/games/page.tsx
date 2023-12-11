import GamesPage from './games-page';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import HelperCBB from '../../../components/helpers/CBB';
import Api from '../../../components/Api.jsx';

const api = new Api();


export const metadata: Metadata = {
  title: 'sRating | College basketball scores',
  description: 'Live college basketball scores and odds',
  openGraph: {
    title: 'sRating.io college basketball scores',
    description: 'Live college basketball scores and odds',
  },
  twitter: {
    card: 'summary',
    title: 'Live college basketball scores and odds',
  }
};

async function getData() {
  const seconds = 60 * 60 * 12; // cache for 12 hours
 
  const CBB = new HelperCBB();

  const xUrl = headers().get('x-url') || '';
  const url = new URL(xUrl);
  const searchParams = new URLSearchParams(url.search);

  const season = searchParams.get('season') || CBB.getCurrentSeason();

  const dates = await api.Request({
    'class': 'cbb_game',
    'function': 'getSeasonDates',
    'arguments': {
      'season': season
    }
  },
  {next : {revalidate: seconds}});

  return dates;
}

export default async function Page() {
  const dates = await getData();
  return <GamesPage dates = {dates} />;
};
