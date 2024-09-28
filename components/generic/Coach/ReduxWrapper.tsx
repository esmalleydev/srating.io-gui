'use client';

import React, { useEffect } from 'react';
import { setCoach, setCoachTeamSeasons, setStatisticRankings, setTeams } from '@/redux/features/coach-slice';
import { useAppDispatch } from '@/redux/hooks';
import { StatisticRankings as StatsCBB } from '@/types/cbb';
import { StatisticRankings as StatsCFB } from '@/types/cfb';
import { Coach, CoachTeamSeasons, Teams } from '@/types/general';

const ReduxWrapper = (
  { children, coach, coach_team_seasons, teams, statistic_rankings }:
  { children: React.ReactNode, coach: Coach, coach_team_seasons: CoachTeamSeasons, teams: Teams, statistic_rankings: StatsCBB | StatsCFB },
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCoach(coach));
    dispatch(setCoachTeamSeasons(coach_team_seasons));
    dispatch(setTeams(teams));
    dispatch(setStatisticRankings(statistic_rankings));
  }, [dispatch]);

  return (
    <div>
      {children}
    </div>
  );
};

export default ReduxWrapper;
