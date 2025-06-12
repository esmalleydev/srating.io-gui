'use client';

import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LeaguePlayerStatisticRankings, PlayerBoxscores, PlayerStatisticRankings } from '@/types/cbb';
import { Games } from '@/types/general';
import { LinearProgress } from '@mui/material';
import StatsGraph from './StatsGraph';


export interface TrendsType {
  games: Games;
  player_statistic_rankings: PlayerStatisticRankings;
  league_player_statistic_rankings: LeaguePlayerStatisticRankings;
  player_boxscores: PlayerBoxscores;
}

const padding = 5;

/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style={{ padding }}>
      {children}
    </div>
  );
};

const ClientSkeleton = () => {
  const heightToRemove = padding + footerNavigationHeight + headerBarHeight + 190;
  return (
    <Contents>
      <div style = {{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100vh - ${heightToRemove}px)`,
      }}>
        <LinearProgress color = 'secondary' style={{ width: '50%' }} />
      </div>
    </Contents>
  );
};

const Client = (
  { organization_id, division_id, season, player_id, data }:
  { organization_id: string, division_id: string, season: number, player_id: string, data: TrendsType },
) => {
  const games = (data && data.games) || {};
  const player_statistic_rankings = (data && data.player_statistic_rankings) || {};
  const league_player_statistic_rankings = (data && data.league_player_statistic_rankings) || {};
  const player_boxscores = (data && data.player_boxscores) || {};

  return (
    <Contents>
      <StatsGraph organization_id = {organization_id} division_id = {division_id} season = {season} player_statistic_rankings = {player_statistic_rankings} games = {games} league_player_statistic_rankings = {league_player_statistic_rankings} player_boxscores = {player_boxscores} />
    </Contents>
  );
};

export { Client, ClientSkeleton };
