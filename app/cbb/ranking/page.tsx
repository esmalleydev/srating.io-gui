import RankingPage from './ranking-page';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import cacheData from 'memory-cache';

import HelperCBB from '../../../components/helpers/CBB';
import Api from '../../../components/Api.jsx';

const api = new Api();


export const metadata: Metadata = {
  title: 'sRating | College basketball ranking',
  description: 'View statistic ranking for all 362 teams',
  openGraph: {
    title: 'sRating.io college basketball ranking',
    description: 'View statistic ranking for all 362 teams',
  },
  twitter: {
    card: 'summary',
    title: 'View statistic ranking for all 362 teams',
  }
};


async function getData() {
  const seconds = 60 * 60 * 5; // cache for 5 hours
 
  const CBB = new HelperCBB();

  const xUrl = headers().get('x-url') || '';
  const url = new URL(xUrl);
  const searchParams = new URLSearchParams(url.search);

  const season = searchParams.get('season') || CBB.getCurrentSeason();
  const view = searchParams.get('view') || 'team';

  let fxn = 'getTeamRanking';
  if (view === 'player') {
    fxn = 'getPlayerRanking';
  } else if (view === 'conference') {
    fxn = 'getConferenceRanking';
  }

  const cachedLocation = 'CBB.RANKING.LOAD.'+season+ '.' + view;
  const cached = cacheData.get(cachedLocation);

  let data = {};

  // the fetch caching is set to 2MB... >.<
  if (!cached) {
    data = await api.Request({
      'class': 'cbb_ranking',
      'function': fxn,
      'arguments': {
        'season': season
      }
    });
    cacheData.put(cachedLocation, data, 1000 * seconds);
  } else {
    data = cached;
  }

  return {
    'data': data,
    'generated': new Date().getTime(),
  };
}

export default async function Page() {
  const data = await getData();
  return <RankingPage data = {data.data} generated = {data.generated} />;
};
