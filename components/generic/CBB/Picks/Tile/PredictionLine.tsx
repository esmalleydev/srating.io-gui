'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import CompareStatistic from '@/components/generic/CompareStatistic';
import { getSkeleton, maxWidth } from '../Tile';


const PredictionLine = ({ game }) => {
  const picksLoading = useAppSelector((state) => state.picksReducer.picksLoading);
  const picksData = useAppSelector((state) => state.picksReducer.picks);

  if (picksData && game.game_id in picksData) {
    Object.assign(game, picksData[game.game_id]);
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
        picksLoading ?
          getSkeleton(1) :
          <CompareStatistic key = {game.game_id} maxWidth = {maxWidth} paper = {false} rows = {compareRows} />
      }
    </>
  );
};

export default PredictionLine;
