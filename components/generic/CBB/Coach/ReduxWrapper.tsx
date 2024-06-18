'use client';
import React from 'react';
import { setCoach, setCoachTeamSeasons, setStatisticRankings, setTeams, setRankings } from '@/redux/features/coach-slice';
import { useAppDispatch } from '@/redux/hooks';
import { Coach, CoachTeamSeasons, Rankings, StatisticRankings, Teams } from '@/types/cbb';

const ReduxWrapper = (
  { children, coach, coach_team_seasons, teams, cbb_statistic_rankings, cbb_rankings }:
  { children: React.ReactNode, coach: Coach | {}, coach_team_seasons: CoachTeamSeasons | {}, teams: Teams | {}, cbb_statistic_rankings: StatisticRankings | {}, cbb_rankings: Rankings | {} }
) => {
  const dispatch = useAppDispatch();

  dispatch(setCoach(coach));
  dispatch(setCoachTeamSeasons(coach_team_seasons));
  dispatch(setTeams(teams));
  dispatch(setStatisticRankings(cbb_statistic_rankings));
  dispatch(setRankings(cbb_rankings));

  return (
    <div>
      {children}
    </div>
  );
};

export default ReduxWrapper;