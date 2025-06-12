'use client';

import { setDataKey } from '@/redux/features/team-slice';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect } from 'react';

const ClientSkeleton = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setDataKey({ key: 'scheduleStatsLoading', value: true }));
  }, [dispatch]);

  return null;
};

const Client = ({ scheduleStats }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setDataKey({ key: 'scheduleStats', value: scheduleStats }));
    dispatch(setDataKey({ key: 'scheduleStatsLoading', value: false }));
  }, [dispatch]);

  return null;
};

export { Client, ClientSkeleton };
