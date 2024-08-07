'use client';

import { setGameStats, setGameStatsLoading } from '@/redux/features/games-slice';
import { useAppDispatch } from '@/redux/hooks';

const ClientSkeleton = () => {
  const dispatch = useAppDispatch();
  dispatch(setGameStatsLoading(true));
  return null;
};

const Client = ({ gameStats }) => {
  const dispatch = useAppDispatch();
  dispatch(setGameStats(gameStats));
  dispatch(setGameStatsLoading(false));
  return null;
};

export { Client, ClientSkeleton };
