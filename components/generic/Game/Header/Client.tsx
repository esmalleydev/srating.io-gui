'use client';

import React from 'react';

import Typography from '@mui/material/Typography';

import HelperGame from '@/components/helpers/Game';
import { getBreakPoint } from '@/components/generic/Game/Header/ClientWrapper';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import Refresher from '../Refresher';


const Client = ({ game, tag }) => {
  const { width } = useWindowDimensions() as Dimensions;

  let scoreVariant: string = 'h4';

  if (width < getBreakPoint()) {
    scoreVariant = 'h6';
  }

  const Game = new HelperGame({
    game,
  });

  const getScore = (score) => {
    if (!Game.isInProgress() && !Game.isFinal()) {
      return null;
    }

    return (
      <div>
        <Typography variant = {scoreVariant as 'h4' | 'h5'}>{score}</Typography>
      </div>
    );
  };

  const getTime = () => {
    return (
      <div>
        {!Game.isInProgress() ? <div><Typography color = {'text.secondary'} variant = 'overline'>{Game.getStartDate(null)}</Typography></div> : ''}
        <div><Typography color = {'info.dark'} variant = 'overline'>{Game.getTime()}</Typography></div>
      </div>
    );
  };

  return (
    <>
      <div style = {{
        display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', textAlign: 'center',
      }}>
        {getScore(game.away_score)}
        {getTime()}
        {getScore(game.home_score)}
      </div>
      <Refresher game = {game} tag = {tag} />
    </>
  );
};

export default Client;