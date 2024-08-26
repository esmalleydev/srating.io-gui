'use client';

import React from 'react';

import HelperCBB from '@/components/helpers/CBB';
import { useAppSelector } from '@/redux/hooks';
import { Skeleton } from '@mui/material';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { getBreakPoint } from './ClientWrapper';


const Rank = ({ game, team_id }) => {
  const CBB = new HelperCBB({
    game,
  });

  const gameStats = useAppSelector((state) => state.gameReducer.gameStats);
  const gameStatsLoading = useAppSelector((state) => state.gameReducer.gameStatsLoading);
  const displayRank = useAppSelector((state) => state.displayReducer.rank);

  // const current = (gameStats[game.game_id] && gameStats[game.game_id].current[team_id]) || null;
  const historical = (gameStats[game.game_id] && gameStats[game.game_id].historical[team_id]) || null;
  const statistic_ranking = historical;

  const bestColor = getBestColor();
  const worstColor = getWorstColor();

  const { width } = useWindowDimensions() as Dimensions;

  let rank = null;
  if (statistic_ranking) {
    rank = displayRank in statistic_ranking ? statistic_ranking[displayRank] : statistic_ranking.rank;
  }

  let supFontSize = 12;
  if (width < getBreakPoint()) {
    supFontSize = 10;
  }

  const supRankStyle: React.CSSProperties = {
    fontSize: supFontSize,
    marginRight: '5px',
    fontWeight: 700,
  };

  if (rank) {
    supRankStyle.color = Color.lerpColor(bestColor, worstColor, (+(rank / CBB.getNumberOfD1Teams(game.season))));
  }

  if (gameStatsLoading) {
    return <Skeleton style={{ width: 15, height: 20, display: 'inline-block', marginRight: 5 }} />;
  }

  return (
    <sup style = {supRankStyle}>
      {rank || ''}
    </sup>
  );
};

export default Rank;
