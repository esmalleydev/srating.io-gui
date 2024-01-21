import RankingPage from './ranking-page';
import { Metadata, ResolvingMetadata } from 'next';

import HelperCBB from '@/components/helpers/CBB';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';


type Props = {
  params: { cbb_game_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const view = searchParams?.view || 'team';

  let title = 'sRating | College basketball team ranking';
  let description = 'View statistic ranking for all 362 teams';

  if (view === 'player') {
    title = 'sRating | College basketball player ranking';
    description = 'View statistic ranking for every player';
  } else if (view === 'conference') {
    title = 'sRating | College basketball conference ranking';
    description = 'View statistic ranking for each conference';
  }

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
    twitter: {
      card: 'summary',
      title: description,
    }
  };
}


async function getData(searchParams) {
  unstable_noStore();
  const seconds = 60 * 60 * 5; // cache for 5 hours
 
  const CBB = new HelperCBB();

  const season = searchParams?.season || CBB.getCurrentSeason();
  const view = searchParams?.view || 'team';

  let fxn = 'getTeamRanking';
  if (view === 'player') {
    fxn = 'getPlayerRanking';
  } else if (view === 'conference') {
    fxn = 'getConferenceRanking';
  }

  const data = await useServerAPI({
    'class': 'cbb_ranking',
    'function': fxn,
    'arguments': {
      'season': season
    }
  }, {'revalidate': seconds});

  return {
    'data': data,
    'generated': new Date().getTime(),
  };
}

export default async function Page({ searchParams }) {
  const data = await getData(searchParams);
  return <RankingPage data = {data.data} generated = {data.generated} />;
};
