'use server';
import { Suspense } from 'react';
import { Metadata } from 'next';

import HelperCBB from '@/components/helpers/CBB';
import StatsClientWrapper from '@/components/generic/CBB/Picks/Stats/ClientWrapper';
import StatsServer from '@/components/generic/CBB/Picks/Stats/Server';
import StatsLoading from '@/components/generic/CBB/Picks/Stats/Loading';
import NavBar from '@/components/generic/CBB/Picks/NavBar';
import SubNavBar from '@/components/generic/CBB/Picks/SubNavBar';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import Picks from '@/components/generic/CBB/Picks/Picks';
import { gamesDataType } from '@/components/generic/types';
import Calculator from '@/components/generic/CBB/Picks/Calculator';
import PicksLoader from '@/components/generic/CBB/Picks/PicksLoader';
import ClientWrapper from '@/components/generic/CBB/Picks/ClientWrapper';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'sRating | College basketball betting picks',
    description: 'Best picks for each college basketball game',
    openGraph: {
      title: 'sRating.io college basketball picks',
      description: 'Best picks for each college basketball game',
    },
    twitter: {
      card: 'summary',
      title: 'Best picks for each college basketball game',
    }
  };
};

async function getData({ date, searchParams }) {
  unstable_noStore();
  const revalidateSeconds = 43200; // 60 * 60 * 12; // cache for 12 hours

  const CBB = new HelperCBB();

  const season = searchParams?.season || CBB.getCurrentSeason();

  const dates = await useServerAPI({
    'class': 'cbb_game',
    'function': 'getSeasonDates',
    'arguments': {
      'season': season
    }
  }, {revalidate: revalidateSeconds});

  const revalidateGamesSeconds = 1200; // 60 * 20; // cache games for 20 mins
  const cbb_games: gamesDataType | object = await useServerAPI({
    'class': 'cbb_game',
    'function': 'getGames',
    'arguments': {
      'start_date': date
    }
  }, {revalidate: revalidateGamesSeconds});

  return {dates, cbb_games};
};

export default async function Page({ searchParams }) {
  const CBB = new HelperCBB();
  const season = searchParams?.season || CBB.getCurrentSeason();

  const formatYmd = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1);
    const day = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate();
  
    return year + '-' + month + '-' + day;
  };
  
  const today = new Date(new Date().toLocaleString('en-US', {'timeZone': 'America/New_York'}));

  const date = searchParams?.date || formatYmd(today);

  const data = await getData({date, searchParams});

  const view = searchParams?.view || 'picks';

  return (
    <>
      <NavBar dates = {data.dates} />
      <SubNavBar view = {view} />
      <PicksLoader date = {date} />

      <ClientWrapper>
        {
          view === 'picks' ?
          <Picks cbb_games = {data.cbb_games} />
          : ''
        }

        {view === 'calculator' ?  <div><Calculator cbb_games = {data.cbb_games} date = {date} /></div> : ''}

        {
          view === 'stats' ? 
          <StatsClientWrapper>
            <Suspense fallback = {<StatsLoading />}>
              <StatsServer date = {date} season = {season} />
            </Suspense>
          </StatsClientWrapper>
          : ''
        }
      </ClientWrapper>
    </>
  );
};
