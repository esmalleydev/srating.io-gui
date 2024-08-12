'use client';

import React, { useState, useTransition } from 'react';

import Typography from '@mui/material/Typography';

// import FavoritePicker from '@/components/generic/FavoritePicker';
import HelperCBB from '@/components/helpers/CBB';
import HelperTeam from '@/components/helpers/Team';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import { useRouter } from 'next/navigation';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { Coach, Team } from '@/types/cbb';
import { Link, Skeleton } from '@mui/material';
import { setLoading } from '@/redux/features/display-slice';


/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ overflow: 'hidden', paddingLeft: 5, paddingRight: 5 }}>
      {children}
    </div>
  );
};


/**
 * The first line, containing the team name + buttons
 */
const PrimaryLine = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ display: 'flex', flexWrap: 'nowrap' }}>
      {children}
    </div>
  );
};


/**
 * The second line, containing the conference + coach
 */
const SecondaryLine = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ display: 'flex', justifyContent: 'center' }}>
      {children}
    </div>
  );
};

const ClientSkeleton = () => {
  return (
    <Contents>
      <PrimaryLine>
        <Skeleton width={320} height={30} style={{ marginBottom: 5 }} />
      </PrimaryLine>
      <SecondaryLine>
        <Skeleton width={200} height={28} />
      </SecondaryLine>
    </Contents>
  );
};

const Client = ({ cbb_coach_statistic_rankings, season }) => {
  // todo dont use any
  const coach: Coach | any = useAppSelector((state) => state.coachReducer.coach);
  const coach_team_seasons = useAppSelector((state) => state.coachReducer.coach_team_seasons);
  const teams = useAppSelector((state) => state.coachReducer.teams);
  const statistic_rankings = useAppSelector((state) => state.coachReducer.statistic_rankings);

  const season_x_team_id = {};

  let maxSeason = null;

  for (const coach_team_season_id in coach_team_seasons) {
    const row = coach_team_seasons[coach_team_season_id];
    season_x_team_id[row.season] = row.team_id;

    if (!maxSeason || maxSeason < row.season) {
      maxSeason = row.season;
    }
  }

  const lastSeason = (season in season_x_team_id ? season : (
    maxSeason || Object.keys(teams)[0]
  ));

  const season_x_cbb_coach_statistic_ranking_id = {};

  for (const cbb_coach_statistic_ranking_id in cbb_coach_statistic_rankings) {
    const row = cbb_coach_statistic_rankings[cbb_coach_statistic_ranking_id];

    season_x_cbb_coach_statistic_ranking_id[row.season] = cbb_coach_statistic_ranking_id;
  }

  const season_x_statistic_ranking_id = {};

  for (const statistic_ranking_id in statistic_rankings) {
    const row = statistic_rankings[statistic_ranking_id];

    if (row.team_id === season_x_team_id[lastSeason]) {
      season_x_statistic_ranking_id[row.season] = statistic_ranking_id;
    }
  }

  const cbb_coach_statistic_ranking = cbb_coach_statistic_rankings[season_x_cbb_coach_statistic_ranking_id[lastSeason]];
  const statistic_ranking = statistic_rankings[season_x_statistic_ranking_id[lastSeason]];

  const team = teams[season_x_team_id[lastSeason]];
  const breakPoint = 475;

  const dispatch = useAppDispatch();
  const router = useRouter();

  const { width } = useWindowDimensions() as Dimensions;

  const [isPending, startTransition] = useTransition();


  const teamHelper = new HelperTeam({ team });
  const CBB = new HelperCBB();

  const bestColor = getBestColor();
  const worstColor = getWorstColor();


  const supStyle: React.CSSProperties = {
    fontSize: (width < breakPoint ? '12px' : '16px'),
    verticalAlign: 'super',
  };

  const teamSupStyle: React.CSSProperties = {
    fontSize: '10px',
    verticalAlign: 'super',
  };

  const coachRank = cbb_coach_statistic_ranking ? cbb_coach_statistic_ranking.rank : null;
  const teamRank = statistic_ranking ? statistic_ranking.rank : null;

  if (coachRank) {
    supStyle.color = Color.lerpColor(bestColor, worstColor, (+(coachRank / CBB.getNumberOfD1Teams(season))));
  }

  if (teamRank) {
    teamSupStyle.color = Color.lerpColor(bestColor, worstColor, (+(teamRank / CBB.getNumberOfD1Teams(season))));
  }

  const handleTeamClick = () => {
    if (!team || !team.team_id) {
      return;
    }
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/cbb/team/${team.team_id}?season=${season}`);
    });
  };


  return (
    <Contents>
      <PrimaryLine>
        <Typography style = {{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} variant = {(width < breakPoint ? 'h6' : 'h5')}>
          {coachRank ? <span style = {supStyle}>{coachRank} </span> : ''}
          {`${coach.first_name} ${coach.last_name}`}
          <span style = {{ fontSize: '16px', verticalAlign: 'middle' }}>
            <Typography variant = 'overline' color = 'text.secondary'> ({cbb_coach_statistic_ranking?.wins || 0}-{cbb_coach_statistic_ranking?.losses || 0})</Typography>
          </span>
        </Typography>
      </PrimaryLine>
      <SecondaryLine>
        <Typography variant = 'overline' color = 'text.secondary'>
          {teamRank ? <span style = {teamSupStyle}>{teamRank} </span> : ''}
          <Link style = {{ cursor: 'pointer' }} underline='hover' onClick={handleTeamClick}>{teamHelper.getName()}</Link>
        </Typography>
      </SecondaryLine>
    </Contents>
  );
};

export { Client, ClientSkeleton };
