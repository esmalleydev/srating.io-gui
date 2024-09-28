'use server';

import { Metadata, ResolvingMetadata } from 'next';

import HelperTeam from '@/components/helpers/Team';
import HeaderClientWrapper from '@/components/generic/Team/Header/ClientWrapper';
import HeaderServer from '@/components/generic/Team/Header/Server';
import NavBar from '@/components/generic/Team/NavBar';
import { useServerAPI } from '@/components/serverAPI';
import { Team, TeamSeasonConference } from '@/types/general';
import { unstable_noStore } from 'next/cache';
import SubNavBar from '@/components/generic/Team/SubNavbar';

import ScheduleClientWrapper from '@/components/generic/Team/Schedule/ClientWrapper';
import ScheduleServer from '@/components/generic/Team/Schedule/Server';
import SchedulePredictionLoader from '@/components/generic/Team/Schedule/PredictionLoader';

import StatsClientWrapper from '@/components/generic/Team/Stats/ClientWrapper';
import StatsServer from '@/components/generic/Team/Stats/Server';

import TrendsClientWrapper from '@/components/generic/Team/Trends/ClientWrapper';
import TrendsServer from '@/components/generic/Team/Trends/Server';
import { Suspense } from 'react';
import { ClientSkeleton as HeaderClientSkeleton } from '@/components/generic/Team/Header/Client';
import { ClientSkeleton as ScheduleClientSkeleton } from '@/components/generic/Team/Schedule/Client';
import { ClientSkeleton as StatsClientSkeleton } from '@/components/generic/Team/Stats/Client';
import { ClientSkeleton as TrendsClientSkeleton } from '@/components/generic/Team/Trends/Client';
import Organization from '@/components/helpers/Organization';
import Division from '@/components/helpers/Division';
import CBB from '@/components/helpers/CBB';


type Props = {
  params: { team_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const team = await getData({ params, searchParams });

  const helperTeam = new HelperTeam({ team });

  return {
    title: `sRating | ${helperTeam.getName()}`,
    description: 'View predicted result, matchup, trends, odds',
    openGraph: {
      title: `${helperTeam.getName()} basketball`,
      description: `${helperTeam.getName()} schedule, trends, statistics, roster`,
    },
    twitter: {
      card: 'summary',
      title: `${helperTeam.getName()} basketball`,
      description: `${helperTeam.getName()} schedule, trends, statistics, roster`,
    },
  };
}


async function getData({ params, searchParams }) {
  unstable_noStore();

  const { team_id } = params;

  const organization_id = Organization.getCBBID();
  const division_id = searchParams?.division_id || Division.getD1();
  const season = searchParams?.season || CBB.getCurrentSeason();

  type TeamWithConference = Team & {conference: string;}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const team: TeamWithConference = await useServerAPI({
    class: 'team',
    function: 'get',
    arguments: {
      team_id,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const team_season_conference: TeamSeasonConference = await useServerAPI({
    class: 'team_season_conference',
    function: 'get',
    arguments: {
      organization_id,
      team_id,
      season,
    },
  });

  if (team && team_season_conference) {
    team.conference_id = team_season_conference.conference_id;
  }

  return team;
}


export default async function Page({ params, searchParams }) {
  const { team_id } = params;

  // todo pass this in searchParams
  const organization_id = Organization.getCBBID();
  const division_id = searchParams?.division_id || Division.getD1();
  const season = +(searchParams?.season || CBB.getCurrentSeason());
  const view = searchParams?.view || 'schedule';

  // const tabOrder = ['schedule', 'stats', 'trends', 'seasons'];
  const tabOrder = ['schedule', 'stats', 'trends'];
  const selectedTab = tabOrder[(tabOrder.indexOf(view) > -1 ? tabOrder.indexOf(view) : 0)];

  return (
    <div>
      <HeaderClientWrapper>
        <Suspense fallback = {<HeaderClientSkeleton />}>
          <HeaderServer organization_id={organization_id} division_id={division_id} season = {season} team_id = {team_id} />
        </Suspense>
      </HeaderClientWrapper>
      <NavBar view = {selectedTab} tabOrder = {tabOrder} />
      <SubNavBar view = {selectedTab} />
      {
        selectedTab === 'schedule' ?
          <>
            <ScheduleClientWrapper>
              <Suspense fallback = {<ScheduleClientSkeleton />}>
                <ScheduleServer team_id = {team_id} season = {season} organization_id = {organization_id} division_id = {division_id} />
              </Suspense>
            </ScheduleClientWrapper>
            <SchedulePredictionLoader organization_id={organization_id} division_id={division_id} team_id = {team_id} season = {season} />
          </> :
          ''
      }
      {
        selectedTab === 'stats' ?
          <>
            <StatsClientWrapper>
              <Suspense fallback = {<StatsClientSkeleton />}>
                <StatsServer organization_id={organization_id} division_id={division_id} team_id = {team_id} season = {season} />
              </Suspense>
            </StatsClientWrapper>
          </> :
          ''
      }
      {
        selectedTab === 'trends' ?
          <>
            <TrendsClientWrapper>
              <Suspense fallback = {<TrendsClientSkeleton />}>
                <TrendsServer organization_id={organization_id} division_id={division_id} team_id = {team_id} season = {season} />
              </Suspense>
            </TrendsClientWrapper>
          </> :
          ''
      }
    </div>
  );
}
