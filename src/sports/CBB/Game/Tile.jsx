import React from 'react';
import { useNavigate } from "react-router-dom";
import useWindowDimensions from '../../../hooks/useWindowDimensions';

import HelperCBB from '../../../helpers/CBB';

import { useTheme } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import PicksIcon from '@mui/icons-material/Casino';
import MoneyIcon from '@mui/icons-material/CrisisAlert';

const Tile = (props) => {
  const self = this;
  const navigate = useNavigate();
  const theme = useTheme();

  const CBB = new HelperCBB({
    'cbb_game': props.data,
  });


  const { height, width } = useWindowDimensions();


  const handleClick = (e) => {
    if (props.onClick && typeof props.onClick === 'function') {
      props.onClick();
    }
    navigate('/CBB/Games/' + props.data.cbb_game_id);
  }

  const getHeader = () => {
    let startTime = CBB.getTime();
    
    const flexContainer = {
      'display': 'flex',
    };

    const timeStyle = {
      'flex': 1,
      'color': CBB.isInProgress() ? theme.palette.info.dark : theme.palette.text.primary,
    };

    return (
      <div style = {flexContainer} >
        <div style = {timeStyle}>{startTime}</div>
      </div>
    );
  }

  const getOddsLine = () => {
    return (
      <table style = {{'width': '100%', 'textAlign': 'center'}}>
        <thead>
          <th style = {{'textAlign': 'left'}}><Typography variant = 'caption'>-</Typography></th>
          <th><Typography variant = 'caption'>SPREAD</Typography></th>
          <th><Typography variant = 'caption'>ML</Typography></th>
          <th><Typography variant = 'caption'>O/U</Typography></th>
        </thead>
        <tbody>
          <tr>
            <td style = {{'textAlign': 'left'}}><Typography variant = 'caption'>{CBB.getTeamNameShort('away')}</Typography></td>
            <td><Typography variant = 'caption'>{CBB.getPreSpread('away')}{CBB.isInProgress() ? ' / ' + CBB.getLiveSpread('away') : ''}</Typography></td>
            <td style = {{'color': CBB.oddsReversal('away') ? theme.palette.warning.main : theme.palette.text.primary}}><Typography variant = 'caption'>{CBB.getPreML('away')}{CBB.isInProgress() ? ' / ' + CBB.getLiveML('away') : ''}</Typography></td>
            <td><Typography variant = 'caption'>{CBB.getPreOver() !== '-' ? 'O ' + CBB.getPreOver() : '-'}{CBB.isInProgress() ? ' / ' + CBB.getLiveOver() : ''}</Typography></td>
          </tr>
          <tr>
            <td style = {{'textAlign': 'left'}}><Typography variant = 'caption'>{CBB.getTeamNameShort('home')}</Typography></td>
            <td><Typography variant = 'caption'>{CBB.getPreSpread('home')}{CBB.isInProgress() ? ' / ' + CBB.getLiveSpread('home') : ''}</Typography></td>
            <td style = {{'color': CBB.oddsReversal('home') ? theme.palette.warning.main : theme.palette.text.primary}}><Typography variant = 'caption'>{CBB.getPreML('home')}{CBB.isInProgress() ? ' / ' + CBB.getLiveML('home') : ''}</Typography></td>
            <td><Typography variant = 'caption'>{CBB.getPreUnder() !== '-' ? 'U ' + CBB.getPreUnder() : '-'}{CBB.isInProgress() ? ' / ' + CBB.getLiveUnder() : ''}</Typography></td>
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
        <div style = {{'flex': 5, 'maxWidth': '25px', 'textAlign': 'center'}}>{
          isPicked ?
          <Tooltip disableFocusListener disableTouchListener placement = 'top' title={(props.data[side+'_team_rating'] * 100) + '%'}>
            <PicksIcon sx = {{'verticalAlign': 'middle'}} fontSize = 'small'  color={props.data.status === 'final' ? ( won ? 'success' : 'error') : 'secondary'} />
          </Tooltip>
          : ''
        }</div>
      </div>
    );
  }


  const divStyle = {
    'width': width > 420 ? '375px' : '320px',
    'minHeight': '100px',
    'margin': '5px',
    'cursor': 'pointer',
    'padding': '10px',
  };

  return (
    <Paper elevation={3} style = {divStyle}  onClick={handleClick}>
      {getHeader()}
      {getTeamLine('away')}
      {getTeamLine('home')}
      {CBB.isFinal() ? '' : <hr />}
      {CBB.isFinal() ? '' : getOddsLine()}
    </Paper>
  );
}

export default Tile;
