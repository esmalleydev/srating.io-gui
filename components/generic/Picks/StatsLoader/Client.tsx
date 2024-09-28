'use client';

import { setDataKey } from '@/redux/features/picks-slice';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect } from 'react';

const ClientSkeleton = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setDataKey({ key: 'gameStatsLoading', value: true }));
  }, [dispatch]);

  return null;
};

const Client = ({ gameStats }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setDataKey({ key: 'gameStats', value: gameStats }));
    dispatch(setDataKey({ key: 'gameStatsLoading', value: false }));
  }, [dispatch]);

  return null;
};

export { Client, ClientSkeleton };
