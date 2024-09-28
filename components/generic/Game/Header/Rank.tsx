'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import { Skeleton } from '@mui/material';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { getBreakPoint } from './ClientWrapper';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';


const Rank = ({ game, team_id }) => {
  const gameStats = useAppSelector((state) => state.gameReducer.gameStats);
  const gameStatsLoading = useAppSelector((state) => state.gameReducer.gameStatsLoading);
  const displayRank = useAppSelector((state) => state.displayReducer.rank);

  let numberOfTeams = CBB.getNumberOfD1Teams(game.season);

  if (game.organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id: game.division_id, season: game.season });
  }

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
    supRankStyle.color = Color.lerpColor(bestColor, worstColor, (+(rank / numberOfTeams)));
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
