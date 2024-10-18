'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import { Skeleton } from '@mui/material';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import CBB from '@/components/helpers/CBB';
import CFB from '@/components/helpers/CFB';
import Organization from '@/components/helpers/Organization';


const Rank = ({ game, team_id }) => {
  const gameStats = useAppSelector((state) => state.gamesReducer.gameStats);
  const gameStatsLoading = useAppSelector((state) => state.gamesReducer.gameStatsLoading);
  // const showScheduleHistoricalRankRecord = useAppSelector((state) => state.gamesReducer.showScheduleHistoricalRankRecord);
  const displayRank = useAppSelector((state) => state.displayReducer.rank);
  let numberOfTeams = CBB.getNumberOfD1Teams(game.season);

  if (game.organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id: game.division_id, season: game.season });
  }

  const current = (gameStats[game.game_id] && gameStats[game.game_id].current[team_id]) || null;
  const historical = (gameStats[game.game_id] && gameStats[game.game_id].historical[team_id]) || null;

  const statistic_ranking = game.status === 'final' ? historical : current;

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
    supRankStyle.color = Color.lerpColor(bestColor, worstColor, (+(rank / numberOfTeams)));
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
