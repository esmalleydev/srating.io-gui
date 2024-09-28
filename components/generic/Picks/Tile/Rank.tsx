'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import { Skeleton } from '@mui/material';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';


const Rank = ({ game, team_id }) => {
  const gameStats = useAppSelector((state) => state.picksReducer.gameStats);
  const gameStatsLoading = useAppSelector((state) => state.picksReducer.gameStatsLoading);
  const displayRank = useAppSelector((state) => state.displayReducer.rank);
  let numberOfTeams = CBB.getNumberOfD1Teams(game.season);

  if (game.organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id: game.division_id, season: game.season });
  }

  const historical = (gameStats[game.game_id] && gameStats[game.game_id].historical[team_id]) || null;
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
    supRankStyle.color = Color.lerpColor(bestColor, worstColor, (+(rank / numberOfTeams)));
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
