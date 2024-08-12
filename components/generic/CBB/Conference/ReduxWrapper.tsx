'use client';

import React from 'react';
import { setTeamSeasonConferences, setStatisticRankings, setTeams } from '@/redux/features/conference-slice';
import { useAppDispatch } from '@/redux/hooks';
import { TeamSeasonConferences, StatisticRankings, Teams } from '@/types/cbb';

const ReduxWrapper = (
  { children, team_season_conferences, teams, statistic_rankings }:
  { children: React.ReactNode, team_season_conferences: TeamSeasonConferences | object, teams: Teams | object, statistic_rankings: StatisticRankings | object },
) => {
  const dispatch = useAppDispatch();

  dispatch(setTeamSeasonConferences(team_season_conferences));
  dispatch(setTeams(teams));
  dispatch(setStatisticRankings(statistic_rankings));

  return (
    <div>
      {children}
    </div>
  );
};

export default ReduxWrapper;
