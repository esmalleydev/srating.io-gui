'use server';

import { Metadata, ResolvingMetadata } from 'next';

import HelperCBB from '@/components/helpers/CBB';
import HelperTeam from '@/components/helpers/Team';
import HeaderClientWrapper from '@/components/generic/CBB/Team//Header/HeaderClientWrapper';
import HeaderServer from '@/components/generic/CBB/Team/Header/HeaderServer';
import Schedule from '@/components/generic/CBB/Team/Schedule';
import Trends from '@/components/generic/CBB/Team/Trends';
import NavBar from '@/components/generic/CBB/Team/NavBar';
import Stats from '@/components/generic/CBB/Team/Stats';
import { useServerAPI } from '@/components/serverAPI';
import { Team } from '@/components/generic/types';
import { unstable_noStore } from 'next/cache';
// import ScheduleClientWrapper from '@/components/generic/CBB/Team/Schedule/ScheduleClientWrapper';
// import ScheduleServer from '@/components/generic/CBB/Team/Schedule/ScheduleServer';


type Props = {
  params: { team_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const team = await getData({params, searchParams});

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


async function getData({params, searchParams}) {
  unstable_noStore();
  const CBB = new HelperCBB();

  const team_id = params.team_id;

  const season = searchParams?.season || CBB.getCurrentSeason();

  type TeamWithConference = Team & {conference: string;}

  const team: TeamWithConference | any = await useServerAPI({
    'class': 'team',
    'function': 'get',
    'arguments': {
      'team_id': team_id,
    }
  });

  const conference: any = await useServerAPI({
    'class': 'team',
    'function': 'getConference',
    'arguments': {
      'team_id': team_id,
      'season': season,
    }
  });

  if (team && conference) {
    team.conference = conference.conference;
  }

  return team;
};

// todo who need to redesign schedule component, need session_id to check for ratings

export default async function Page({ params, searchParams }) {
  const team_id = params.team_id;

  const CBB = new HelperCBB();

  const season = searchParams?.season || CBB.getCurrentSeason();
  const view = searchParams?.view || 'schedule';

  const tabOrder = ['schedule', 'stats', 'trends'];
  const selectedTab = tabOrder[(tabOrder.indexOf(view) > -1 ? tabOrder.indexOf(view) : 0)];

  return (
    <div>
      <HeaderClientWrapper season = {season}>
        <HeaderServer season = {season} team_id = {team_id} />
      </HeaderClientWrapper>
      <NavBar view = {selectedTab} tabOrder = {tabOrder} />
      {selectedTab == 'schedule' ? <Schedule key = {team_id} team_id = {team_id} season = {season} /> : ''}
      {/* {selectedTab == 'schedule' ? <ScheduleClientWrapper><ScheduleServer team_id = {team_id} season = {season} /></ScheduleClientWrapper> : ''} */}
      {selectedTab == 'stats' ? <Stats key = {team_id} team_id = {team_id} season = {season} /> : ''}
      {selectedTab == 'trends' ? <Trends key = {team_id} team_id = {team_id} season = {season} /> : ''}
    </div>
  );
};
