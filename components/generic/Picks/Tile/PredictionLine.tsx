'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import CompareStatistic from '@/components/generic/CompareStatistic';
import { getSkeleton, maxWidth } from '../Tile';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';


const PredictionLine = ({ game }) => {
  const picksLoading = useAppSelector((state) => state.picksReducer.picksLoading);
  const picksData = useAppSelector((state) => state.picksReducer.picks);
  let numberOfTeams = CBB.getNumberOfD1Teams(game.season);

  if (game.organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id: game.division_id, season: game.season });
  }

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
          <CompareStatistic key = {game.game_id} maxWidth = {maxWidth} paper = {false} rows = {compareRows} season = {game.season} max = {numberOfTeams} />
      }
    </>
  );
};

export default PredictionLine;
