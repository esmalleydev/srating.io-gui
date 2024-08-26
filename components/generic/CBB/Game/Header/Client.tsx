'use client';

import React from 'react';

import Typography from '@mui/material/Typography';

import HelperCBB from '@/components/helpers/CBB';
import { getBreakPoint } from '@/components/generic/CBB/Game/Header/ClientWrapper';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import Refresher from '../Refresher';


const Client = ({ game, tag }) => {
  const { width } = useWindowDimensions() as Dimensions;

  let scoreVariant: string = 'h4';

  if (width < getBreakPoint()) {
    scoreVariant = 'h6';
  }

  const CBB = new HelperCBB({
    game,
  });

  const getScore = (score) => {
    if (!CBB.isInProgress() && !CBB.isFinal()) {
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
        {!CBB.isInProgress() ? <div><Typography color = {'text.secondary'} variant = 'overline'>{CBB.getStartDate()}</Typography></div> : ''}
        <div><Typography color = {'info.dark'} variant = 'overline'>{CBB.getTime()}</Typography></div>
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
