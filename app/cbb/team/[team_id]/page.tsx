import TeamPage from './team-page';
import { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';

import HelperCBB from '@/components/helpers/CBB';
import HelperTeam from '@/components/helpers/Team';
import Api from '@/components/Api.jsx';

const api = new Api();

type Props = {
  params: { team_id: string };
};

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const team = await getData(params);

  const helperTeam = new HelperTeam({'team': team});

  return {
    title: 'sRating | ' + helperTeam.getName(),
    description: 'View predicted result, matchup, trends, odds',
    openGraph: {
      title: helperTeam.getName(),
      description: helperTeam.getName() + ' schedule, trends, statistics, roster',
    },
    twitter: {
      card: 'summary',
      title: helperTeam.getName(),
      description: helperTeam.getName() + ' schedule, trends, statistics, roster'
    }
  };
};


async function getData(params) {
  const seconds = 60 * 5; // cache for 5 mins
  const CBB = new HelperCBB();

  const team_id = params.team_id;

  const xUrl = headers().get('x-url') || '';
  const url = new URL(xUrl);
  const searchParams = new URLSearchParams(url.search);

  const season = searchParams.get('season') || CBB.getCurrentSeason();

  const team = await api.Request({
    'class': 'team',
    'function': 'get',
    'arguments': {
      'team_id': team_id,
    }
  },
  {next : {revalidate: seconds}});

  const conference = await api.Request({
    'class': 'team',
    'function': 'getConference',
    'arguments': {
      'team_id': team_id,
      'season': season,
    }
  },
  {next : {revalidate: seconds}});

  if (team && conference) {
    team.conference = conference.conference;
  }
  
  if (team && team.team_id) {
    const cbb_ranking = await api.Request({
      'class': 'cbb_ranking',
      'function': 'get',
      'arguments': {
        'team_id': team_id,
        'season': season,
        'current': '1'
      }
    },
    {next : {revalidate: seconds}});

    team.cbb_ranking = {};

    if (cbb_ranking && cbb_ranking.cbb_ranking_id) {
      team.cbb_ranking[cbb_ranking.cbb_ranking_id] = cbb_ranking;
    }

    team.stats = await api.Request({
      'class': 'team',
      'function': 'getStats',
      'arguments': {
        'team_id': team_id,
        'season': season,
      }
    },
    {next : {revalidate: seconds}});
  }

  return team;
}

export default async function Page({ params }) {
  const data = await getData(params);
  return <TeamPage team = {data} />;
};
