'use client';

import React, { useEffect } from 'react';
import { reset, setDataKey } from '@/redux/features/coach-slice';
import { useAppDispatch } from '@/redux/hooks';
import { StatisticRankings as StatsCBB } from '@/types/cbb';
import { StatisticRankings as StatsCFB } from '@/types/cfb';
import { Coach, CoachTeamSeasons, Teams } from '@/types/general';

const ReduxWrapper = (
  { children, coach, coach_team_seasons, teams, statistic_rankings, view }:
  { children: React.ReactNode, coach: Coach, coach_team_seasons: CoachTeamSeasons, teams: Teams, statistic_rankings: StatsCBB | StatsCFB, view: string },
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    dispatch(setDataKey({ key: 'view', value: view }));
    dispatch(setDataKey({ key: 'coach', value: coach }));
    dispatch(setDataKey({ key: 'coach_team_seasons', value: coach_team_seasons }));
    dispatch(setDataKey({ key: 'teams', value: teams }));
    dispatch(setDataKey({ key: 'statistic_rankings', value: statistic_rankings }));
  }, [dispatch, coach, coach_team_seasons, teams, statistic_rankings]);


  return (
    <div>
      {children}
    </div>
  );
};

export default ReduxWrapper;
