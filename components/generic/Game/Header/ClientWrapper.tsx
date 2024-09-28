'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import Typography from '@mui/material/Typography';

import HelperGame from '@/components/helpers/Game';
import HelperTeam from '@/components/helpers/Team';
import { Link, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import BackButton from '@/components/generic/BackButton';
import Pin from '@/components/generic/Pin';
import { setLoading } from '@/redux/features/display-slice';
import Rank from './Rank';
import Record from './Record';
import Organization from '@/components/helpers/Organization';


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

const ClientWrapper = ({ game, children }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();

  const { width } = useWindowDimensions() as Dimensions;
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id: game.organization_id });

  const Game = new HelperGame({
    game,
  });

  const handleClick = (team_id) => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/${path}/team/${team_id}?season=${game.season}`);
    });
  };

  const titleStyle: React.CSSProperties = {
    paddingTop: 5,
    height: getHeaderHeight(),
    position: 'sticky',
    top: getMarginTop(),
    backgroundColor: theme.palette.background.default,
    zIndex: 1100,
  };


  let teamNameVariant: string = 'h6';
  let sideWidth = 115;

  let modifier = 150;

  if (Game.isInProgress() || Game.isFinal()) {
    modifier = 600;
  }

  if (width < getBreakPoint()) {
    sideWidth = 75;
    teamNameVariant = 'body1';
  } else if (width > getBreakPoint() && (width - (sideWidth * 2) - modifier) > 0) {
    sideWidth += (width - (sideWidth * 2) - 150) / 2;
  }

  if (sideWidth > 225) {
    sideWidth = 225;
  }

  const network: React.JSX.Element[] = [];
  if (Game.getNetwork()) {
    network.push(<Typography key = {Game.getNetwork()} color = 'text.secondary' variant = 'overline'>{Game.getNetwork()}</Typography>);
  }

  const getTeam = (team_id) => {
    const team = game.teams[team_id];
    const teamHelper = new HelperTeam({ team });

    let justifyContent = 'left';
    let teamName = teamHelper.getName();

    if (team_id === game.home_team_id) {
      justifyContent = 'right';
    }

    if (width < getBreakPoint()) {
      teamName = teamHelper.getNameShort();
    }

    return (
      <div>
        <div style = {{
          display: 'flex', flexWrap: 'nowrap', cursor: 'pointer', justifyContent,
        }} onClick={() => { handleClick(team_id); }}>
          <Typography style = {{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} variant = {teamNameVariant as 'h6' | 'body1'}>
            <Rank game={game} team_id={team_id} />
            <Link style = {{ cursor: 'pointer' }} underline='hover'>{teamName}</Link>
          </Typography>
        </div>
        <div style = {{ fontSize: '16px', display: 'flex', justifyContent }}>
          <Record game={game} team_id={team_id} />
        </div>
      </div>
    );
  };


  return (
    <>
      <div style = {titleStyle}>
        <div style = {{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <div style = {{ width: sideWidth, display: 'flex', alignItems: 'baseline' }}>
            <BackButton />
          </div>
          <div><Typography key = {Game.getNetwork()} color = 'text.secondary' variant = 'overline'>{Game.getNetwork()}</Typography></div>
          <div style = {{
            display: 'flex', justifyContent: 'end', position: 'relative', alignItems: 'baseline', width: sideWidth, minWidth: sideWidth,
          }}>
            <Pin game_id = {game.game_id} />
          </div>
        </div>
        <div style = {{
          display: 'flex', justifyContent: 'space-between', padding: '0px 5px', alignItems: 'center',
        }}>
          <div style = {{ maxWidth: sideWidth, minWidth: sideWidth }}>{getTeam(game.away_team_id)}</div>
          <div style = {{ width: '100%' }}>{children}</div>
          <div style = {{ maxWidth: sideWidth, minWidth: sideWidth }}>{getTeam(game.home_team_id)}</div>
        </div>
      </div>
    </>
  );
};

export default ClientWrapper;
