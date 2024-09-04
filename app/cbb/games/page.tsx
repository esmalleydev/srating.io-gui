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

  const organization_id = 'f1c37c98-3b4c-11ef-94bc-2a93761010b8'; // NCAAM
  const division_id = 'bf602dc4-3b4a-11ef-94bc-2a93761010b8'; // D1

  const dates: string[] | object = await useServerAPI({
    class: 'game',
    function: 'getSeasonDates',
    arguments: {
      organization_id,
      division_id,
      season,
    },
  }, { revalidate: revalidateSeconds });

  return dates;
}

export async function getGames({ date }) {
  unstable_noStore();
  const revalidateSeconds = 1200; // 60 * 20; // cache games for 20 mins

  const organization_id = 'f1c37c98-3b4c-11ef-94bc-2a93761010b8'; // NCAAM
  const division_id = 'bf602dc4-3b4a-11ef-94bc-2a93761010b8'; // D1

  const games = await useServerAPI({
    class: 'game',
    function: 'getGames',
    arguments: {
      organization_id,
      division_id,
      start_date: date,
    },
  }, { revalidate: revalidateSeconds });

  return games;
}


export default async function Page({ searchParams }) {
  const CBB = new HelperCBB();
  const datesHelper = new Dates();
  const season = searchParams?.season || CBB.getCurrentSeason();

  const dates = await getDates({ season });

  const date = searchParams?.date || datesHelper.getClosestDate(datesHelper.getToday(), dates);

  const games = await getGames({ date });

  return (
    <>
      <DateAppBar dates = {dates} date = {date} />
      <SubNavBar />
      <ContentsClientWrapper>
        <Suspense key={date} fallback = {<ContentsClientSkeleton games = {games} />}>
          <ContentsServer games = {games} date = {date} />
        </Suspense>
      </ContentsClientWrapper>
      <FloatingButtons />
      <Refresher date = {date} games = {games} />
    </>
  );
}
