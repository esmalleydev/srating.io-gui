'use client';


import { setDataKey } from '@/redux/features/game-slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

// todo prevent flashing... checking gameStats might cause an infinite loop,
// I think I need to store game_id, and not reload if set / the same. basically do not want the Client response, to trigger the Skeleton code

const ClientSkeleton = () => {
  const dispatch = useAppDispatch();
  // const gameStats = useAppSelector((state) => state.gameReducer.gameStats);

  // prevents flashing
  // if (Object.keys(gameStats).length === 0) {
  dispatch(setDataKey({ key: 'gameStatsLoading', value: true }));
  // }
  return null;
};

const Client = ({ gameStats }) => {
  const dispatch = useAppDispatch();
  dispatch(setDataKey({ key: 'gameStats', value: gameStats }));
  dispatch(setDataKey({ key: 'gameStatsLoading', value: false }));
  return null;
};

export { Client, ClientSkeleton };
