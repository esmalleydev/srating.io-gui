import RankingPage from './ranking-page';
import { Metadata, ResolvingMetadata } from 'next';

import HelperCBB from '@/components/helpers/CBB';
import { useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import { Teams, TeamSeasonConferences, TransferPlayerSeasons } from '@/types/cbb';


type Props = {
  params: { cbb_game_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
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
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
    twitter: {
      card: 'summary',
      title: description,
    }
  };
}


async function getData(searchParams) {
  unstable_noStore();
  const seconds = 60 * 60 * 5; // cache for 5 hours
 
  const CBB = new HelperCBB();

  const season = searchParams?.season || CBB.getCurrentSeason();
  const view = searchParams?.view || 'team';

  let fxn = 'getTeamRanking';
  if (view === 'player' || view === 'transfer') {
    fxn = 'getPlayerRanking';
  } else if (view === 'conference') {
    fxn = 'getConferenceRanking';
  } else if (view === 'coach') {
    fxn = 'getCoachRanking';
  }

  let data = await useServerAPI({
    'class': 'cbb_ranking',
    'function': fxn,
    'arguments': {
      'season': season
    }
  }, {'revalidate': seconds});

  if (view === 'transfer') {
    data = Object.assign({}, data);
    const cbb_transfer_player_seasons: TransferPlayerSeasons = await useServerAPI({
      'class': 'cbb_transfer_player_season',
      'function': 'read',
      'arguments': {
        'season': season,
      }
    });

    const teams: Teams = await useServerAPI({
      'class': 'team',
      'function': 'read',
      'arguments': {
        'cbb': 1,
        'cbb_d1': 1,
      }
    });

    const team_season_conferences: TeamSeasonConferences = await useServerAPI({
      'class': 'team_season_conference',
      'function': 'read',
      'arguments': {
        'season': season,
        'team_id': teams ? Object.values(teams).map(team => team.team_id) : null,
      }
    });

    const team_id_x_team_season_conference_id = {};
    for (let team_season_conference_id in team_season_conferences) {
      const row = team_season_conferences[team_season_conference_id];
      team_id_x_team_season_conference_id[row.team_id] = team_season_conference_id;
    }

    const player_id_x_cbb_transfer_player_season = {}
    for (let cbb_transfer_player_season_id in cbb_transfer_player_seasons) {
      player_id_x_cbb_transfer_player_season[cbb_transfer_player_seasons[cbb_transfer_player_season_id].player_id] = cbb_transfer_player_seasons[cbb_transfer_player_season_id];
    }

    for (let id in data) {
      if (
        !data[id].player_id ||
        !(data[id].player_id in player_id_x_cbb_transfer_player_season)
      ) {
        delete data[id];
      } else {
        data[id].committed = player_id_x_cbb_transfer_player_season[data[id].player_id].committed;
        data[id].committed_team_id = player_id_x_cbb_transfer_player_season[data[id].player_id].committed_team_id;
        data[id].committed_team_name = (data[id].committed_team_id in teams ? teams[data[id].committed_team_id].alt_name : '-');
        data[id].committed_conference_id = (
          data[id].committed_team_id && data[id].committed_team_id in team_id_x_team_season_conference_id ? 
          team_season_conferences[team_id_x_team_season_conference_id[data[id].committed_team_id]].conference_id :
          null
        );
      }
    }
  }

  return {
    'data': data,
    'generated': new Date().getTime(),
  };
}

export default async function Page({ searchParams }) {
  const data = await getData(searchParams);

  const rankView = searchParams?.view || 'team';

  return <RankingPage data = {data.data} generated = {data.generated} rankView = {rankView} />;
};
