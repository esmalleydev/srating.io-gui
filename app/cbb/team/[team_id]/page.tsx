'use server';

import { Metadata, ResolvingMetadata } from 'next';

import HelperCBB from '@/components/helpers/CBB';
import HelperTeam from '@/components/helpers/Team';
import HeaderClientWrapper from '@/components/generic/CBB/Team/Header/ClientWrapper';
import HeaderServer from '@/components/generic/CBB/Team/Header/Server';
import NavBar from '@/components/generic/CBB/Team/NavBar';
import { useServerAPI } from '@/components/serverAPI';
import { Team } from '@/types/cbb';
import { unstable_noStore } from 'next/cache';
import SubNavBar from '@/components/generic/CBB/Team/SubNavbar';

import ScheduleClientWrapper from '@/components/generic/CBB/Team/Schedule/ClientWrapper';
import ScheduleServer from '@/components/generic/CBB/Team/Schedule/Server';
import SchedulePredictionLoader from '@/components/generic/CBB/Team/Schedule/PredictionLoader';
import ScheduleDifferentialLoader from '@/components/generic/CBB/Team/Schedule/DifferentialLoader';

import StatsClientWrapper from '@/components/generic/CBB/Team/Stats/ClientWrapper';
import StatsServer from '@/components/generic/CBB/Team/Stats/Server';

import TrendsClientWrapper from '@/components/generic/CBB/Team/Trends/ClientWrapper';
import TrendsServer from '@/components/generic/CBB/Team/Trends/Server';


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
  
  const team_season_conference: any = await useServerAPI({
    'class': 'team_season_conference',
    'function': 'get',
    'arguments': {
      'team_id': team_id,
      'season': season,
      'organization_id': 'f1c37c98-3b4c-11ef-94bc-2a93761010b8',
    }
  });
  
  if (team && team_season_conference) {
    team.conference_id = team_season_conference.conference_id;
  }

  return team;
};


export default async function Page({ params, searchParams }) {
  const team_id = params.team_id;

  const CBB = new HelperCBB();

  const season = searchParams?.season || CBB.getCurrentSeason();
  const view = searchParams?.view || 'schedule';

  // const tabOrder = ['schedule', 'stats', 'trends', 'seasons'];
  const tabOrder = ['schedule', 'stats', 'trends'];
  const selectedTab = tabOrder[(tabOrder.indexOf(view) > -1 ? tabOrder.indexOf(view) : 0)];

  return (
    <div>
      <HeaderClientWrapper>
        <HeaderServer season = {season} team_id = {team_id} />
      </HeaderClientWrapper>
      <NavBar view = {selectedTab} tabOrder = {tabOrder} />
      <SubNavBar view = {selectedTab} />
      {
        selectedTab == 'schedule' ?
          <>
            <ScheduleClientWrapper>
              <ScheduleServer team_id = {team_id} season = {season} />
            </ScheduleClientWrapper>
            <SchedulePredictionLoader team_id = {team_id} season = {season} />
            <ScheduleDifferentialLoader team_id = {team_id} season = {season} />
          </> :
          ''
      }
      {
        selectedTab == 'stats' ? 
          <>
            <StatsClientWrapper>
              <StatsServer team_id = {team_id} season = {season} />
            </StatsClientWrapper>
          </> :
          ''
      }
      {
        selectedTab == 'trends' ? 
          <>
            <TrendsClientWrapper>
              <TrendsServer team_id = {team_id} season = {season} />
            </TrendsClientWrapper>
          </> :
          ''
      }
    </div>
  );
};
