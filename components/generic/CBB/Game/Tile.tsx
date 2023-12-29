'use client';
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import HelperCBB from '@/components/helpers/CBB';

import { useTheme } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import Locked from '@/components/generic/Billing/Locked';
import BackdropLoader from '@/components/generic/BackdropLoader';
import { Button } from '@mui/material';
import Indicator from '@/components/generic/CBB/Indicator';
import Pin from '@/components/generic/CBB/Pin';

import Color, {getBestColor, getWorstColor} from '@/components/utils/Color';
import { useAppSelector } from '@/redux/hooks';

const ColorUtil = new Color();

const Tile = (props) => {
  const self = this;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const theme = useTheme();
  const [hover, setHover] = useState(false);
  const [spin, setSpin] = useState(false);

  const displaySlice = useAppSelector(state => state.displayReducer.value);

  const game = props.data;

  const CBB = new HelperCBB({
    'cbb_game': game,
  });


  const { height, width } = useWindowDimensions() as Dimensions;


  const handleClick = (e) => {
    if (props.onClick && typeof props.onClick === 'function') {
      props.onClick();
    }
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/games/' + props.data.cbb_game_id);
      setSpin(false);
    });
  };

  const handleMouseEnter = (e) => {
    setHover(true);
  };
  
  const handleMouseLeave = (e) => {
    setHover(false);
  };

  const getIndicators = () => {
    const flexContainer = {
      'display': 'flex',
      'alignItems': 'left',
      'margin': '0px 10px',
    };

    const indicators: React.JSX.Element[] = [];

    if (CBB.isNeutralSite()) {
      indicators.push(
        <Indicator key = {'N'} title = {'Neutral site'} code = {'N'} color = {'#ffa726'} />
      );
    }

    return (
      <div style = {flexContainer} >
        {indicators}
      </div>
    );
  };

  const getHeader = () => {
    const flexContainer = {
      'display': 'flex',
      'alignItems': 'center',
    };

    const timeStyle = {
      'flex': 1,
      'height': '36px',
      'lineHeight': '36px',
    };

    // if (hover) {
    //   flexContainer.backgroundColor = theme.palette.action.hover;
    // }

    let network: React.JSX.Element[] = [];

    if (!CBB.isFinal() && CBB.getNetwork()) {
      network.push(<Typography key = {CBB.getNetwork()} sx = {{'marginLeft': '5px'}} color = 'text.secondary' variant = 'overline'>{CBB.getNetwork()}</Typography>);
    }

    return (
      <div style = {flexContainer} >
        <div style = {timeStyle}><Typography color = {CBB.isInProgress() ? 'info.dark' : 'text.secondary'} variant = 'overline'>{CBB.getTime()}</Typography>{network}</div>
        <Pin cbb_game_id = {props.data.cbb_game_id}  />
      </div>
    );
  };

  const getOddsLine = () => {
    const awaySpreadCoverStyle: React.CSSProperties = {};
    const homeSpreadCoverStyle: React.CSSProperties = {};
    const awayMLStyle: React.CSSProperties = {};
    const homeMLStyle: React.CSSProperties = {};
    const overStyle: React.CSSProperties = {};
    const underStyle: React.CSSProperties = {};

    let tdAwaySpreadTitle = 'Pre-game spread';
    let tdHomeSpreadTitle = 'Pre-game spread';
    let tdAwayMLTitle = 'Pre-game money line';
    let tdHomeMLTitle = 'Pre-game money line';
    let tdOverTitle = 'Pre-game over';
    let tdUnderTitle = 'Pre-game under';

    if (CBB.isFinal()) {
      if (CBB.coveredSpread('away')) {
        awaySpreadCoverStyle.color = theme.palette.success.main;
        tdAwaySpreadTitle = 'Covered pre spread';
      }
      if (CBB.coveredSpread('home')) {
        homeSpreadCoverStyle.color = theme.palette.success.main;
        tdHomeSpreadTitle = 'Covered pre spread';
      }
      if (CBB.won('away')) {
        awayMLStyle.color = theme.palette.success.main;
        tdAwayMLTitle = 'Covered money line';
      }
      if (CBB.won('home')) {
        homeMLStyle.color = theme.palette.success.main;
        tdHomeMLTitle = 'Covered money line';
      }
      if (CBB.coveredOver()) {
        overStyle.color = theme.palette.success.main;
        tdOverTitle = 'Covered over';
      }
      if (CBB.coveredUnder()) {
        underStyle.color = theme.palette.success.main;
        tdUnderTitle = 'Covered under';
      }
    } else if (CBB.isInProgress()) {
      tdAwaySpreadTitle = 'Pre / Live spread';
      tdAwayMLTitle = 'Pre / Live money line';
      tdOverTitle = 'Pre / Live over';
      tdHomeSpreadTitle = 'Pre / Live spread';
      tdHomeMLTitle = 'Pre / Live money line';
      tdUnderTitle = 'Pre / Live under';
    }

    return (
      <table style = {{'width': '100%', 'textAlign': 'center'}}>
        <thead>
          <tr>
            <th style = {{'textAlign': 'left'}}><Typography variant = 'caption'>-</Typography></th>
            <th><Typography variant = 'caption'>SPREAD</Typography></th>
            <th><Typography variant = 'caption'>ML</Typography></th>
            <th><Typography variant = 'caption'>O/U</Typography></th>
            <th style = {{'textAlign': 'right'}}><Typography variant = 'caption'>%</Typography></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style = {{'textAlign': 'left'}}><Typography variant = 'caption'>{CBB.getTeamNameShort('away')}</Typography></td>
            <td title = {tdAwaySpreadTitle}><Typography variant = 'caption' style = {awaySpreadCoverStyle}>{CBB.getPreSpread('away')}{CBB.isInProgress() ? ' / ' + CBB.getLiveSpread('away') : ''}</Typography></td>
            <td title = {tdAwayMLTitle} style = {Object.assign({'color': CBB.oddsReversal('away') ? theme.palette.warning.main : theme.palette.text.primary}, awayMLStyle)}><Typography variant = 'caption'>{CBB.getPreML('away')}{CBB.isInProgress() ? ' / ' + CBB.getLiveML('away') : ''}</Typography></td>
            <td title = {tdOverTitle}><Typography variant = 'caption' style = {overStyle}>{CBB.getPreOver() !== '-' ? 'O ' + CBB.getPreOver() : '-'}{CBB.isInProgress() ? ' / ' + CBB.getLiveOver() : ''}</Typography></td>
            <td style = {{'textAlign': 'right'}}>{
              (props.data.away_team_rating === null && props.data.home_team_rating === null) ? <Locked />
              : <Typography variant = 'caption'>{(props.data.away_team_rating * 100).toFixed(0)}</Typography>
            }</td>
          </tr>
          <tr>
            <td style = {{'textAlign': 'left'}}><Typography variant = 'caption'>{CBB.getTeamNameShort('home')}</Typography></td>
            <td title = {tdHomeSpreadTitle}><Typography variant = 'caption' style = {homeSpreadCoverStyle}>{CBB.getPreSpread('home')}{CBB.isInProgress() ? ' / ' + CBB.getLiveSpread('home') : ''}</Typography></td>
            <td title = {tdHomeMLTitle} style = {Object.assign({'color': CBB.oddsReversal('home') ? theme.palette.warning.main : theme.palette.text.primary}, homeMLStyle)}><Typography variant = 'caption'>{CBB.getPreML('home')}{CBB.isInProgress() ? ' / ' + CBB.getLiveML('home') : ''}</Typography></td>
            <td title = {tdUnderTitle}><Typography variant = 'caption' style = {underStyle}>{CBB.getPreUnder() !== '-' ? 'U ' + CBB.getPreUnder() : '-'}{CBB.isInProgress() ? ' / ' + CBB.getLiveUnder() : ''}</Typography></td>
            <td style = {{'textAlign': 'right'}}>{
              (props.data.away_team_rating === null && props.data.home_team_rating === null) ? <Locked />
              : <Typography variant = 'caption'>{(props.data.home_team_rating * 100).toFixed(0)}</Typography>
            }</td>
          </tr>
        </tbody>
      </table>
    );
  };


  const getTeamLine = (side) => {
    const flexContainer: React.CSSProperties = {
      'display': 'flex',
      'margin': '5px 0px',
      'alignItems': 'self-end',
    };

    const nameStyle: React.CSSProperties = {
      'flex': 1,
      'whiteSpace': 'nowrap',
      'overflow': 'hidden',
      'textOverflow': 'ellipsis',
    }

    const scoreStyle: React.CSSProperties = {
      'margin': '0px 5px',
      'width': '34px',
      'maxWidth': '34px',
      'border': '2px solid ' + theme.palette.text.secondary,
      'borderRadius': '5px',
      'textAlign': 'center',
      'flex': 2,
    };

    let isPicked = false;
    if (
      (
        side === 'home' &&
        props.data.home_team_rating > props.data.away_team_rating
      ) ||
      (
        side === 'away' &&
        props.data.home_team_rating < props.data.away_team_rating
      )
    ) {
      isPicked = true;
      scoreStyle.border = '2px solid ' + theme.palette.secondary.dark;
    }

    let won = false;
    if (
      (
        side === 'home' &&
        props.data.home_score > props.data.away_score
      ) ||
      (
        side === 'away' &&
        props.data.home_score < props.data.away_score
      )
    ) {
      won = true;
      scoreStyle.backgroundColor = 'rgba(66, 245, 96, 0.5)';
    }
    
    let team_id = props.data[side + '_team_id'];
    let wins = 0;
    let losses = 0;

    if (
      team_id &&
      team_id in props.data.teams &&
      'stats' in props.data.teams[team_id]
    ) {
      wins = props.data.teams[team_id].stats.wins;
      losses = props.data.teams[team_id].stats.losses;
    }

    const supRankStyle: React.CSSProperties = {
      'marginRight': '5px',
      'fontWeight': 700,
    };

    const teamRank = CBB.getTeamRank(side, displaySlice.rank);

    if (teamRank) {
      supRankStyle.color = ColorUtil.lerpColor(getBestColor(), getWorstColor(), (+(teamRank / CBB.getNumberOfD1Teams(game.season))));
    }

    return (
      <div>
        <div style = {flexContainer} >
          <div style = {nameStyle}>
            <Typography variant = 'h6' sx = {{'fontSize': 14, 'display': 'inline-block'}}>
              {teamRank ?
                <Typography variant = 'overline' color = 'text.secondary' sx = {{'fontSize': 12}}><sup style = {supRankStyle}>{teamRank}</sup></Typography> :
               ''}
              {CBB.getTeamName(side)}
              </Typography>
            <Typography variant = 'overline' color = 'text.secondary'> ({wins}-{losses})</Typography>
          </div>
          <div style = {scoreStyle}>{CBB.isInProgress() || CBB.isFinal() ? props.data[side + '_score'] : '-'}</div>
        </div>
      </div>
    );
  };

  let tileWidth = '320px';

  if (width >= 425) {
    tileWidth = '425px';
  } else if (width < 425 && width > 320) {
    tileWidth = '100%';
  }

  const divStyle = {
    'width': tileWidth,
    'minHeight': '100px',
    'margin': '5px',
  };

  const teamLineStyle: React.CSSProperties = {
    // 'cursor': 'pointer',
    'padding': '10px',
  };

  if (hover) {
    teamLineStyle.backgroundColor = theme.palette.action.hover;
  }

  return (
    <Paper elevation={3} style = {divStyle}>
      <BackdropLoader open = {(spin === true)} />
      {getIndicators()}
      <div style = {teamLineStyle}>
        {getHeader()}
        <div style = {{'cursor': 'pointer'}} onClick={handleClick}>
          {getTeamLine('away')}
          {getTeamLine('home')}
        </div>
      </div>
      <div style = {{'padding': '0px 10px 10px 10px'}}>
        <hr style ={{'marginTop': 0}} />
        {getOddsLine()}
      </div>
      <div style = {{'textAlign': 'right'}}>
        <Button onClick = {handleClick}>View game / stats / matchup</Button>
      </div>
    </Paper>
  );
}

export default Tile;
