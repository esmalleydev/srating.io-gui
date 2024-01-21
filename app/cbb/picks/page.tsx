import PicksPage from './picks-page';
import { Metadata } from 'next';

import HelperCBB from '@/components/helpers/CBB';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';

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
  unstable_noStore();
  const revalidateSeconds = 43200; // 60 * 60 * 12; // cache for 12 hours

  const CBB = new HelperCBB();

  const season = searchParams?.season || CBB.getCurrentSeason();

  const dates = await useServerAPI({
    'class': 'cbb_game',
    'function': 'getSeasonDates',
    'arguments': {
      'season': season
    }
  }, {revalidate: revalidateSeconds});


  return dates;
}

export default async function Page({ searchParams }) {
  const dates = await getSeasonDates(searchParams);
  return <PicksPage dates = {dates} />;
};
