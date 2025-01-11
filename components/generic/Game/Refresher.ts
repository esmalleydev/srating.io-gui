'use client';

import { useEffect } from 'react';
import { refresh } from '../actions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/game-slice';


const Refresher = ({ game, tag }) => {
  const dispatch = useAppDispatch();
  const refreshEnabled = useAppSelector((state) => state.gameReducer.refreshEnabled);
  const refreshRate = useAppSelector((state) => state.gameReducer.refreshRate);

  useEffect(() => {
    let intervalRefresher: NodeJS.Timeout;
    let intervalCountdown: NodeJS.Timeout;

    if (game.status !== 'final' && refreshEnabled) {
      intervalRefresher = setInterval(() => {
        refresh(tag);
      }, refreshRate * 1000);

      const intervalRate = 100;
      let refreshCountdown = refreshRate;

      intervalCountdown = setInterval(() => {
        refreshCountdown -= (intervalRate / 1000);

        if (refreshCountdown >= 0) {
          dispatch(setDataKey({ key: 'refreshCountdown', value: refreshCountdown }));
          dispatch(setDataKey({ key: 'refreshLoading', value: false }));
        }

        if (refreshCountdown <= 0) {
          dispatch(setDataKey({ key: 'refreshLoading', value: true }));
        }
      }, intervalRate);
    }
    return () => {
      if (intervalRefresher) {
        clearInterval(intervalRefresher);
      }

      if (intervalCountdown) {
        clearInterval(intervalCountdown);
      }
    };
  });

  return null;
};

export default Refresher;
