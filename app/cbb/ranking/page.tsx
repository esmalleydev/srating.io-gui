'use server';

import { Metadata, ResolvingMetadata } from 'next';

import Organization from '@/components/helpers/Organization';
import Division from '@/components/helpers/Division';

import ContentsClientWrapper from '@/components/generic/Ranking/Contents/ClientWrapper';
import ContentsServer from '@/components/generic/Ranking/Contents/Server';
import { ClientSkeleton as ContentsClientSkeleton } from '@/components/generic/Ranking/Contents/Client';
import { Suspense } from 'react';
import Base from '@/components/generic/Ranking/Base';
import CBB from '@/components/helpers/CBB';


type Props = {
  // params: {};
  searchParams: { [key: string]: string | string[] | undefined };
};


export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const view = searchParams?.view || 'team';

  let title = 'sRating | College basketball team ranking';
  let description = 'View statistic ranking for all 362 teams';

  if (view === 'player') {
    title = 'sRating | College basketball player ranking';
    description = 'View statistic ranking for every player';
  } else if (view === 'conference') {
    title = 'sRating | College basketball conference ranking';
    description = 'View statistic ranking for each conference';
  } else if (view === 'transfer') {
    title = 'sRating | College basketball transfer portal ranking';
    description = 'College basketball transfer portal tool, search, rank all players';
  } else if (view === 'coach') {
    title = 'sRating | College basketball coach ranking';
    description = 'View statistic ranking for each coach';
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: 'summary',
      title: description,
    },
  };
}


export default async function Page({ searchParams }) {
  const organization_id = Organization.getCBBID();
  const division_id = searchParams?.division_id || Division.getD1();
  const season = searchParams?.season || CBB.getCurrentSeason();
  const view = searchParams?.view || 'team';

  return (
    <>
      <Base organization_id = {organization_id} division_id = {division_id} season = {season} view = {view}>
        <ContentsClientWrapper>
          <Suspense key={organization_id + division_id + season + view} fallback = {<ContentsClientSkeleton />}>
            <ContentsServer organization_id = {organization_id} division_id = {division_id} season = {season} view = {view} />
          </Suspense>
        </ContentsClientWrapper>
      </Base>
    </>
  );
}
