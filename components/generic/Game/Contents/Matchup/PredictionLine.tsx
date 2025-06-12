'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import CompareStatistic from '@/components/generic/CompareStatistic';
import { getSkeleton, maxWidth } from './Client';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';


const PredictionLine = ({ game }) => {
  const gamePredictionLoading = useAppSelector((state) => state.gameReducer.gamePredictionLoading);
  const gamePrediction = useAppSelector((state) => state.gameReducer.gamePrediction);

  let numberOfTeams = CBB.getNumberOfD1Teams(game.season);

  if (game.organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id: game.division_id, season: game.season });
  }


  const locked = (
    !gamePrediction[game.game_id] ||
    !gamePrediction[game.game_id].prediction ||
    (
      gamePrediction[game.game_id].prediction.home_percentage === null && gamePrediction[game.game_id].prediction.away_percentage === null
    )
  );

  const compareRows = [
    {
      name: 'Win %',
      title: 'Predicted win %',
      away: `${((!locked ? gamePrediction[game.game_id].prediction.away_percentage : 0) * 100).toFixed(0)}%`,
      home: `${((!locked ? gamePrediction[game.game_id].prediction.home_percentage : 0) * 100).toFixed(0)}%`,
      awayCompareValue: !locked ? gamePrediction[game.game_id].prediction.away_percentage : null,
      homeCompareValue: !locked ? gamePrediction[game.game_id].prediction.home_percentage : null,
      favored: 'higher',
      showDifference: false,
      locked,
    },
  ];


  return (
    <>
      {
        gamePredictionLoading ?
          <div style = {{ textAlign: 'center', maxWidth: 600, margin: 'auto' }}>{getSkeleton(1)}</div> :
          <CompareStatistic key = {game.game_id} maxWidth = {maxWidth} paper = {false} rows = {compareRows} season = {game.season} max = {numberOfTeams} />
      }
    </>
  );
};

export default PredictionLine;
