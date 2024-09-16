'use server';

import { Metadata, ResolvingMetadata } from 'next';
import Organization from '@/components/helpers/Organization';
import Division from '@/components/helpers/Division';
import CFB from '@/components/helpers/CFB';


import ContentsClientWrapper from '@/components/generic/Ranking/Contents/ClientWrapper';
import ContentsServer from '@/components/generic/Ranking/Contents/Server';
import { ClientSkeleton as ContentsClientSkeleton } from '@/components/generic/Ranking/Contents/Client';
import { Suspense } from 'react';
import Base from '@/components/generic/Ranking/Base';


type Props = {
  // params: {};
  searchParams: { [key: string]: string | string[] | undefined };
};


export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const view = searchParams?.view || 'team';

  let title = 'sRating | College football team ranking';
  let description = 'View statistic ranking for all 362 teams';

  if (view === 'player') {
    title = 'sRating | College football player ranking';
    description = 'View statistic ranking for every player';
  } else if (view === 'conference') {
    title = 'sRating | College football conference ranking';
    description = 'View statistic ranking for each conference';
  } else if (view === 'transfer') {
    title = 'sRating | College football transfer portal ranking';
    description = 'College football transfer portal tool, search, rank all players';
  } else if (view === 'coach') {
    title = 'sRating | College football coach ranking';
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
  const organization_id = Organization.getCFBID();
  const division_id = searchParams?.division_id || Division.getFBS();
  const season = searchParams?.season || CFB.getCurrentSeason();
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
