'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import CompareStatistic from '@/components/generic/CompareStatistic';
import { getSkeleton, maxWidth } from './Client';


const PredictionLine = ({ game }) => {
  const gamePredictionLoading = useAppSelector((state) => state.gameReducer.gamePredictionLoading);
  const gamePrediction = useAppSelector((state) => state.gameReducer.gamePrediction);


  if (gamePrediction && game.game_id in gamePrediction) {
    Object.assign(game, gamePrediction[game.game_id]);
  }

  const locked = (!game.prediction || (game.prediction.home_percentage === null && game.prediction.away_percentage === null));

  const compareRows = [
    {
      name: 'Win %',
      title: 'Predicted win %',
      away: `${((!locked ? game.prediction.away_percentage : 0) * 100).toFixed(0)}%`,
      home: `${((!locked ? game.prediction.home_percentage : 0) * 100).toFixed(0)}%`,
      awayCompareValue: !locked ? game.prediction.away_percentage : null,
      homeCompareValue: !locked ? game.prediction.home_percentage : null,
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
          <CompareStatistic key = {game.game_id} maxWidth = {maxWidth} paper = {false} rows = {compareRows} />
      }
    </>
  );
};

export default PredictionLine;
