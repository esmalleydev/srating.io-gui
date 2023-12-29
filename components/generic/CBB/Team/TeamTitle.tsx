'use client';
import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import SeasonPicker from '@/components/generic/CBB/SeasonPicker';
import FavoritePicker from '@/components/generic/FavoritePicker';
import HelperCBB from '@/components/helpers/CBB';
import HelperTeam from '@/components/helpers/Team';
import BackdropLoader from '@/components/generic/BackdropLoader';
import AdditionalOptions from '@/components/generic/CBB/Team/AdditionalOptions';
import { useAppSelector } from '@/redux/hooks';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import BackButton from '@/components/generic/BackButton';

const ColorUtil = new Color();

const breakPoint = 450;

const getHeaderHeight = () => {
  const { width } = useWindowDimensions() as Dimensions;

  if (width <= breakPoint) {
    return 110;
  }

  return 75;
};

const getMarginTop = () => {
  const { width } = useWindowDimensions() as Dimensions;

  let margin = 64;

  if (width < 600) {
    margin = 56;
  }

  return margin;
};

export { getHeaderHeight, getMarginTop };

const TeamTitle = ({season, team}) => {
  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const { width } = useWindowDimensions() as Dimensions;

  const displaySlice = useAppSelector(state => state.displayReducer.value);

  const [isPending, startTransition] = useTransition();

  const [spin, setSpin] = useState(false);

  const teamHelper = new HelperTeam({'team': team});

  const CBB = new HelperCBB();

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

  const titleStyle: React.CSSProperties = {
    'paddingTop': 5,
    'height': getHeaderHeight(),
    'position': 'sticky',
    'top': getMarginTop(),
    'backgroundColor': theme.palette.background.default,
    'zIndex': 1100,
  };

  const supStyle: React.CSSProperties = {
    'fontSize': '20px',
    'verticalAlign': 'super',
  };

  const rank = teamHelper.getRank(displaySlice.rank);

  if (rank) {
    supStyle.color = ColorUtil.lerpColor(getBestColor(), getWorstColor(), (+(rank / CBB.getNumberOfD1Teams(season))));
  }

  const sideWidth = 115;

  // todo make the conference name clickable some day

  const getTeamTitle = () => {
    return (
      <div style = {{'overflow': 'hidden', 'paddingLeft': 5, 'paddingRight': 5}}>
        <div style = {{'display': 'flex', 'flexWrap': 'nowrap'}}>
          <Typography style = {{'whiteSpace': 'nowrap', 'textOverflow': 'ellipsis', 'overflow': 'hidden'}} variant = {'h5'}>
            {rank ? <span style = {supStyle}>{rank} </span> : ''}
            {teamHelper.getName()}
            <span style = {{'fontSize': '16px', 'verticalAlign': 'middle'}}>
              <Typography variant = 'overline' color = 'text.secondary'> ({team.stats.wins || 0}-{team.stats.losses || 0})</Typography>
            </span>
          </Typography>
          <FavoritePicker team_id = {team.team_id} />
        </div>
        <div style = {{'display': 'flex', 'justifyContent': 'center'}}>
          <Typography variant = 'overline' color = 'text.secondary'>{teamHelper.getConference()}</Typography>
        </div>
      </div>
    );
  };

  return (
    <>
      <div style = {titleStyle}>
        <div style = {{'display': 'flex', 'justifyContent': 'space-between'}}>
          <div style = {{'width': sideWidth, 'display': 'flex', 'alignItems': 'baseline'}}>
            <BackButton />
          </div>
          {width > breakPoint ? getTeamTitle() : ''}
          <div style = {{'display': 'flex', 'justifyContent': 'end', 'position': 'relative', 'alignItems': 'baseline', 'width': sideWidth, 'minWidth': sideWidth}}>
            <SeasonPicker selected = {season} actionHandler = {handleSeason} />
            <AdditionalOptions />
          </div>
        </div>
        {width <= breakPoint ? 
          <div style = {{'display': 'flex', 'justifyContent': 'center'}}>
            {getTeamTitle()}
          </div>
        : ''}
      </div>
      <BackdropLoader open = {(spin === true)} />
    </>
  );
}

export default TeamTitle;