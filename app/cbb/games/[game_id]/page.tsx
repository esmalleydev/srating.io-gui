'use server';

import { cache, Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';

import { useServerAPI } from '@/components/serverAPI';
import HelperGame from '@/components/helpers/Game';

import HeaderClientWrapper from '@/components/generic/Game/Header/ClientWrapper';
import HeaderServer from '@/components/generic/Game/Header/Server';

import NavBar from '@/components/generic/Game/NavBar';
import SubNavBar from '@/components/generic/Game/SubNavBar';

import BoxscoreClientWrapper from '@/components/generic/Game/Boxscore/ClientWrapper';
import { ClientSkeleton as BoxscoreClientSkeleton } from '@/components/generic/Game/Boxscore/Client';
import BoxscoreServer from '@/components/generic/Game/Boxscore/Server';

import ChartsClientWrapper from '@/components/generic/Game/Charts/ClientWrapper';
import { ClientSkeleton as ChartsClientSkeleton } from '@/components/generic/Game/Charts/Client';
import ChartsServer from '@/components/generic/Game/Charts/Server';

import PlaybyplayClientWrapper from '@/components/generic/Game/Playbyplay/ClientWrapper';
import { ClientSkeleton as PlaybyplayClientSkeleton } from '@/components/generic/Game/Playbyplay/Client';
import PlaybyplayServer from '@/components/generic/Game/Playbyplay/Server';

import MatchupClientWrapper from '@/components/generic/Game/Matchup/ClientWrapper';
import MatchupServer from '@/components/generic/Game/Matchup/Server';

import StatCompareClientWrapper from '@/components/generic/Game/StatCompare/ClientWrapper';
import { ClientSkeleton as StatCompareClientSkeleton } from '@/components/generic/Game/StatCompare/Client';
import StatCompareServer from '@/components/generic/Game/StatCompare/Server';

import PreviousMatchupsClientWrapper from '@/components/generic/Game/PreviousMatchups/ClientWrapper';
import { ClientSkeleton as PreviousMatchupsClientSkeleton } from '@/components/generic/Game/PreviousMatchups/Client';
import PreviousMatchupsServer from '@/components/generic/Game/PreviousMatchups/Server';

import OddsClientWrapper from '@/components/generic/Game/Odds/ClientWrapper';
import { ClientSkeleton as OddsClientSkeleton } from '@/components/generic/Game/Odds/Client';
import OddsServer from '@/components/generic/Game/Odds/Server';

import MomentumClientWrapper from '@/components/generic/Game/Momentum/ClientWrapper';
import { ClientSkeleton as MomentumClientSkeleton } from '@/components/generic/Game/Momentum/Client';
import MomentumServer from '@/components/generic/Game/Momentum/Server';

import { ClientSkeleton as StatsLoaderSkeleton } from '@/components/generic/Game/StatsLoader/Client';
import StatsLoaderServer from '@/components/generic/Game/StatsLoader/Server';
import PredictionLoader from '@/components/generic/Game/PreditionLoader';
import Organization from '@/components/helpers/Organization';
import Division from '@/components/helpers/Division';


type Props = {
  params: { game_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const game = await getCachedData({ params });

  const Game = new HelperGame({
    game,
  });

  return {
    title: `sRating | ${Game.getTeamName('away')} vs ${Game.getTeamName('home')}`,
    description: 'View predicted result, matchup, trends, odds',
    openGraph: {
      title: `${Game.getTeamName('away')} vs ${Game.getTeamName('home')}`,
      description: 'View predicted result, matchup, trends, odds',
    },
    twitter: {
      card: 'summary',
      title: `${Game.getTeamName('away')} vs ${Game.getTeamName('home')}`,
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
  const organization_id = Organization.getCBBID();
  const division_id = searchParams?.division_id || Division.getD1();

  const Game = new HelperGame({
    game,
  });


  const view = searchParams?.view || (Game.isInProgress() || Game.isFinal() ? 'game_details' : 'matchup');
  const subview = searchParams?.subview || (view === 'game_details' ? 'boxscore' : null) || (view === 'trends' ? 'stat_compare' : null);

  let tabOrder = ['matchup', 'trends'];
  if (Game.isInProgress() || Game.isFinal()) {
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
      <Suspense key = {`${game_id}_statsloader`} fallback = {<StatsLoaderSkeleton />}>
        <StatsLoaderServer game_ids = {[game_id]} organization_id = {organization_id} division_id = {division_id} />
      </Suspense>
      <HeaderClientWrapper game = {game}>
        <Suspense key = {`${game_id}_headerloader`}>
          <HeaderServer game_id = {game_id} />
        </Suspense>
      </HeaderClientWrapper>
      <NavBar view = {selectedViewTab} tabOrder = {tabOrder} />
      <SubNavBar subview = {selectSubViewTab} view = {selectedViewTab} tabOrder = {subTabOrder} />
      <PredictionLoader key = {`${game_id}_predictionloader`} game_id = {game_id} />
      {getContent()}
    </div>
  );
}

