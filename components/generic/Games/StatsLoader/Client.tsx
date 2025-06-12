'use client';

import { setGameStats, setGameStatsLoading } from '@/redux/features/games-slice';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect } from 'react';

const ClientSkeleton = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setGameStatsLoading(true));
  }, [dispatch]);

  return null;
};

const Client = ({ gameStats }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setGameStats(gameStats));
    dispatch(setGameStatsLoading(false));
  }, [dispatch, gameStats]);

  return null;
};

export { Client, ClientSkeleton };
