'use client';

import React, { useEffect } from 'react';
import { setTeamSeasonConferences, setStatisticRankings, setTeams, setElos } from '@/redux/features/conference-slice';
import { useAppDispatch } from '@/redux/hooks';
import { StatisticRankings as StatsCBB } from '@/types/cbb';
import { StatisticRankings as StatsCFB } from '@/types/cfb';
import { Elos, TeamSeasonConferences } from '@/types/general';
import { Teams } from '@/types/general';

const ReduxWrapper = (
  { children, team_season_conferences, teams, statistic_rankings, elos }:
  { children: React.ReactNode, team_season_conferences: TeamSeasonConferences, teams: Teams, statistic_rankings: StatsCBB | StatsCFB, elos: Elos },
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTeamSeasonConferences(team_season_conferences));
    dispatch(setTeams(teams));
    dispatch(setStatisticRankings(statistic_rankings));
    dispatch(setElos(elos));
  }, [dispatch]);

  return (
    <div>
      {children}
    </div>
  );
};

export default ReduxWrapper;
