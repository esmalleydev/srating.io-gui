'use server';

import { Suspense } from 'react';
import { Metadata } from 'next';

import StatsClientWrapper from '@/components/generic/Picks/Stats/ClientWrapper';
import StatsServer from '@/components/generic/Picks/Stats/Server';
import StatsLoading from '@/components/generic/Picks/Stats/Loading';
import SubNavBar from '@/components/generic/Picks/SubNavBar';
import Picks from '@/components/generic/Picks/Picks';
import { ClientSkeleton as StatsLoaderClientSkeleton } from '@/components/generic/Picks/StatsLoader/Client';
import StatsLoaderServer from '@/components/generic/Picks/StatsLoader/Server';
import Calculator from '@/components/generic/Picks/Calculator';
import PicksLoader from '@/components/generic/Picks/PicksLoader';
import ClientWrapper from '@/components/generic/Picks/ClientWrapper';
import Dates from '@/components/utils/Dates';
import DateBar from '@/components/generic/DateBar';
import Organization from '@/components/helpers/Organization';
import Division from '@/components/helpers/Division';
import CBB from '@/components/helpers/CBB';
import { getDates, getGames } from '@/components/generic/Games/Contents/Server';

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

  const games = dates.length ? await getGames({ date, organization_id, division_id }) : {};

  const view = searchParams?.view || 'picks';

  return (
    <>
      <DateBar dates = {dates} date = {date} />
      <SubNavBar view = {view} />
      <PicksLoader organization_id={organization_id} division_id={division_id} date = {date} />

      <ClientWrapper>
        {
          view === 'picks' ?
            <Picks games = {games} />
            : ''
        }
        <Suspense key = {date} fallback = {<StatsLoaderClientSkeleton />}>
          <StatsLoaderServer game_ids={Object.keys(games)} organization_id={organization_id} division_id={division_id} />
        </Suspense>

        {view === 'calculator' ? <div><Calculator games = {games} date = {date} /></div> : ''}

        {
          view === 'stats' ?
          <StatsClientWrapper>
            <Suspense key = {date} fallback = {<StatsLoading />}>
              <StatsServer organization_id={organization_id} division_id={division_id} date = {date} season = {season} />
            </Suspense>
          </StatsClientWrapper>
            : ''
        }
      </ClientWrapper>
    </>
  );
}
