import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

import HelperCBB from '../../../helpers/CBB';

import { useTheme } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import PicksIcon from '@mui/icons-material/Casino';
import MoneyIcon from '@mui/icons-material/CrisisAlert';
import PinIcon from '@mui/icons-material/PushPin';

const Tile = (props) => {
  const self = this;
  const router = useRouter();
  const theme = useTheme();
  const [hover, setHover] = useState(false);
  const [pin, setPin] = useState(props.isPinned || false);

  const CBB = new HelperCBB({
    'cbb_game': props.data,
  });


  const { height, width } = useWindowDimensions();


  const handleClick = (e) => {
    if (props.onClick && typeof props.onClick === 'function') {
      props.onClick();
    }
    router.push('/cbb/games/' + props.data.cbb_game_id);
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

  const getHeader = () => {
    let startTime = CBB.getTime();
    
    const flexContainer = {
      'display': 'flex',
      'alignItems': 'center',
    };

    const timeStyle = {
      'flex': 1,
      'color': CBB.isInProgress() ? theme.palette.info.dark : theme.palette.text.primary,
      'cursor': 'pointer',
      // this is just to remove the small click deadzone
      'height': '36px',
      'lineHeight': '36px',
    };

    // if (hover) {
    //   flexContainer.backgroundColor = theme.palette.action.hover;
    // }

    return (
      <div style = {flexContainer} >
        <div style = {timeStyle}>{startTime}</div>
        <IconButton id = {'pin-'+props.data.cbb_game_id} onClick = {handlePin} style = {{'marginLeft': 20}}>
          <PinIcon sx = {pinStyle} fontSize = 'small' />
        </IconButton>
      </div>
    );
  }

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
          <th style = {{'textAlign': 'left'}}><Typography variant = 'caption'>-</Typography></th>
          <th><Typography variant = 'caption'>SPREAD</Typography></th>
          <th><Typography variant = 'caption'>ML</Typography></th>
          <th><Typography variant = 'caption'>O/U</Typography></th>
          <th style = {{'textAlign': 'right'}}><Typography variant = 'caption'>%</Typography></th>
        </thead>
        <tbody>
          <tr>
            <td style = {{'textAlign': 'left'}}><Typography variant = 'caption'>{CBB.getTeamNameShort('away')}</Typography></td>
            <td title = {tdAwaySpreadTitle}><Typography variant = 'caption' style = {awaySpreadCoverStyle}>{CBB.getPreSpread('away')}{CBB.isInProgress() ? ' / ' + CBB.getLiveSpread('away') : ''}</Typography></td>
            <td title = {tdAwayMLTitle} style = {Object.assign({'color': CBB.oddsReversal('away') ? theme.palette.warning.main : theme.palette.text.primary}, awayMLStyle)}><Typography variant = 'caption'>{CBB.getPreML('away')}{CBB.isInProgress() ? ' / ' + CBB.getLiveML('away') : ''}</Typography></td>
            <td title = {tdOverTitle}><Typography variant = 'caption' style = {overStyle}>{CBB.getPreOver() !== '-' ? 'O ' + CBB.getPreOver() : '-'}{CBB.isInProgress() ? ' / ' + CBB.getLiveOver() : ''}</Typography></td>
            <td style = {{'textAlign': 'right'}}><Typography variant = 'caption'>{(props.data.away_team_rating * 100).toFixed(0)}</Typography></td>
          </tr>
          <tr>
            <td style = {{'textAlign': 'left'}}><Typography variant = 'caption'>{CBB.getTeamNameShort('home')}</Typography></td>
            <td title = {tdHomeSpreadTitle}><Typography variant = 'caption' style = {homeSpreadCoverStyle}>{CBB.getPreSpread('home')}{CBB.isInProgress() ? ' / ' + CBB.getLiveSpread('home') : ''}</Typography></td>
            <td title = {tdHomeMLTitle} style = {Object.assign({'color': CBB.oddsReversal('home') ? theme.palette.warning.main : theme.palette.text.primary}, homeMLStyle)}><Typography variant = 'caption'>{CBB.getPreML('home')}{CBB.isInProgress() ? ' / ' + CBB.getLiveML('home') : ''}</Typography></td>
            <td title = {tdUnderTitle}><Typography variant = 'caption' style = {underStyle}>{CBB.getPreUnder() !== '-' ? 'U ' + CBB.getPreUnder() : '-'}{CBB.isInProgress() ? ' / ' + CBB.getLiveUnder() : ''}</Typography></td>
            <td style = {{'textAlign': 'right'}}><Typography variant = 'caption'>{(props.data.home_team_rating * 100).toFixed(0)}</Typography></td>
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
      'border': '1px solid black',
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

    return (
      <div style = {flexContainer} >
        <div style = {nameStyle}>{CBB.getTeamRank(side, props.rankDisplay) ? <sup style = {{'marginRight': '5px'}}>{CBB.getTeamRank(side, props.rankDisplay)}</sup> : ''}{CBB.getTeamName(side)}</div>
        <div style = {scoreStyle}>{CBB.isInProgress() || CBB.isFinal() ? props.data[side + '_score'] : '-'}</div>
        {/*<div style = {{'flex': 5, 'maxWidth': '25px', 'textAlign': 'center'}}>{
          isPicked ?
          <Tooltip disableFocusListener disableTouchListener placement = 'top' title={(props.data[side+'_team_rating'] * 100) + '%'}>
            <PicksIcon sx = {{'verticalAlign': 'middle'}} fontSize = 'small'  color={props.data.status === 'final' ? ( won ? 'success' : 'error') : 'secondary'} />
          </Tooltip>
          : ''
        }</div>*/}
      </div>
    );
  }


  const divStyle = {
    'width': width > 420 ? '375px' : '320px',
    'minHeight': '100px',
    'margin': '5px',
  };

  const teamLineStyle = {
    'cursor': 'pointer',
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
      <div style = {teamLineStyle} onMouseEnter = {handleMouseEnter} onMouseLeave = {handleMouseLeave}>
        {getHeader()}
        <div onClick = {handleClick}>
          {getTeamLine('away')}
          {getTeamLine('home')}
        </div>
      </div>
      <div style = {{'padding': '0px 10px 10px 10px'}}>
        <hr style ={{'marginTop': 0}} />
        {getOddsLine()}
      </div>
    </Paper>
  );
}

export default Tile;
