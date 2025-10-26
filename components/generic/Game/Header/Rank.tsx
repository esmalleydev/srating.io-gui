'use client';

import { useAppSelector } from '@/redux/hooks';
import { Skeleton } from '@mui/material';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import Organization from '@/components/helpers/Organization';
import { Game } from '@/types/general';


const Rank = (
  { game, team_id }:
  { game: Game; team_id: string; },
) => {
  const gameStats = useAppSelector((state) => state.gameReducer.gameStats);
  const gameStatsLoading = useAppSelector((state) => state.gameReducer.gameStatsLoading);
  const displayRank = useAppSelector((state) => state.displayReducer.rank);

  const numberOfTeams = Organization.getNumberOfTeams({ organization_id: game.organization_id, division_id: game.division_id, season: game.season });

  // const current = (gameStats[game.game_id] && gameStats[game.game_id].current[team_id]) || null;
  const historical = (gameStats[game.game_id] && gameStats[game.game_id].historical[team_id]) || null;
  const statistic_ranking = historical;

  const bestColor = getBestColor();
  const worstColor = getWorstColor();

  let rank = null;
  if (statistic_ranking) {
    rank = displayRank in statistic_ranking ? statistic_ranking[displayRank] : statistic_ranking.rank;
  }

  const supFontSize = 10;

  const supRankStyle: React.CSSProperties = {
    fontSize: supFontSize,
    marginRight: '5px',
    fontWeight: 700,
  };

  if (rank) {
    supRankStyle.color = Color.lerpColor(bestColor, worstColor, (+(rank / numberOfTeams)));
  }

  if (gameStatsLoading) {
    return <Skeleton style={{ width: 10, height: 10, display: 'inline-block', marginRight: 2.5 }} />;
  }

  return (
    <sup style = {supRankStyle}>
      {rank || ''}
    </sup>
  );
};

export default Rank;
