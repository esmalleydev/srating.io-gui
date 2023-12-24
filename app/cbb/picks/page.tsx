import PicksPage from './picks-page';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import HelperCBB from '../../../components/helpers/CBB';
import Api from '../../../components/Api.jsx';

const api = new Api();

export const metadata: Metadata = {
  title: 'sRating | College basketball betting picks',
  description: 'Best picks for each college basketball game',
  openGraph: {
    title: 'sRating.io college basketball picks',
    description: 'Best picks for each college basketball game',
  },
  twitter: {
    card: 'summary',
    title: 'Best picks for each college basketball game',
  }
};

async function getSeasonDates() {
  const seconds = 60 * 60 * 12; // cache for 12 hours

  const CBB = new HelperCBB();

  // const season =  (context.query && context.query.season) || CBB.getCurrentSeason();

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
  const dates = await getSeasonDates();
  return <PicksPage dates = {dates} />;
};
