'use client';

import { setScheduleStats, setScheduleStatsLoading } from '@/redux/features/team-slice';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect } from 'react';

const ClientSkeleton = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setScheduleStatsLoading(true));
  }, [dispatch]);

  return null;
};

const Client = ({ scheduleStats }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setScheduleStats(scheduleStats));
    dispatch(setScheduleStatsLoading(false));
  }, [dispatch]);

  return null;
};

export { Client, ClientSkeleton };
