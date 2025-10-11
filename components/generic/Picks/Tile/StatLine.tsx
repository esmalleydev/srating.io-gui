'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import CompareStatistic, { CompareStatisticRow } from '@/components/generic/CompareStatistic';
import { getSkeleton, maxWidth } from '../Tile';
import Organization from '@/components/helpers/Organization';
import TableColumns from '@/components/helpers/TableColumns';
import Objector from '@/components/utils/Objector';


const StatLine = ({ game }) => {
  const gameStatsLoading = useAppSelector((state) => state.picksReducer.gameStatsLoading);
  const gameStats = useAppSelector((state) => state.picksReducer.gameStats);
  const homeStats = (gameStats[game.game_id] && gameStats[game.game_id].historical[game.home_team_id]) || {};
  const awayStats = (gameStats[game.game_id] && gameStats[game.game_id].historical[game.away_team_id]) || {};

  const numberOfTeams = Organization.getNumberOfTeams({ organization_id: game.organization_id, division_id: game.division_id, season: game.season });

  const columns = Objector.deepClone(TableColumns.getColumns({ organization_id: game.organization_id, view: 'team' }));

  let compareRows: string[] = [];

  if (game.organization_id === Organization.getCBBID()) {
    compareRows = [
      'adjusted_efficiency_rating',
      'opponent_efficiency_rating',
      'elo_sos',
      'offensive_rating',
    ];
  }

  if (game.organization_id === Organization.getCFBID()) {
    compareRows = [
      'passing_rating_college',
      'points',
      'yards_per_play',
    ];
  }

  const rows: CompareStatisticRow[] = [];

  compareRows.forEach((key) => {
    const row = columns[key] as CompareStatisticRow;

    row.leftRow = awayStats;
    row.rightRow = homeStats;

    rows.push(row);
  });



  return (
    <>
      {
        gameStatsLoading ?
          getSkeleton(compareRows.length) :
          <CompareStatistic key = {game.game_id} maxWidth = {maxWidth} paper = {false} rows = {rows} max = {numberOfTeams} />
      }
    </>
  );
};

export default StatLine;
