'use client';

import { useEffect } from 'react';
import { setDataKey } from '@/redux/features/conference-slice';
import { useAppDispatch } from '@/redux/hooks';
import { StatisticRankings as StatsCBB } from '@/types/cbb';
import { StatisticRankings as StatsCFB } from '@/types/cfb';
import { Elos, TeamSeasonConferences } from '@/types/general';
import { Teams } from '@/types/general';

const ReduxWrapper = (
  { children, team_season_conferences, teams, statistic_rankings, elos, view, subview = null }:
  { children: React.ReactNode, team_season_conferences: TeamSeasonConferences, teams: Teams, statistic_rankings: StatsCBB | StatsCFB, elos: Elos, view: string, subview: string | null | undefined },
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setDataKey({ key: 'view', value: view }));
    dispatch(setDataKey({ key: 'subview', value: subview }));
    dispatch(setDataKey({ key: 'team_season_conferences', value: team_season_conferences }));
    dispatch(setDataKey({ key: 'teams', value: teams }));
    dispatch(setDataKey({ key: 'statistic_rankings', value: statistic_rankings }));
    dispatch(setDataKey({ key: 'elos', value: elos }));
  }, [dispatch, team_season_conferences, teams, statistic_rankings, elos]);

  return (
    <div>
      {children}
    </div>
  );
};

export default ReduxWrapper;
