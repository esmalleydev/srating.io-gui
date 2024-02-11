'use client';
import React from 'react';

import Typography from '@mui/material/Typography';

import FavoritePicker from '@/components/generic/FavoritePicker';
import HelperCBB from '@/components/helpers/CBB';
import HelperTeam from '@/components/helpers/Team';
import { useAppSelector } from '@/redux/hooks';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';


const ColorUtil = new Color();

const HeaderClient = ({team, season}) => {
  // interface Team {
  //   team_id: string;
  //   char6: string;
  //   code: string;
  //   name: string;
  //   alt_name: string;
  //   primary_color: string;
  //   secondary_color: string;
  //   cbb_d1: number;
  //   cbb: number;
  //   cfb: number;
  //   nba: number;
  //   nfl: number;
  //   nhl: number;
  //   guid: string;
  //   deleted: number;
  //   cbb_ranking: object;
  //   stats: {
  //     wins: number;
  //     losses: number;
  //   };
  // };

  const displaySlice = useAppSelector(state => state.displayReducer.value);

  const teamHelper = new HelperTeam({'team': team});
  const CBB = new HelperCBB();

  const bestColor = getBestColor();
  const worstColor = getWorstColor();


  const supStyle: React.CSSProperties = {
    'fontSize': '16px',
    'verticalAlign': 'super',
  };

  const rank = teamHelper.getRank(displaySlice.rank);

  if (rank) {
    supStyle.color = ColorUtil.lerpColor(bestColor, worstColor, (+(rank / CBB.getNumberOfD1Teams(season))));
  }


  return (
    <div style = {{'overflow': 'hidden', 'paddingLeft': 5, 'paddingRight': 5}}>
      <div style = {{'display': 'flex', 'flexWrap': 'nowrap'}}>
        <Typography style = {{'whiteSpace': 'nowrap', 'textOverflow': 'ellipsis', 'overflow': 'hidden'}} variant = {'h5'}>
          {rank ? <span style = {supStyle}>{rank} </span> : ''}
          {teamHelper.getName()}
          <span style = {{'fontSize': '16px', 'verticalAlign': 'middle'}}>
            <Typography variant = 'overline' color = 'text.secondary'> ({team?.stats.wins || 0}-{team?.stats.losses || 0})</Typography>
          </span>
        </Typography>
        <FavoritePicker team_id = {team?.team_id} />
      </div>
      <div style = {{'display': 'flex', 'justifyContent': 'center'}}>
        <Typography variant = 'overline' color = 'text.secondary'>{teamHelper.getConference()}</Typography>
      </div>
    </div>
  );
}

export default HeaderClient;
