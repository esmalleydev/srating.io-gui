'use client';

import React, { useEffect } from 'react';
import { setTeamSeasonConferences, setStatisticRankings, setTeams } from '@/redux/features/conference-slice';
import { useAppDispatch } from '@/redux/hooks';
import { StatisticRankings as StatsCBB } from '@/types/cbb';
import { StatisticRankings as StatsCFB } from '@/types/cfb';
import { TeamSeasonConferences } from '@/types/general';
import { Teams } from '@/types/general';

const ReduxWrapper = (
  { children, team_season_conferences, teams, statistic_rankings }:
  { children: React.ReactNode, team_season_conferences: TeamSeasonConferences, teams: Teams, statistic_rankings: StatsCBB | StatsCFB },
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTeamSeasonConferences(team_season_conferences));
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
