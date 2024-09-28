'use client';

import { useEffect } from 'react';
import { refresh } from '../actions';


const Refresher = ({ game, tag }) => {
  const refreshRate = 30;

  useEffect(() => {
    let intervalRefresher: NodeJS.Timeout;
    if (game.status !== 'final') {
      intervalRefresher = setInterval(() => {
        refresh(tag);
      }, refreshRate * 1000);
    }
    return () => {
      clearInterval(intervalRefresher);
    };
  });

  return null;
};

export default Refresher;
