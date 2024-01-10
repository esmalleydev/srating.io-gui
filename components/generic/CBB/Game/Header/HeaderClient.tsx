'use client';
import React, { useEffect } from 'react';

import Typography from '@mui/material/Typography';

import HelperCBB from '@/components/helpers/CBB';
import { refresh } from '@/components/generic/CBB/Game/actions';
import { getBreakPoint } from '@/components/generic/CBB/Game/Header/HeaderClientWrapper';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';

let intervalRefresher: NodeJS.Timeout;

const HeaderClient = ({cbb_game, tag}) => {

  const { width } = useWindowDimensions() as Dimensions;

  useEffect(() => {
    if (cbb_game.status !== 'final') {
      intervalRefresher = setInterval(function() {
        refresh(tag);
      }, 30 * 1000);
    }
    return function clean_up() {
      clearInterval(intervalRefresher);
    };
  });

  let scoreVariant: string = 'h4';

  if (width < getBreakPoint()) {
    scoreVariant = 'h6';
  }

  const CBB = new HelperCBB({
    'cbb_game': cbb_game
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
    )
  };

  return (
    <div style = {{'display': 'flex', 'justifyContent': 'space-evenly', 'alignItems': 'center', 'textAlign': 'center'}}>
      {getScore(cbb_game.away_score)}
      {getTime()}
      {getScore(cbb_game.home_score)}
    </div>
  );
}

export default HeaderClient;
