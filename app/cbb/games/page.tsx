'use server';
import { Metadata } from 'next';

import HelperCBB from '@/components/helpers/CBB';

import moment from 'moment';

import ContentsClientWrapper from '@/components/generic/CBB/Games/Contents/ClientWrapper';
import ContentsServer from '@/components/generic/CBB/Games/Contents/Server';
import NavBar from '@/components/generic/CBB/Games/NavBar';
import SubNavBar from '@/components/generic/CBB/Games/SubNavBar';
import { Suspense } from 'react';
import Loading from '@/components/generic/CBB/Games/Contents/Loading';
import FloatingButtons from '@/components/generic/CBB/Games/FloatingButtons';
import Refresher from '@/components/generic/CBB/Games/Refresher';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';


export async function generateMetadata(): Promise<Metadata> {

  return {
    title: 'sRating | College basketball live scores',
    description: 'Live college basketball scores and odds',
    openGraph: {
      title: 'sRating.io college basketball live scores',
      description: 'Live college basketball scores and odds',
    },
    twitter: {
      card: 'summary',
      title: 'Live college basketball scores and odds',
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
  const cbb_games = await useServerAPI({
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

  const sessionDataKey = 'CBB.GAMES.DATA.'+season;


  return (
    <>
      <NavBar dates = {data.dates} sessionDataKey = {sessionDataKey} season = {season} />
      <SubNavBar />
      <ContentsClientWrapper>
        <Suspense fallback = {<Loading />}>
          <ContentsServer cbb_games = {data.cbb_games} date = {date} />
        </Suspense>
      </ContentsClientWrapper>
      <FloatingButtons />
      <Refresher date = {date} />
    </>
  );
};
