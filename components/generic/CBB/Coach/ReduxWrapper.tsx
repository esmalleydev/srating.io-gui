'use client';
import React from 'react';
import { setCoach, setCoachTeamSeasons, setStatisticRankings, setTeams } from '@/redux/features/coach-slice';
import { useAppDispatch } from '@/redux/hooks';
import { Coach, CoachTeamSeasons, StatisticRankings, Teams } from '@/types/cbb';

const ReduxWrapper = (
  { children, coach, coach_team_seasons, teams, cbb_statistic_rankings }:
  { children: React.ReactNode, coach: Coach | {}, coach_team_seasons: CoachTeamSeasons | {}, teams: Teams | {}, cbb_statistic_rankings: StatisticRankings | {} }
) => {
  const dispatch = useAppDispatch();

  dispatch(setCoach(coach));
  dispatch(setCoachTeamSeasons(coach_team_seasons));
  dispatch(setTeams(teams));
  dispatch(setStatisticRankings(cbb_statistic_rankings));

  return (
    <div>
      {children}
    </div>
  );
};

export default ReduxWrapper;