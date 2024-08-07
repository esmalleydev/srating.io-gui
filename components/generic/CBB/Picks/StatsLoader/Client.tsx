'use client';

import { setDataKey } from '@/redux/features/picks-slice';
import { useAppDispatch } from '@/redux/hooks';

const ClientSkeleton = () => {
  const dispatch = useAppDispatch();
  dispatch(setDataKey({ key: 'gameStatsLoading', value: true }));
  return null;
};

const Client = ({ gameStats }) => {
  const dispatch = useAppDispatch();
  dispatch(setDataKey({ key: 'gameStats', value: gameStats }));
  dispatch(setDataKey({ key: 'gameStatsLoading', value: false }));
  return null;
};

export { Client, ClientSkeleton };
