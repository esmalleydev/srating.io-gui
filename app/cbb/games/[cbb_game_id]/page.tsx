'use server';
import { Metadata, ResolvingMetadata } from 'next';

import HelperCBB from '@/components/helpers/CBB';
import Api from '@/components/Api.jsx';
import HeaderClientWrapper from '@/components/generic/CBB/Game/Header/HeaderClientWrapper';
import HeaderServer from '@/components/generic/CBB/Game/Header/HeaderServer';
import { headers } from 'next/headers';
import NavBar from '@/components/generic/CBB/Game/NavBar';
import SubNavBar from '@/components/generic/CBB/Game/SubNavBar';

import BoxscoreClientWrapper from '@/components/generic/CBB/Game/Boxscore/ClientWrapper';
import BoxscoreServer from '@/components/generic/CBB/Game/Boxscore/Server';

import ChartsClientWrapper from '@/components/generic/CBB/Game/Charts/ClientWrapper';
import ChartsServer from '@/components/generic/CBB/Game/Charts/Server';

import PlaybyplayClientWrapper from '@/components/generic/CBB/Game/Playbyplay/ClientWrapper';
import PlaybyplayServer from '@/components/generic/CBB/Game/Playbyplay/Server';

import MatchupClientWrapper from '@/components/generic/CBB/Game/Matchup/ClientWrapper';
import MatchupServer from '@/components/generic/CBB/Game/Matchup/Server';

import StatCompareClientWrapper from '@/components/generic/CBB/Game/StatCompare/ClientWrapper';
import StatCompareServer from '@/components/generic/CBB/Game/StatCompare/Server';

import PreviousMatchupsClientWrapper from '@/components/generic/CBB/Game/PreviousMatchups/ClientWrapper';
import PreviousMatchupsServer from '@/components/generic/CBB/Game/PreviousMatchups/Server';

import OddsClientWrapper from '@/components/generic/CBB/Game/Odds/ClientWrapper';
import OddsServer from '@/components/generic/CBB/Game/Odds/Server';

import MomentumClientWrapper from '@/components/generic/CBB/Game/Momentum/ClientWrapper';
import MomentumServer from '@/components/generic/CBB/Game/Momentum/Server';

const api = new Api();

type Props = {
  params: { cbb_game_id: string };
};


export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const cbb_game = await getData(params);

  const CBB = new HelperCBB({
    'cbb_game': cbb_game,
  });

  return {
    title: 'sRating | ' + CBB.getTeamName('away') + ' vs ' + CBB.getTeamName('home'),
    description: 'View predicted result, matchup, trends, odds',
    openGraph: {
      title: CBB.getTeamName('away') + ' vs ' + CBB.getTeamName('home'),
      description: 'View predicted result, matchup, trends, odds',
    },
    twitter: {
      card: 'summary',
      title: CBB.getTeamName('away') + ' vs ' + CBB.getTeamName('home'),
      description: 'View predicted result, matchup, trends, odds'
    }
  };
};

async function getData(params) {
  const revalidateSeconds = 5 * 60;
  const cbb_game_id = params.cbb_game_id;
  const cbb_games = await api.Request({
    'class': 'cbb_game',
    'function': 'getGames',
    'arguments': {
      'cbb_game_id': cbb_game_id,
    }
  }, {next: {revalidate: revalidateSeconds}});

  return cbb_games[cbb_game_id] || {};
}

export default async function Page({ params }) {
  const cbb_game = await getData(params);

  const CBB = new HelperCBB({
    'cbb_game': cbb_game,
  });

  const xUrl = headers().get('x-url') || '';
  const url = new URL(xUrl);
  const searchParams = new URLSearchParams(url.search);

  const view = searchParams?.get('view') || (CBB.isInProgress() || CBB.isFinal() ? 'game_details' : 'matchup');
  const subview = searchParams?.get('subview') || (view === 'game_details' ? 'boxscore' : null) || (view === 'trends' ? 'stat_compare' : null);

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
      return (<BoxscoreClientWrapper><BoxscoreServer cbb_game = {cbb_game} /></BoxscoreClientWrapper>);
    } else if (view === 'game_details' && subview === 'charts') {
      return (<ChartsClientWrapper><ChartsServer cbb_game = {cbb_game} /></ChartsClientWrapper>);
    } else if (view === 'game_details' && subview === 'pbp') {
      return (<PlaybyplayClientWrapper><PlaybyplayServer cbb_game = {cbb_game} /></PlaybyplayClientWrapper>);
    } else if (view === 'matchup') {
      return (<MatchupClientWrapper><MatchupServer cbb_game = {cbb_game} /></MatchupClientWrapper>);
    } else if (view === 'trends' && subview === 'stat_compare') {
      return (<StatCompareClientWrapper><StatCompareServer cbb_game = {cbb_game} /></StatCompareClientWrapper>);
    } else if (view === 'trends' && subview === 'previous_matchups') {
      return (<PreviousMatchupsClientWrapper><PreviousMatchupsServer cbb_game = {cbb_game} /></PreviousMatchupsClientWrapper>);
    } else if (view === 'trends' && subview === 'odds') {
      return (<OddsClientWrapper><OddsServer cbb_game = {cbb_game} /></OddsClientWrapper>);
    } else if (view === 'trends' && subview === 'momentum') {
      return (<MomentumClientWrapper><MomentumServer cbb_game = {cbb_game} /></MomentumClientWrapper>);
    }
    return null;
  };

  return (
    <div>
      <HeaderClientWrapper cbb_game = {cbb_game}>
        <HeaderServer cbb_game_id = {cbb_game.cbb_game_id} />
      </HeaderClientWrapper>
      <NavBar view = {selectedViewTab} tabOrder = {tabOrder} />
      <SubNavBar subview = {selectSubViewTab} view = {selectedViewTab} tabOrder = {subTabOrder} />
      {getContent()}
    </div>
  );
};

