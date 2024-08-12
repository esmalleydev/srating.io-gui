'use client';

import React from 'react';

import HelperCBB from '@/components/helpers/CBB';
import { useAppSelector } from '@/redux/hooks';
import { Skeleton } from '@mui/material';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';


const Rank = ({ cbb_game, team_id }) => {
  const CBB = new HelperCBB({
    cbb_game,
  });

  const gameStats = useAppSelector((state) => state.picksReducer.gameStats);
  const gameStatsLoading = useAppSelector((state) => state.picksReducer.gameStatsLoading);
  const displayRank = useAppSelector((state) => state.displayReducer.rank);

  const historical = (gameStats[cbb_game.cbb_game_id] && gameStats[cbb_game.cbb_game_id].historical[team_id]) || null;
  const statistic_ranking = historical;

  const bestColor = getBestColor();
  const worstColor = getWorstColor();

  let rank = null;
  if (statistic_ranking) {
    rank = displayRank in statistic_ranking ? statistic_ranking[displayRank] : statistic_ranking.rank;
  }

  const supRankStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 700,
  };

  if (rank) {
    supRankStyle.color = Color.lerpColor(bestColor, worstColor, (+(rank / CBB.getNumberOfD1Teams(cbb_game.season))));
  }


  return (
    <sup style = {supRankStyle}>
      {
        gameStatsLoading ?
          <Skeleton style={{ width: 10, height: 15, display: 'inline-block' }} />
          :
          rank || ''
      }
    </sup>
  );
};

export default Rank;
