'use server';

import { cache, Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';

import { useServerAPI } from '@/components/serverAPI';
import HelperCBB from '@/components/helpers/CBB';

import HeaderClientWrapper from '@/components/generic/CBB/Game/Header/ClientWrapper';
import HeaderServer from '@/components/generic/CBB/Game/Header/Server';

import NavBar from '@/components/generic/CBB/Game/NavBar';
import SubNavBar from '@/components/generic/CBB/Game/SubNavBar';

import BoxscoreClientWrapper from '@/components/generic/CBB/Game/Boxscore/ClientWrapper';
import { ClientSkeleton as BoxscoreClientSkeleton } from '@/components/generic/CBB/Game/Boxscore/Client';
import BoxscoreServer from '@/components/generic/CBB/Game/Boxscore/Server';

import ChartsClientWrapper from '@/components/generic/CBB/Game/Charts/ClientWrapper';
import { ClientSkeleton as ChartsClientSkeleton } from '@/components/generic/CBB/Game/Charts/Client';
import ChartsServer from '@/components/generic/CBB/Game/Charts/Server';

import PlaybyplayClientWrapper from '@/components/generic/CBB/Game/Playbyplay/ClientWrapper';
import { ClientSkeleton as PlaybyplayClientSkeleton } from '@/components/generic/CBB/Game/Playbyplay/Client';
import PlaybyplayServer from '@/components/generic/CBB/Game/Playbyplay/Server';

import MatchupClientWrapper from '@/components/generic/CBB/Game/Matchup/ClientWrapper';
import MatchupServer from '@/components/generic/CBB/Game/Matchup/Server';

import StatCompareClientWrapper from '@/components/generic/CBB/Game/StatCompare/ClientWrapper';
import { ClientSkeleton as StatCompareClientSkeleton } from '@/components/generic/CBB/Game/StatCompare/Client';
import StatCompareServer from '@/components/generic/CBB/Game/StatCompare/Server';

import PreviousMatchupsClientWrapper from '@/components/generic/CBB/Game/PreviousMatchups/ClientWrapper';
import { ClientSkeleton as PreviousMatchupsClientSkeleton } from '@/components/generic/CBB/Game/PreviousMatchups/Client';
import PreviousMatchupsServer from '@/components/generic/CBB/Game/PreviousMatchups/Server';

import OddsClientWrapper from '@/components/generic/CBB/Game/Odds/ClientWrapper';
import { ClientSkeleton as OddsClientSkeleton } from '@/components/generic/CBB/Game/Odds/Client';
import OddsServer from '@/components/generic/CBB/Game/Odds/Server';

import MomentumClientWrapper from '@/components/generic/CBB/Game/Momentum/ClientWrapper';
import { ClientSkeleton as MomentumClientSkeleton } from '@/components/generic/CBB/Game/Momentum/Client';
import MomentumServer from '@/components/generic/CBB/Game/Momentum/Server';

import { ClientSkeleton as StatsLoaderSkeleton } from '@/components/generic/CBB/Game/StatsLoader/Client';
import StatsLoaderServer from '@/components/generic/CBB/Game/StatsLoader/Server';
import PredictionLoader from '@/components/generic/CBB/Game/PreditionLoader';


type Props = {
  params: { game_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const game = await getCachedData({ params });

  const CBB = new HelperCBB({
    game,
  });

  return {
    title: `sRating | ${CBB.getTeamName('away')} vs ${CBB.getTeamName('home')}`,
    description: 'View predicted result, matchup, trends, odds',
    openGraph: {
      title: `${CBB.getTeamName('away')} vs ${CBB.getTeamName('home')}`,
      description: 'View predicted result, matchup, trends, odds',
    },
    twitter: {
      card: 'summary',
      title: `${CBB.getTeamName('away')} vs ${CBB.getTeamName('home')}`,
      description: 'View predicted result, matchup, trends, odds',
    },
  };
}

// todo test this
const getCachedData = cache(getData);

async function getData({ params }) {
  const revalidateSeconds = 5 * 60;
  const { game_id } = params;
  const games = await useServerAPI({
    class: 'game',
    function: 'getGames',
    arguments: {
      game_id,
    },
  }, { revalidate: revalidateSeconds });

  return games[game_id] || {};
}

export default async function Page({ params, searchParams }) {
  const { game_id } = params;
  const game = await getCachedData({ params });

  const CBB = new HelperCBB({
    game,
  });


  const view = searchParams?.view || (CBB.isInProgress() || CBB.isFinal() ? 'game_details' : 'matchup');
  const subview = searchParams?.subview || (view === 'game_details' ? 'boxscore' : null) || (view === 'trends' ? 'stat_compare' : null);

  let tabOrder = ['matchup', 'trends'];
  if (CBB.isInProgress() || CBB.isFinal()) {
    tabOrder = ['game_details', 'matchup', 'trends'];
  }
  const selectedViewTab = tabOrder[(tabOrder.indexOf(view) > -1 ? tabOrder.indexOf(view) : 0)];

  let subTabOrder: string[] = [];
  if (view === 'game_details') {
    subTabOrder = ['boxscore', 'charts', 'pbp'];
  } else if (view === 'trends') {
    subTabOrder = ['stat_compare', 'previous_matchups', 'odds', 'momentum'];
  }

  const selectSubViewTab = subTabOrder[(subview && subTabOrder.indexOf(subview) > -1 ? subTabOrder.indexOf(subview) : 0)];

  const getContent = () => {
    if (view === 'game_details' && subview === 'boxscore') {
      return (
        <BoxscoreClientWrapper>
          <Suspense fallback = {<BoxscoreClientSkeleton />}>
            <BoxscoreServer game = {game} />
          </Suspense>
        </BoxscoreClientWrapper>);
    } if (view === 'game_details' && subview === 'charts') {
      return (
        <ChartsClientWrapper>
          <Suspense fallback = {<ChartsClientSkeleton />}>
            <ChartsServer game = {game} />
          </Suspense>
        </ChartsClientWrapper>
      );
    } if (view === 'game_details' && subview === 'pbp') {
      return (
        <PlaybyplayClientWrapper>
          <Suspense fallback = {<PlaybyplayClientSkeleton />}>
            <PlaybyplayServer game = {game} />
          </Suspense>
        </PlaybyplayClientWrapper>
      );
    } if (view === 'matchup') {
      return (<MatchupClientWrapper><MatchupServer game = {game} /></MatchupClientWrapper>);
    } if (view === 'trends' && subview === 'stat_compare') {
      return (
        <StatCompareClientWrapper>
          <Suspense fallback = {<StatCompareClientSkeleton />}>
            <StatCompareServer game = {game} />
          </Suspense>
        </StatCompareClientWrapper>
      );
    } if (view === 'trends' && subview === 'previous_matchups') {
      return (
        <PreviousMatchupsClientWrapper>
          <Suspense fallback = {<PreviousMatchupsClientSkeleton />}>
            <PreviousMatchupsServer game = {game} />
          </Suspense>
        </PreviousMatchupsClientWrapper>
      );
    } if (view === 'trends' && subview === 'odds') {
      return (
        <OddsClientWrapper>
          <Suspense fallback = {<OddsClientSkeleton />}>
            <OddsServer game = {game} />
          </Suspense>
        </OddsClientWrapper>
      );
    } if (view === 'trends' && subview === 'momentum') {
      return (
        <MomentumClientWrapper>
          <Suspense fallback = {<MomentumClientSkeleton />}>
            <MomentumServer game = {game} />
          </Suspense>
        </MomentumClientWrapper>
      );
    }
    return null;
  };

  return (
    <div>
      <Suspense key = {game_id} fallback = {<StatsLoaderSkeleton />}>
        <StatsLoaderServer game_ids = {[game_id]} />
      </Suspense>
      <HeaderClientWrapper game = {game}>
        <Suspense>
          <HeaderServer game_id = {game_id} />
        </Suspense>
      </HeaderClientWrapper>
      <NavBar view = {selectedViewTab} tabOrder = {tabOrder} />
      <SubNavBar subview = {selectSubViewTab} view = {selectedViewTab} tabOrder = {subTabOrder} />
      <PredictionLoader key = {game_id} game_id = {game_id} />
      {getContent()}
    </div>
  );
}
