import PicksPage from './picks-page';
import { Metadata } from 'next';

import HelperCBB from '@/components/helpers/CBB';
import Api from '@/components/Api.jsx';

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

async function getSeasonDates(searchParams) {
  const seconds = 60 * 60 * 12; // cache for 12 hours

  const CBB = new HelperCBB();

  const season = searchParams?.season || CBB.getCurrentSeason();

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

export default async function Page({ searchParams }) {
  const dates = await getSeasonDates(searchParams);
  return <PicksPage dates = {dates} />;
};
