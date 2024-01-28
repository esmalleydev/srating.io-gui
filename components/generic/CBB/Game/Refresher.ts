'use client';
import { useEffect } from 'react';
import { refresh } from '../actions';


const Refresher = ({ cbb_game, tag }) => {
  const refreshRate = 30;
  
  useEffect(() => {
    let intervalRefresher: NodeJS.Timeout;
    if (cbb_game.status !== 'final') {
      intervalRefresher = setInterval(function() {
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