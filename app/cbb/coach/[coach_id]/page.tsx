import { useServerAPI } from '@/components/serverAPI';
import { StatisticRankings as StatsCBB } from '@/types/cbb';
import { StatisticRankings as StatsCFB } from '@/types/cfb';
import { Coach, CoachTeamSeasons, Teams } from '@/types/general';
import { Metadata, ResolvingMetadata } from 'next';
import { unstable_noStore } from 'next/cache';


import HeaderServer from '@/components/generic/Coach/Header/Server';
import HeaderClientWrapper from '@/components/generic/Coach/Header/ClientWrapper';
import { ClientSkeleton as HeaderClientSkeleon } from '@/components/generic/Coach/Header/Client';

import SeasonsClient from '@/components/generic/Coach/Seasons/Client';
import SeasonsClientWrapper from '@/components/generic/Coach/Seasons/ClientWrapper';

import TrendsServer from '@/components/generic/Coach/Trends/Server';
import TrendsClientWrapper from '@/components/generic/Coach/Trends/ClientWrapper';
import { ClientSkeleton as TrendsClientSkeleon } from '@/components/generic/Coach/Trends/Client';

// import SubNavBar from '@/components/generic/Coach/SubNavBar';
import ReduxWrapper from '@/components/generic/Coach/ReduxWrapper';
import NavBar from '@/components/generic/Coach/NavBar';
import { Suspense } from 'react';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import Division from '@/components/helpers/Division';


type Props = {
  params: { coach_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const coach = await getCoach({ params, searchParams });

  const name = `${coach.first_name} ${coach.last_name}`;

  return {
    title: `sRating | ${name}`,
    description: 'View coach history and statistics',
    openGraph: {
      title: name,
      description: `${name} history, statistics`,
    },
    twitter: {
      card: 'summary',
      title: name,
      description: `${name} history, statistics`,
    },
  };
}


async function getCoach({ params, searchParams }) {
  const { coach_id } = params;

  const coach: Coach = await useServerAPI({
    class: 'coach',
    function: 'get',
    arguments: {
      coach_id,
    },
  });

  return coach;
}

type Data = {
  coach: Coach;
  coach_team_seasons: CoachTeamSeasons;
  teams: Teams;
  statistic_rankings: StatsCBB | StatsCFB;
}

async function getData({ params, searchParams }): Promise<Data> {
  unstable_noStore();
  const revalidateSeconds = 43200; // 60 * 60 * 12; // cache for 12 hours

  const organization_id = Organization.getCBBID();
  const division_id = Division.getD1();

  // const season = searchParams?.season || CBB.getCurrentSeason();

  const coach = await getCoach({ params, searchParams });

  const coach_team_seasons: CoachTeamSeasons = await useServerAPI({
    class: 'coach_team_season',
    function: 'read',
    arguments: {
      coach_id: coach.coach_id,
    },
  }, { revalidate: revalidateSeconds });

  const teams: Teams = await useServerAPI({
    class: 'team',
    function: 'read',
    arguments: {
      team_id: Object.values(coach_team_seasons).map((row) => row.team_id),
    },
  }, { revalidate: revalidateSeconds });

  const statistic_rankings: StatsCBB | StatsCFB = await useServerAPI({
    class: 'statistic_ranking',
    function: 'readStats',
    arguments: {
      organization_id,
      division_id,
      team_id: Object.values(teams).map((row) => row.team_id),
      season: Object.values(coach_team_seasons).map((row) => row.season),
      current: '1',
    },
  }, { revalidate: revalidateSeconds });

  return { coach, coach_team_seasons, teams, statistic_rankings };
}



export default async function Page({ params, searchParams }) {
  const { coach_id } = params;
  const data = await getData({ params, searchParams });

  const organization_id = Organization.getCBBID();
  const division_id = Division.getD1();
  const season = searchParams?.season || CBB.getCurrentSeason();
  const view: string = searchParams?.view || 'trends';

  const tabOrder = ['trends', 'seasons'];
  const selectedTab = tabOrder[(tabOrder.indexOf(view) > -1 ? tabOrder.indexOf(view) : 0)];

  return (
    <ReduxWrapper coach = {data.coach} coach_team_seasons = {data.coach_team_seasons} teams = {data.teams} statistic_rankings = {data.statistic_rankings}>
      <HeaderClientWrapper>
        <Suspense fallback = {<HeaderClientSkeleon />}>
          <HeaderServer organization_id={organization_id} division_id={division_id} coach_id = {coach_id} season = {season} />
        </Suspense>
      </HeaderClientWrapper>
      <NavBar view = {selectedTab} tabOrder = {tabOrder} />
      {/* <SubNavBar view = {view} /> */}
      <>
        {
          view === 'trends' ?
            <TrendsClientWrapper>
              <Suspense fallback = {<TrendsClientSkeleon />}>
                <TrendsServer organization_id={organization_id} division_id={division_id} coach_id = {coach_id} />
              </Suspense>
            </TrendsClientWrapper>
            : ''
        }
        {
          view === 'seasons' ?
            <SeasonsClientWrapper>
              <SeasonsClient organization_id={organization_id} division_id={division_id} coach_team_seasons = {data.coach_team_seasons} teams = {data.teams} statistic_rankings = {data.statistic_rankings} />
            </SeasonsClientWrapper>
            : ''
        }
      </>
    </ReduxWrapper>
  );
}
