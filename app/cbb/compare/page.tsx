'use server';

import { Metadata, ResolvingMetadata } from 'next';

import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import SubNavBar from '@/components/generic/CBB/Compare/SubNavBar';

import HeaderClientWrapper from '@/components/generic/CBB/Compare/Header/ClientWrapper';
import HeaderClient from '@/components/generic/CBB/Compare/Header/Client';

import PlayerClientWrapper from '@/components/generic/CBB/Compare/Player/ClientWrapper';
import { ClientSkeleton as PlayerClientSkeleton } from '@/components/generic/CBB/Compare/Player/Client';
import PlayerServer from '@/components/generic/CBB/Compare/Player/Server';

import TeamClientWrapper from '@/components/generic/CBB/Compare/Team/ClientWrapper';
import { ClientSkeleton as TeamClientSkeleton } from '@/components/generic/CBB/Compare/Team/Client';
import TeamServer from '@/components/generic/CBB/Compare/Team/Server';

import TrendsClientWrapper from '@/components/generic/CBB/Compare/Trends/ClientWrapper';
import { ClientSkeleton as TrendsClientSkeleton } from '@/components/generic/CBB/Compare/Trends/Client';
import TrendsServer from '@/components/generic/CBB/Compare/Trends/Server';

import PredictionLoader from '@/components/generic/CBB/Compare/Team/PredictionLoader';
import Splash from '@/components/generic/CBB/Compare/Splash';
import { Suspense } from 'react';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import Division from '@/components/helpers/Division';

type Props = {
  params: { team_ids: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: 'sRating | Compare tool',
    description: 'Compare any college basketball team statistics',
    openGraph: {
      title: 'Compare tool',
      description: 'Compare any college basketball team statistics',
    },
    twitter: {
      card: 'summary',
      title: 'Compare tool',
      description: 'Compare any college basketball team statistics',
    },
  };
}


async function getData({ season, home_team_id, away_team_id }) {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 2; // 2 hours

  const teams = {};

  if (home_team_id) {
    const homeTeam = await useServerAPI({
      class: 'team',
      function: 'loadTeam',
      arguments: {
        team_id: home_team_id,
        season,
      },
    }, { revalidate: revalidateSeconds });

    teams[home_team_id] = homeTeam;
  }

  if (away_team_id) {
    const awayTeam = await useServerAPI({
      class: 'team',
      function: 'loadTeam',
      arguments: {
        team_id: away_team_id,
        season,
      },
    }, { revalidate: revalidateSeconds });

    teams[away_team_id] = awayTeam;
  }

  return teams;
}


export default async function Page({ /* params, */ searchParams }) {
  const home_team_id: string | null = searchParams?.home_team_id || null;
  const away_team_id: string | null = searchParams?.away_team_id || null;
  const organization_id = Organization.getCBBID();
  const division_id = Division.getD1();
  const season: number = searchParams?.season || CBB.getCurrentSeason();
  const view: string = searchParams?.view || 'team';
  const subview: string | null = searchParams?.subview || null;
  const neutral_site: boolean = (+searchParams?.neutral === 1);

  const teams = await getData({ season, home_team_id, away_team_id });

  // todo wrap the whole thing in a client component to set redux values?

  return (
    <div>
      <HeaderClientWrapper>
        <HeaderClient home_team_id = {home_team_id} away_team_id = {away_team_id} teams = {teams} season = {season} neutral_site = {neutral_site} />
      </HeaderClientWrapper>
      <SubNavBar home_team_id = {home_team_id} away_team_id = {away_team_id} view = {view} neutral_site = {neutral_site} />
      {
      !home_team_id || !away_team_id ?
        <Splash /> :
        <>
          {
            view === 'team' ?
              <TeamClientWrapper>
                <Suspense fallback = {<TeamClientSkeleton />}>
                  <TeamServer home_team_id = {home_team_id} away_team_id = {away_team_id} season = {season} teams = {teams} subview = {subview} />
                </Suspense>
              </TeamClientWrapper>
              : ''
          }
          {
            view === 'player' ?
              <PlayerClientWrapper>
                <Suspense fallback = {<PlayerClientSkeleton />}>
                  <PlayerServer home_team_id = {home_team_id} away_team_id = {away_team_id} teams = {teams} season = {season} />
                </Suspense>
              </PlayerClientWrapper>
              : ''
          }
          {
            view === 'trends' ?
              <TrendsClientWrapper>
                <Suspense fallback = {<TrendsClientSkeleton />}>
                  <TrendsServer organization_id={organization_id} division_id={division_id} home_team_id = {home_team_id} away_team_id = {away_team_id} teams = {teams} season = {season} />
                </Suspense>
              </TrendsClientWrapper>
              : ''
          }
        </>
      }
      <PredictionLoader season = {season} neutral_site = {neutral_site} />
    </div>
  );
}
