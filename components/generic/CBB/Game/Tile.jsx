'use client';
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

import HelperCBB from '../../../helpers/CBB';

import { useTheme } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PinIcon from '@mui/icons-material/PushPin';
import Locked from '../../Billing/Locked';
import BackdropLoader from '../../BackdropLoader';
import { Button } from '@mui/material';
import Indicator from '../Indicator';

const Tile = (props) => {
  const self = this;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const theme = useTheme();
  const [hover, setHover] = useState(false);
  const [pin, setPin] = useState(props.isPinned || false);
  const [spin, setSpin] = useState(false);

  const CBB = new HelperCBB({
    'cbb_game': props.data,
  });


  const { height, width } = useWindowDimensions();


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

  const handlePin = () => {
    if (props.actionPin) {
      props.actionPin(props.data.cbb_game_id);
    }
    setPin(!pin);
  };

  const getIndicators = () => {
    const flexContainer = {
      'display': 'flex',
      'alignItems': 'left',
      'margin': '0px 10px',
    };

    const indicators = [];

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

    let network = [];

    if (!CBB.isFinal() && CBB.getNetwork()) {
      network.push(<Typography key = {CBB.getNetwork()} sx = {{'marginLeft': '5px'}} color = 'text.secondary' variant = 'overline'>{CBB.getNetwork()}</Typography>);
    }

    return (
      <div style = {flexContainer} >
        <div style = {timeStyle}><Typography color = {CBB.isInProgress() ? 'info.dark' : 'text.secondary'} variant = 'overline'>{CBB.getTime()}</Typography>{network}</div>
        <IconButton id = {'pin-'+props.data.cbb_game_id} onClick = {handlePin} style = {{'marginLeft': 20}}>
          <PinIcon sx = {pinStyle} fontSize = 'small' />
        </IconButton>
      </div>
    );
  };

  const getOddsLine = () => {
    const awaySpreadCoverStyle = {};
    const homeSpreadCoverStyle = {};
    const awayMLStyle = {};
    const homeMLStyle = {};
    const overStyle = {};
    const underStyle = {};

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
    const flexContainer = {
      'display': 'flex',
      'margin': '5px 0px',
      'alignItems': 'self-end',
    };

    const nameStyle = {
      'flex': 1,
      'whiteSpace': 'nowrap',
      'overflow': 'hidden',
      'textOverflow': 'ellipsis',
    }

    const scoreStyle = {
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

    return (
      <div>
        <div style = {flexContainer} >
          <div style = {nameStyle}>
            <Typography variant = 'h6' sx = {{'fontSize': 14, 'display': 'inline-block'}}>{CBB.getTeamRank(side, props.rankDisplay) ? <Typography variant = 'overline' color = 'text.secondary' sx = {{'fontSize': 12}}><sup style = {{'marginRight': '5px'}}>{CBB.getTeamRank(side, props.rankDisplay)}</sup></Typography> : ''}{CBB.getTeamName(side)}</Typography>
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

  const teamLineStyle = {
    // 'cursor': 'pointer',
    'padding': '10px',
  };

  const pinStyle = {};

  if (hover) {
    teamLineStyle.backgroundColor = theme.palette.action.hover;
  }

  if (pin) {
    pinStyle.color = theme.palette.warning.light;
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
