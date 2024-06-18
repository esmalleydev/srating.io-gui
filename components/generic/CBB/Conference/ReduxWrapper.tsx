'use client';
import React from 'react';
import { setTeamSeasonConferences, setStatisticRankings, setTeams, setRankings } from '@/redux/features/conference-slice';
import { useAppDispatch } from '@/redux/hooks';
import { TeamSeasonConferences, Rankings, StatisticRankings, Teams } from '@/types/cbb';

const ReduxWrapper = (
  { children, team_season_conferences, teams, cbb_statistic_rankings, cbb_rankings }:
  { children: React.ReactNode, team_season_conferences: TeamSeasonConferences | {}, teams: Teams | {}, cbb_statistic_rankings: StatisticRankings | {}, cbb_rankings: Rankings | {} }
) => {
  const dispatch = useAppDispatch();

  dispatch(setTeamSeasonConferences(team_season_conferences));
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