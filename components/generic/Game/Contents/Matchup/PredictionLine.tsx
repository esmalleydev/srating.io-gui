'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import CompareStatistic, { CompareStatisticRow } from '@/components/generic/CompareStatistic';
import { getSkeleton, maxWidth } from './Client';
import Organization from '@/components/helpers/Organization';


const PredictionLine = ({ game }) => {
  const gamePredictionLoading = useAppSelector((state) => state.gameReducer.gamePredictionLoading);
  const gamePrediction = useAppSelector((state) => state.gameReducer.gamePrediction);

  const numberOfTeams = Organization.getNumberOfTeams({ organization_id: game.organization_id, division_id: game.division_id, season: game.season });

  const locked = (
    !gamePrediction[game.game_id] ||
    !gamePrediction[game.game_id].prediction ||
    (
      gamePrediction[game.game_id].prediction.home_percentage === null && gamePrediction[game.game_id].prediction.away_percentage === null
    )
  );

  const away_percentage = (
    gamePrediction[game.game_id] &&
    gamePrediction[game.game_id].prediction &&
    gamePrediction[game.game_id].prediction.away_percentage
  );

  const home_percentage = (
    gamePrediction[game.game_id] &&
    gamePrediction[game.game_id].prediction &&
    gamePrediction[game.game_id].prediction.home_percentage
  );


  const compareRows: CompareStatisticRow[] = [
    {
      id: 'win_percentage',
      label: 'Win %',
      tooltip: 'Predicted win %',
      leftRow: { win_percentage: away_percentage },
      rightRow: { win_percentage: home_percentage },
      numeric: false,
      organization_ids: [Organization.getCBBID(), Organization.getCFBID()],
      views: ['matchup'],
      graphable: false,
      sort: 'higher',
      locked,
      getDisplayValue: (row) => {
        return `${((!locked && 'win_percentage' in row ? Number(row.win_percentage) : 0) * 100).toFixed(0)}%`;
      },
      getValue: (row) => {
        return !locked && 'win_percentage' in row ? row.win_percentage : null;
      },
    },
  ];


  return (
    <>
      {
        gamePredictionLoading ?
          <div style = {{ textAlign: 'center', maxWidth: 600, margin: 'auto' }}>{getSkeleton(1)}</div> :
          <CompareStatistic key = {game.game_id} maxWidth = {maxWidth} paper = {false} rows = {compareRows} max = {numberOfTeams} />
      }
    </>
  );
};

export default PredictionLine;
