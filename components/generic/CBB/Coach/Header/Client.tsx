'use client';
import React, { useState, useTransition } from 'react';

import Typography from '@mui/material/Typography';

import FavoritePicker from '@/components/generic/FavoritePicker';
import HelperCBB from '@/components/helpers/CBB';
import HelperTeam from '@/components/helpers/Team';
import { useAppSelector } from '@/redux/hooks';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import SeasonPicker from '@/components/generic/CBB/SeasonPicker';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import BackdropLoader from '@/components/generic/BackdropLoader';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { Coach, Team } from '@/types/cbb';
import { Link } from '@mui/material';


const Client = ({cbb_coach_statistic_rankings, season}) => {

  // todo dont use any
  const coach: Coach | any = useAppSelector(state => state.coachReducer.coach);
  const coach_team_seasons = useAppSelector(state => state.coachReducer.coach_team_seasons);
  const teams = useAppSelector(state => state.coachReducer.teams);

  const season_x_team_id = {};

  let maxSeason = null;

  for (let coach_team_season_id in coach_team_seasons) {
    const row = coach_team_seasons[coach_team_season_id];
    season_x_team_id[row.season] = row.team_id;

    if (!maxSeason || maxSeason < row.season) {
      maxSeason = row.season;
    }
  }

  const lastSeason = (season in season_x_team_id ? season : (
    maxSeason ? maxSeason : Object.keys(teams)[0]
  ));

  console.log(lastSeason)

  const season_x_cbb_statistic_ranking_id = {};

  console.log(cbb_coach_statistic_rankings)

  for (let cbb_statistic_ranking_id in cbb_coach_statistic_rankings) {
    const row = cbb_coach_statistic_rankings[cbb_statistic_ranking_id];

    season_x_cbb_statistic_ranking_id[row.season] = cbb_statistic_ranking_id;
  }

  console.log(season_x_cbb_statistic_ranking_id)

  const cbb_coach_statistic_ranking = cbb_coach_statistic_rankings[season_x_cbb_statistic_ranking_id[lastSeason]];

  const team = teams[season_x_team_id[lastSeason]];
  const breakPoint = 475;

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const { width } = useWindowDimensions() as Dimensions;

  const [isPending, startTransition] = useTransition();

  const [spin, setSpin] = useState(false);
  const displayRank = useAppSelector(state => state.displayReducer.rank);

  const teamHelper = new HelperTeam({'team': team});
  const CBB = new HelperCBB();

  const bestColor = getBestColor();
  const worstColor = getWorstColor();


  const supStyle: React.CSSProperties = {
    'fontSize': (width < breakPoint ? '12px' : '16px'),
    'verticalAlign': 'super',
  };

  const rank = teamHelper.getRank(displayRank);

  if (rank) {
    supStyle.color = Color.lerpColor(bestColor, worstColor, (+(rank / CBB.getNumberOfD1Teams(season))));
  }

  const handleTeamClick = () => {
    if (!team || !team.team_id) {
      return;
    }
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/team/' + team.team_id + '?season=' + season);
      setSpin(false);
    });
  };


  return (
    <div style = {{'overflow': 'hidden', 'paddingLeft': 5, 'paddingRight': 5}}>
      <div style = {{'display': 'flex', 'flexWrap': 'nowrap'}}>
        <Typography style = {{'whiteSpace': 'nowrap', 'textOverflow': 'ellipsis', 'overflow': 'hidden'}} variant = {(width < breakPoint ? 'h6' : 'h5')}>
          {rank ? <span style = {supStyle}>{rank} </span> : ''}
          {coach.first_name + ' ' + coach.last_name}
          <span style = {{'fontSize': '16px', 'verticalAlign': 'middle'}}>
            <Typography variant = 'overline' color = 'text.secondary'> ({cbb_coach_statistic_ranking?.wins || 0}-{cbb_coach_statistic_ranking?.losses || 0})</Typography>
          </span>
        </Typography>
      </div>
      <div style = {{'display': 'flex', 'justifyContent': 'center', 'cursor': 'pointer'}} onClick={handleTeamClick}>
        <Typography variant = 'overline' color = 'text.secondary'><Link underline='hover'>{teamHelper.getName()}</Link></Typography>
      </div>
      <BackdropLoader open = {spin} />
    </div>
  );
}

export default Client;
