'use server';

import { Suspense } from 'react';
import { Metadata } from 'next';

import HelperCBB from '@/components/helpers/CBB';
import StatsClientWrapper from '@/components/generic/CBB/Picks/Stats/ClientWrapper';
import StatsServer from '@/components/generic/CBB/Picks/Stats/Server';
import StatsLoading from '@/components/generic/CBB/Picks/Stats/Loading';
import SubNavBar from '@/components/generic/CBB/Picks/SubNavBar';
import Picks from '@/components/generic/CBB/Picks/Picks';
import { ClientSkeleton as StatsLoaderClientSkeleton } from '@/components/generic/CBB/Picks/StatsLoader/Client';
import StatsLoaderServer from '@/components/generic/CBB/Picks/StatsLoader/Server';
import Calculator from '@/components/generic/CBB/Picks/Calculator';
import PicksLoader from '@/components/generic/CBB/Picks/PicksLoader';
import ClientWrapper from '@/components/generic/CBB/Picks/ClientWrapper';
import Dates from '@/components/utils/Dates';
import { getDates, getGames } from '@/app/cbb/games/page';
import DateAppBar from '@/components/generic/DateAppBar';

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
  const CBB = new HelperCBB();
  const datesHelper = new Dates();
  const season = searchParams?.season || CBB.getCurrentSeason();

  const dates = await getDates({ season });

  const date = searchParams?.date || datesHelper.getClosestDate(datesHelper.getToday(), dates);

  const games = await getGames({ date });

  const view = searchParams?.view || 'picks';

  return (
    <>
      <DateAppBar dates = {dates} date = {date} />
      <SubNavBar view = {view} />
      <PicksLoader date = {date} />

      <ClientWrapper>
        {
          view === 'picks' ?
            <Picks games = {games} />
            : ''
        }
        <Suspense key = {date} fallback = {<StatsLoaderClientSkeleton />}>
          <StatsLoaderServer game_ids={Object.keys(games)} />
        </Suspense>

        {view === 'calculator' ? <div><Calculator games = {games} date = {date} /></div> : ''}

        {
          view === 'stats' ?
          <StatsClientWrapper>
            <Suspense key = {date} fallback = {<StatsLoading />}>
              <StatsServer date = {date} season = {season} />
            </Suspense>
          </StatsClientWrapper>
            : ''
        }
      </ClientWrapper>
    </>
  );
}
