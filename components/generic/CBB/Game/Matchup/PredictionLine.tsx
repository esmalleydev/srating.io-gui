'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import CompareStatistic from '@/components/generic/CompareStatistic';
import { getSkeleton, maxWidth } from './Client';


const PredictionLine = ({ cbb_game }) => {
  const gamePredictionLoading = useAppSelector((state) => state.gameReducer.gamePredictionLoading);
  const gamePrediction = useAppSelector((state) => state.gameReducer.gamePrediction);


  if (gamePrediction && cbb_game.cbb_game_id in gamePrediction) {
    // eslint-disable-next-line no-param-reassign
    cbb_game.home_team_rating = gamePrediction[cbb_game.cbb_game_id].home_team_rating;
    // eslint-disable-next-line no-param-reassign
    cbb_game.away_team_rating = gamePrediction[cbb_game.cbb_game_id].away_team_rating;
  }


  const compareRows = [
    {
      name: 'Win %',
      title: 'Predicted win %',
      away: `${(cbb_game.away_team_rating * 100).toFixed(0)}%`,
      home: `${(cbb_game.home_team_rating * 100).toFixed(0)}%`,
      awayCompareValue: cbb_game.away_team_rating,
      homeCompareValue: cbb_game.home_team_rating,
      favored: 'higher',
      showDifference: false,
      locked: (cbb_game.away_team_rating === null && cbb_game.home_team_rating === null),
    },
  ];


  return (
    <>
      {
        gamePredictionLoading ?
          <div style = {{ textAlign: 'center', maxWidth: 600, margin: 'auto' }}>{getSkeleton(1)}</div> :
          <CompareStatistic key = {cbb_game.cbb_game_id} maxWidth = {maxWidth} paper = {false} rows = {compareRows} />
      }
    </>
  );
};

export default PredictionLine;
