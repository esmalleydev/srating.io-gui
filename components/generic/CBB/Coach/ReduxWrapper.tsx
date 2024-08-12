'use client';

import React from 'react';
import { setCoach, setCoachTeamSeasons, setStatisticRankings, setTeams } from '@/redux/features/coach-slice';
import { useAppDispatch } from '@/redux/hooks';
import { Coach, CoachTeamSeasons, StatisticRankings, Teams } from '@/types/cbb';

const ReduxWrapper = (
  { children, coach, coach_team_seasons, teams, statistic_rankings }:
  { children: React.ReactNode, coach: Coach | object, coach_team_seasons: CoachTeamSeasons | object, teams: Teams | object, statistic_rankings: StatisticRankings | object },
) => {
  const dispatch = useAppDispatch();

  dispatch(setCoach(coach));
  dispatch(setCoachTeamSeasons(coach_team_seasons));
  dispatch(setTeams(teams));
  dispatch(setStatisticRankings(statistic_rankings));

  return (
    <div>
      {children}
    </div>
  );
};

export default ReduxWrapper;
