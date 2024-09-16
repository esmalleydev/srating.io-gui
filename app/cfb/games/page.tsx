'use server';

import { Metadata } from 'next';

import HelperCBB from '@/components/helpers/CBB';

import ContentsClientWrapper from '@/components/generic/Games/Contents/ClientWrapper';
import ContentsServer from '@/components/generic/Games/Contents/Server';
import { ClientSkeleton as ContentsClientSkeleton } from '@/components/generic/Games/Contents/Client';
import DateAppBar from '@/components/generic/DateAppBar';
import SubNavBar from '@/components/generic/Games/SubNavBar';
import { Suspense } from 'react';
import FloatingButtons from '@/components/generic/Games/FloatingButtons';
import Refresher from '@/components/generic/Games/Refresher';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import Dates from '@/components/utils/Dates';
import Organization from '@/components/helpers/Organization';
import Division from '@/components/helpers/Division';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'sRating | College football live scores',
    description: 'Live college football scores and odds',
    openGraph: {
      title: 'sRating.io college football live scores',
      description: 'Live college football scores and odds',
    },
    twitter: {
      card: 'summary',
      title: 'Live college football scores and odds',
    },
  };
}

export async function getDates({ season, organization_id, division_id }) {
  unstable_noStore();
  const revalidateSeconds = 43200; // 60 * 60 * 12; // cache for 12 hours

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

export async function getGames({ date, organization_id, division_id }) {
  unstable_noStore();
  const revalidateSeconds = 1200; // 60 * 20; // cache games for 20 mins

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
  const organization_id = Organization.getCFBID();
  const division_id = searchParams?.division_id || Division.getFBS();

  const dates = await getDates({ season, organization_id, division_id });

  const date = searchParams?.date || datesHelper.getClosestDate(datesHelper.getToday(), dates);

  const games = await getGames({ date, organization_id, division_id });

  return (
    <>
      <DateAppBar dates = {dates} date = {date} />
      <SubNavBar />
      <ContentsClientWrapper>
        <Suspense key={date} fallback = {<ContentsClientSkeleton games = {games} />}>
          <ContentsServer games = {games} date = {date} organization_id = {organization_id} division_id = {division_id} />
        </Suspense>
      </ContentsClientWrapper>
      <FloatingButtons />
      <Refresher date = {date} games = {games} />
    </>
  );
}
