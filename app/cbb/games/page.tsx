'use server';

import { Metadata } from 'next';

import HelperCBB from '@/components/helpers/CBB';

import ContentsClientWrapper from '@/components/generic/CBB/Games/Contents/ClientWrapper';
import ContentsServer from '@/components/generic/CBB/Games/Contents/Server';
import { ClientSkeleton as ContentsClientSkeleton } from '@/components/generic/CBB/Games/Contents/Client';
import DateAppBar from '@/components/generic/DateAppBar';
import SubNavBar from '@/components/generic/CBB/Games/SubNavBar';
import { Suspense } from 'react';
import FloatingButtons from '@/components/generic/CBB/Games/FloatingButtons';
import Refresher from '@/components/generic/CBB/Games/Refresher';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import Dates from '@/components/utils/Dates';


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
    },
  };
}

export async function getDates({ season }) {
  unstable_noStore();
  const revalidateSeconds = 43200; // 60 * 60 * 12; // cache for 12 hours

  const dates: string[] | object = await useServerAPI({
    class: 'cbb_game',
    function: 'getSeasonDates',
    arguments: {
      season,
    },
  }, { revalidate: revalidateSeconds });

  return dates;
}

export async function getGames({ date }) {
  unstable_noStore();
  const revalidateSeconds = 1200; // 60 * 20; // cache games for 20 mins

  const cbb_games = await useServerAPI({
    class: 'cbb_game',
    function: 'getGames',
    arguments: {
      start_date: date,
    },
  }, { revalidate: revalidateSeconds });

  return cbb_games;
}


export default async function Page({ searchParams }) {
  const CBB = new HelperCBB();
  const datesHelper = new Dates();
  const season = searchParams?.season || CBB.getCurrentSeason();

  const dates = await getDates({ season });

  const date = searchParams?.date || datesHelper.getClosestDate(datesHelper.getToday(), dates);

  const cbb_games = await getGames({ date });

  return (
    <>
      <DateAppBar dates = {dates} date = {date} />
      <SubNavBar />
      <ContentsClientWrapper>
        <Suspense key={date} fallback = {<ContentsClientSkeleton cbb_games = {cbb_games} />}>
          <ContentsServer cbb_games = {cbb_games} date = {date} />
        </Suspense>
      </ContentsClientWrapper>
      <FloatingButtons />
      <Refresher date = {date} cbb_games = {cbb_games} />
    </>
  );
}
