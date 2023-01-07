import React from 'react';
import { useNavigate } from "react-router-dom";
import useWindowDimensions from '../../../hooks/useWindowDimensions';

import HelperCBB from '../../../helpers/CBB';

import { useTheme } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import PicksIcon from '@mui/icons-material/Casino';
import MoneyIcon from '@mui/icons-material/CrisisAlert';
import Tooltip from '@mui/material/Tooltip';

const Tile = (props) => {
  const self = this;
  const navigate = useNavigate();
  const theme = useTheme();

  const CBB = new HelperCBB({
    'cbb_game': props.data,
  });


  const { height, width } = useWindowDimensions();


  const handleClick = (e) => {
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

    const scoreStyle = {
      'margin': '0px 5px',
      'width': '34px',
      'maxWidth': '34px',
      'flex': 2,
    };

    const liveStyle = {
      'margin': '0px 5px',
      'width': '50px',
      'maxWidth': '50px',
      'textAlign': 'right',
      'flex': 3,
    };

    const preStyle = {
      'margin': '0px 5px',
      'width': '50px',
      'maxWidth': '50px',
      'textAlign': 'right',
      'flex': 4,
    };

    return (
      <div style = {flexContainer} >
        <div style = {timeStyle}>{startTime}</div>
        <div style = {scoreStyle}></div>
        <div style = {liveStyle}>Live</div>
        <div style = {preStyle}>Pre</div>
        <div style = {{'flex': 5, 'maxWidth': '25px'}}></div>
      </div>
    );
  }


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

    const liveStyle = {
      'margin': '0px 5px',
      'width': 'auto',
      'maxWidth': '50px',
      'textAlign': 'right',
      'flex': 3,
      'color': CBB.oddsReversal(side) ? theme.palette.warning.main : theme.palette.text.primary,
      // 'border': oddsReversal(side) ? '1px solid ' + theme.palette.warning.main : 'none',
    };

    const preStyle = {
      'margin': '0px 5px',
      'width': '50px',
      'maxWidth': '50px',
      'textAlign': 'right',
      'flex': 4,
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
        <div style = {liveStyle}>{CBB.oddsReversal(side) ? <MoneyIcon sx = {{'verticalAlign': 'middle'}} fontSize = 'small' color = {theme.palette.warning.main} /> : ''}{CBB.getLiveOdds(side)}</div>
        <div style = {preStyle}>{CBB.getPreOdds(side)}</div>
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
      <hr />
      {getTeamLine('away')}
      {getTeamLine('home')}
    </Paper>
  );
}

export default Tile;
