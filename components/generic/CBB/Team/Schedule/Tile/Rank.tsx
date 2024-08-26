'use client';

import React from 'react';

import HelperCBB from '@/components/helpers/CBB';
import { useAppSelector } from '@/redux/hooks';
import { Skeleton } from '@mui/material';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';


const Rank = ({ game, team_id }) => {
  const CBB = new HelperCBB({
    game,
  });

  const scheduleStats = useAppSelector((state) => state.teamReducer.scheduleStats);
  const scheduleStatsLoading = useAppSelector((state) => state.teamReducer.scheduleStatsLoading);
  const showScheduleHistoricalRankRecord = useAppSelector((state) => state.teamReducer.showScheduleHistoricalRankRecord);
  const displayRank = useAppSelector((state) => state.displayReducer.rank);

  const current = (scheduleStats[game.game_id] && scheduleStats[game.game_id].current[team_id]) || null;
  const historical = (scheduleStats[game.game_id] && scheduleStats[game.game_id].historical[team_id]) || null;
  const statistic_ranking = showScheduleHistoricalRankRecord ? historical : current;

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
    supRankStyle.color = Color.lerpColor(bestColor, worstColor, (+(rank / CBB.getNumberOfD1Teams(game.season))));
  }


  return (
    <sup style = {supRankStyle}>
      {
        scheduleStatsLoading ?
          <Skeleton style={{ width: 10, height: 15, display: 'inline-block' }} />
          :
          rank || ''
      }
    </sup>
  );
};

export default Rank;
