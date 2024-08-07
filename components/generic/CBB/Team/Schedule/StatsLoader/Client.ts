'use client';

import { setScheduleStats, setScheduleStatsLoading } from '@/redux/features/team-slice';
import { useAppDispatch } from '@/redux/hooks';

const ClientSkeleton = () => {
  const dispatch = useAppDispatch();
  dispatch(setScheduleStatsLoading(true));
  return null;
};

const Client = ({ scheduleStats }) => {
  const dispatch = useAppDispatch();
  dispatch(setScheduleStats(scheduleStats));
  dispatch(setScheduleStatsLoading(false));
  return null;
};

export { Client, ClientSkeleton };
