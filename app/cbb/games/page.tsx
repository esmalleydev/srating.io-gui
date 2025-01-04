'use server';

import { Metadata } from 'next';

import ContentsClientWrapper from '@/components/generic/Games/Contents/ClientWrapper';
import ContentsServer, { getDates, getGames } from '@/components/generic/Games/Contents/Server';
import { ClientSkeleton as ContentsClientSkeleton } from '@/components/generic/Games/Contents/Client';
import DateBar from '@/components/generic/DateBar';
import SubNavBar from '@/components/generic/Games/SubNavBar';
import { Suspense } from 'react';
import FloatingButtons from '@/components/generic/Games/FloatingButtons';
import Refresher from '@/components/generic/Games/Refresher';
import Dates from '@/components/utils/Dates';
import Organization from '@/components/helpers/Organization';
import Division from '@/components/helpers/Division';
import CBB from '@/components/helpers/CBB';


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


export default async function Page({ searchParams }) {
  const datesHelper = new Dates();
  const season = searchParams?.season || CBB.getCurrentSeason();
  const organization_id = Organization.getCBBID(); // NCAAM
  const division_id = searchParams?.division_id || Division.getD1();

  const dates = await getDates({ season, organization_id, division_id });

  const date = searchParams?.date || datesHelper.getClosestDate(datesHelper.getToday(), dates);

  const games = await getGames({ date, organization_id, division_id });

  return (
    <>
      <DateBar dates = {dates} date = {date} />
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
