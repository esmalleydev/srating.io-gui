'use client';
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import Typography from '@mui/material/Typography';

import HelperCBB from '@/components/helpers/CBB';
import HelperTeam from '@/components/helpers/Team';
import BackdropLoader from '@/components/generic/BackdropLoader';
import { Link, useTheme } from '@mui/material';
import { useAppSelector } from '@/redux/hooks';
import BackButton from '@/components/generic/BackButton';
import Pin from '@/components/generic/CBB/Pin';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';


const ColorUtil = new Color();


const getBreakPoint = () => {
  return 450;
};

const getHeaderHeight = () => {
  const { width } = useWindowDimensions() as Dimensions;

  if (width <= getBreakPoint()) {
    return 110;
  }

  return 120;
};

const getMarginTop = () => {
  const { width } = useWindowDimensions() as Dimensions;

  let margin = 64;

  if (width < 600) {
    margin = 56;
  }

  return margin;
};

export { getHeaderHeight, getMarginTop, getBreakPoint };

const HeaderClientWrapper = ({ cbb_game, children}) => {
  const self = this;
  const router = useRouter();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();

  const { width } = useWindowDimensions() as Dimensions;

  const displaySlice = useAppSelector(state => state.displayReducer.value);

  const [spin, setSpin] = useState(false);

  const CBB = new HelperCBB({
    'cbb_game': cbb_game,
  });

  const handleClick = (team_id) => {
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/team/' + team_id + '?season=' + cbb_game.season);
      setSpin(false);
    });
  }

  const titleStyle: React.CSSProperties = {
    'paddingTop': 5,
    'height': getHeaderHeight(),
    'position': 'sticky',
    'top': getMarginTop(),
    'backgroundColor': theme.palette.background.default,
    'zIndex': 1100,
  };


  let teamNameVariant: string = 'h6';
  let sideWidth = 115;
  let supFontSize = 12;

  let modifier = 150;

  if (CBB.isInProgress() || CBB.isFinal()) {
    modifier = 600;
  }

  if (width < getBreakPoint()) {
    sideWidth = 75;
    teamNameVariant = 'body1';
    supFontSize = 10;
  } else if (width > getBreakPoint() && (width - (sideWidth * 2) - modifier) > 0) {
    sideWidth += (width - (sideWidth * 2) - 150) / 2;
  }

  if (sideWidth > 225) {
    sideWidth = 225;
  }

  const network: React.JSX.Element[] = [];
  if (CBB.getNetwork()) {
    network.push(<Typography key = {CBB.getNetwork()} color = 'text.secondary' variant = 'overline'>{CBB.getNetwork()}</Typography>);
  }

  const getTeam = (team_id) => {
    const team = cbb_game.teams[team_id];
    const teamHelper = new HelperTeam({'team': team});
    const rank = teamHelper.getRank(displaySlice.rank);

    let justifyContent = 'left';
    let teamName = teamHelper.getName();

    if (team_id === cbb_game.home_team_id) {
      justifyContent = 'right';
    }

    if (width < getBreakPoint()) {
      teamName = teamHelper.getNameShort();
    }

    const supStyle: React.CSSProperties = {
      'fontSize': supFontSize,
      'verticalAlign': 'super',
    };

    if (rank) {
      supStyle.color = ColorUtil.lerpColor(getBestColor(), getWorstColor(), (+(rank / CBB.getNumberOfD1Teams(cbb_game.season))));
    }

    return (
      <div>
        <div style = {{'display': 'flex', 'flexWrap': 'nowrap', 'cursor': 'pointer', 'justifyContent': justifyContent}} onClick={() => {handleClick(team_id)}}>
          <Typography style = {{'whiteSpace': 'nowrap', 'textOverflow': 'ellipsis', 'overflow': 'hidden'}} variant = {teamNameVariant as 'h6' | 'body1'}>
            {rank ? <span style = {supStyle}>{rank} </span> : ''}
            <Link style = {{'cursor': 'pointer'}} underline='hover'>{teamName}</Link>
          </Typography>
        </div>
        <div style = {{'fontSize': '16px', 'display': 'flex', 'justifyContent': justifyContent}}>
          <Typography variant = 'overline' color = 'text.secondary'> ({team?.stats?.wins || 0}-{team?.stats?.losses || 0})</Typography>
        </div>
      </div>
    );
  };


  return (
    <>
      <div style = {titleStyle}>
        <div style = {{'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': 5}}>
          <div style = {{'width': sideWidth, 'display': 'flex', 'alignItems': 'baseline'}}>
            <BackButton />
          </div>
          <div><Typography key = {CBB.getNetwork()} color = 'text.secondary' variant = 'overline'>{CBB.getNetwork()}</Typography></div>
          <div style = {{'display': 'flex', 'justifyContent': 'end', 'position': 'relative', 'alignItems': 'baseline', 'width': sideWidth, 'minWidth': sideWidth}}>
            <Pin cbb_game_id = {cbb_game.cbb_game_id} />
          </div>
        </div>
        <div style = {{'display': 'flex', 'justifyContent': 'space-between', 'padding': '0px 5px', 'alignItems': 'center'}}>
          <div style = {{'maxWidth': sideWidth, 'minWidth': sideWidth,}}>{getTeam(cbb_game.away_team_id)}</div>
          <div style = {{'width': '100%'}}>{children}</div>
          <div style = {{'maxWidth': sideWidth, 'minWidth': sideWidth,}}>{getTeam(cbb_game.home_team_id)}</div>
        </div>
      </div>
      <BackdropLoader open = {(spin === true)} />
    </>
  );
}

export default HeaderClientWrapper;