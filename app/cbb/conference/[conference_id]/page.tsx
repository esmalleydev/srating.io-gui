import { useServerAPI } from '@/components/serverAPI';
import { CoachTeamSeasons, Conference, StatisticRankings, Teams, TeamSeasonConferences } from '@/types/cbb';
import { Metadata, ResolvingMetadata } from 'next';
import { unstable_noStore } from 'next/cache';

import HelperCBB from '@/components/helpers/CBB';

import HeaderServer from '@/components/generic/CBB/Conference/Header/Server';
import HeaderClientWrapper from '@/components/generic/CBB/Conference/Header/ClientWrapper';

// import SeasonsClient from '@/components/generic/CBB/Conference/Seasons/Client';
// import SeasonsClientWrapper from '@/components/generic/CBB/Conference/Seasons/ClientWrapper';

import TeamsClientWrapper from '@/components/generic/CBB/Conference/Teams/ClientWrapper';
import TeamsClient from '@/components/generic/CBB/Conference/Teams/Client';

// import SubNavBar from '@/components/generic/CBB/Conference/SubNavBar';
import ReduxWrapper from '@/components/generic/CBB/Conference/ReduxWrapper';
import NavBar from '@/components/generic/CBB/Conference/NavBar';
import { Suspense } from 'react';


type Props = {
  params: { coach_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const conference = await getConference({ params, searchParams });

  const { name } = conference;

  return {
    title: `sRating | ${name}`,
    description: 'View conference history and statistics',
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


async function getConference({ params, searchParams }): Promise<Partial<Conference>> {
  const { conference_id } = params;

  const conference = await useServerAPI({
    class: 'conference',
    function: 'get',
    arguments: {
      conference_id,
    },
  });

  return conference;
}

type Data = {
  team_season_conferences: CoachTeamSeasons | object;
  teams: Teams | object;
  cbb_statistic_rankings: StatisticRankings | object;
}

async function getData({ params, searchParams }): Promise<Data> {
  unstable_noStore();
  const revalidateSeconds = 43200; // 60 * 60 * 12; // cache for 12 hours

  const CBB = new HelperCBB();

  const season = searchParams?.season || CBB.getCurrentSeason();

  const conference = await getConference({ params, searchParams });

  const team_season_conferences: TeamSeasonConferences = await useServerAPI({
    class: 'team_season_conference',
    function: 'read',
    arguments: {
      conference_id: conference.conference_id,
      season,
      organization_id: 'f1c37c98-3b4c-11ef-94bc-2a93761010b8',
    },
  }, { revalidate: revalidateSeconds });

  const teams: Teams = await useServerAPI({
    class: 'team',
    function: 'read',
    arguments: {
      team_id: Object.values(team_season_conferences).map((row) => row.team_id),
    },
  }, { revalidate: revalidateSeconds });

  const cbb_statistic_rankings: StatisticRankings = await useServerAPI({
    class: 'cbb_statistic_ranking',
    function: 'read',
    arguments: {
      team_id: Object.values(teams).map((row) => row.team_id),
      season,
      current: '1',
    },
  }, { revalidate: revalidateSeconds });


  return { team_season_conferences, teams, cbb_statistic_rankings };
}

// todo this loading is all pretty quick... but when I start to add more data here, update this to split the loading and use suspense like the rest of the app

export default async function Page({ params, searchParams }) {
  const { conference_id } = params;
  const data = await getData({ params, searchParams });

  const CBB = new HelperCBB();

  const season = searchParams?.season || CBB.getCurrentSeason();
  const view: string = searchParams?.view || 'teams';

  const tabOrder = ['teams'];
  const selectedTab = tabOrder[(tabOrder.indexOf(view) > -1 ? tabOrder.indexOf(view) : 0)];

  return (
    <ReduxWrapper team_season_conferences = {data.team_season_conferences} teams = {data.teams} cbb_statistic_rankings = {data.cbb_statistic_rankings}>
      <HeaderClientWrapper>
        <HeaderServer conference_id = {conference_id} season = {season} />
      </HeaderClientWrapper>
      <NavBar view = {selectedTab} tabOrder = {tabOrder} />
      {/* <SubNavBar view = {view} /> */}
      <>
        {
          view === 'teams' ?
            <TeamsClientWrapper>
              <TeamsClient conference_id = {conference_id} season = {season} />
            </TeamsClientWrapper>
            : ''
        }
      </>
    </ReduxWrapper>
  );
}
