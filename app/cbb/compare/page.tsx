'use server';

import { Metadata, ResolvingMetadata } from 'next';

import HelperCBB from '@/components/helpers/CBB';
import HelperTeam from '@/components/helpers/Team';

import { useServerAPI } from '@/components/serverAPI';
import { Team } from '@/components/generic/types';
import { unstable_noStore } from 'next/cache';
import SubNavBar from '@/components/generic/CBB/Compare/SubNavBar';

import HeaderClientWrapper from '@/components/generic/CBB/Compare/Header/ClientWrapper';
import HeaderClient from '@/components/generic/CBB/Compare/Header/Client';

import PlayerClientWrapper from '@/components/generic/CBB/Compare/Player/ClientWrapper';
import PlayerServer from '@/components/generic/CBB/Compare/Player/Server';

import TeamClientWrapper from '@/components/generic/CBB/Compare/Team/ClientWrapper';
import TeamServer from '@/components/generic/CBB/Compare/Team/Server';

import TrendsClientWrapper from '@/components/generic/CBB/Compare/Trends/ClientWrapper';
import TrendsServer from '@/components/generic/CBB/Compare/Trends/Server';

import PredictionLoader from '@/components/generic/CBB/Compare/Team/PredictionLoader';
import Splash from '@/components/generic/CBB/Compare/Splash';

type Props = {
  params: { team_ids: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  return {
    title: 'sRating | compare tool' ,
    description: 'Compare any college basketball team statistics',
    openGraph: {
      title: 'Compare tool',
      description: 'Compare any college basketball team statistics',
    },
    twitter: {
      card: 'summary',
      title: 'Compare tool',
      description: 'Compare any college basketball team statistics',
    }
  };
};


async function getData({ season, home_team_id, away_team_id}) {
  unstable_noStore();
  const revalidateSeconds = 60 * 60 * 2; // 2 hours

  const teams = {};

  if (home_team_id) {
    const homeTeam = await useServerAPI({
      'class': 'team',
      'function': 'loadTeamMini',
      'arguments': {
        'team_id': home_team_id,
        'season': season,
      },
    }, {revalidate: revalidateSeconds});

    teams[home_team_id] = homeTeam;
  }

  if (away_team_id) {
    const awayTeam = await useServerAPI({
      'class': 'team',
      'function': 'loadTeamMini',
      'arguments': {
        'team_id': away_team_id,
        'season': season,
      },
    }, {revalidate: revalidateSeconds});

    teams[away_team_id] = awayTeam;
  }

  return teams;
};


export default async function Page({ params, searchParams }) {
  const CBB = new HelperCBB();

  const home_team_id = searchParams?.home_team_id || null;
  const away_team_id = searchParams?.away_team_id || null;
  const season = searchParams?.season || CBB.getCurrentSeason();
  const view = searchParams?.view || 'team';
  const subview = searchParams?.subview || null;
  // const neutral_site = searchParams?.neutral_site || 0;

  
  const teams = await getData({ season, home_team_id, away_team_id});

  return (
    <div>
      <HeaderClientWrapper>
        <HeaderClient home_team_id = {home_team_id} away_team_id = {away_team_id} teams = {teams} season = {season} />
      </HeaderClientWrapper>
      <SubNavBar home_team_id = {home_team_id} away_team_id = {away_team_id} view = {view} />
      {
      !home_team_id || !away_team_id ?
        <Splash /> :
        <>
          {
            view === 'team' ?
              <TeamClientWrapper>
                <TeamServer home_team_id = {home_team_id} away_team_id = {away_team_id} season = {season} teams = {teams} subview = {subview} />
              </TeamClientWrapper>
            : ''
          }
          {
            view === 'player' ?
              <PlayerClientWrapper>
                <PlayerServer home_team_id = {home_team_id} away_team_id = {away_team_id} teams = {teams} season = {season} />
              </PlayerClientWrapper>
            : ''
          }
          {
            view === 'trends' ?
              <TrendsClientWrapper>
                <TrendsServer home_team_id = {home_team_id} away_team_id = {away_team_id} teams = {teams} season = {season} />
              </TrendsClientWrapper>
            : ''
          }
        </>
      }
      <PredictionLoader season = {season} />
    </div>
  );
};
