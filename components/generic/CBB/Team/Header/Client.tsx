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


const ColorUtil = new Color();

const Client = ({team, season}) => {
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

  const breakPoint = 475;

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const { width } = useWindowDimensions() as Dimensions;

  const [isPending, startTransition] = useTransition();

  const [spin, setSpin] = useState(false);
  const displaySlice = useAppSelector(state => state.displayReducer.value);

  const teamHelper = new HelperTeam({'team': team});
  const CBB = new HelperCBB();

  const bestColor = getBestColor();
  const worstColor = getWorstColor();


  const supStyle: React.CSSProperties = {
    'fontSize': (width < breakPoint ? '12px' : '16px'),
    'verticalAlign': 'super',
  };

  const rank = teamHelper.getRank(displaySlice.rank);

  if (rank) {
    supStyle.color = ColorUtil.lerpColor(bestColor, worstColor, (+(rank / CBB.getNumberOfD1Teams(season))));
  }

  const handleSeason = (season) => {
    if (searchParams) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('season', season);
      const search = current.toString();
      const query = search ? `?${search}` : "";
      setSpin(true);
      startTransition(() => {
        router.push(`${pathName}${query}`);
        setSpin(false);
      });
    }
  }


  return (
    <div style = {{'overflow': 'hidden', 'paddingLeft': 5, 'paddingRight': 5}}>
      <div style = {{'display': 'flex', 'flexWrap': 'nowrap'}}>
        <Typography style = {{'whiteSpace': 'nowrap', 'textOverflow': 'ellipsis', 'overflow': 'hidden'}} variant = {(width < breakPoint ? 'h6' : 'h5')}>
          {rank ? <span style = {supStyle}>{rank} </span> : ''}
          {teamHelper.getName()}
          <span style = {{'fontSize': '16px', 'verticalAlign': 'middle'}}>
            <Typography variant = 'overline' color = 'text.secondary'> ({team?.stats.wins || 0}-{team?.stats.losses || 0})</Typography>
          </span>
        </Typography>
        <FavoritePicker team_id = {team?.team_id} />
        <SeasonPicker selected = {season} actionHandler = {handleSeason} />
      </div>
      <div style = {{'display': 'flex', 'justifyContent': 'center'}}>
        <Typography variant = 'overline' color = 'text.secondary'>{teamHelper.getConference()}</Typography>
      </div>
      <BackdropLoader open = {(spin === true)} />
    </div>
  );
}

export default Client;
