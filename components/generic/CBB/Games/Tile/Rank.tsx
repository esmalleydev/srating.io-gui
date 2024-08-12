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

  const gameStats = useAppSelector((state) => state.gamesReducer.gameStats);
  const gameStatsLoading = useAppSelector((state) => state.gamesReducer.gameStatsLoading);
  // const showScheduleHistoricalRankRecord = useAppSelector((state) => state.gamesReducer.showScheduleHistoricalRankRecord);
  const displayRank = useAppSelector((state) => state.displayReducer.rank);

  const current = (gameStats[cbb_game.cbb_game_id] && gameStats[cbb_game.cbb_game_id].current[team_id]) || null;
  // const historical = (gameStats[cbb_game.cbb_game_id] && gameStats[cbb_game.cbb_game_id].historical[team_id]) || null;
  const statistic_ranking = current;

  const bestColor = getBestColor();
  const worstColor = getWorstColor();

  let rank = null;
  if (statistic_ranking) {
    rank = displayRank in statistic_ranking ? statistic_ranking[displayRank] : statistic_ranking.rank;
  }

  const supRankStyle: React.CSSProperties = {
    fontSize: '11px',
    marginRight: '5px',
    fontWeight: 700,
  };

  if (rank) {
    supRankStyle.color = Color.lerpColor(bestColor, worstColor, (+(rank / CBB.getNumberOfD1Teams(cbb_game.season))));
  }

  if (gameStatsLoading) {
    return <Skeleton style={{ width: 25, height: 20, display: 'inline-block', marginRight: 5 }} />;
  }

  return (
    <sup style = {supRankStyle}>
      {rank || ''}
    </sup>
  );
};

export default Rank;
