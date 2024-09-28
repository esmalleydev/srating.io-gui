'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import { Skeleton } from '@mui/material';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';


const Rank = ({ game, team_id }) => {
  const scheduleStats = useAppSelector((state) => state.teamReducer.scheduleStats);
  const scheduleStatsLoading = useAppSelector((state) => state.teamReducer.scheduleStatsLoading);
  const showScheduleHistoricalRankRecord = useAppSelector((state) => state.teamReducer.showScheduleHistoricalRankRecord);
  const displayRank = useAppSelector((state) => state.displayReducer.rank);

  let numberOfTeams = CBB.getNumberOfD1Teams(game.season);

  if (game.organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id: game.division_id, season: game.season });
  }

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
    supRankStyle.color = Color.lerpColor(bestColor, worstColor, (+(rank / numberOfTeams)));
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
