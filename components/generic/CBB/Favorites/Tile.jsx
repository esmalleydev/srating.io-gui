'use client';
import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

import moment from 'moment';

import HelperCBB from '../../../helpers/CBB';

import { useTheme } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import BackdropLoader from '../../BackdropLoader';

const Tile = (props) => {
  const self = this;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const theme = useTheme();
  const [hover, setHover] = useState(false);
  const [spin, setSpin] = useState(false);

  const cbb_game = props.data;

  const CBB = new HelperCBB({
    'cbb_game': cbb_game,
  });


  const { height, width } = useWindowDimensions();


  const handleClick = (e) => {
    if (props.onClick && typeof props.onClick === 'function') {
      props.onClick();
    }
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/games/' + cbb_game.cbb_game_id);
      setSpin(false);
    });
  };

  const handleMouseEnter = (e) => {
    setHover(true);
  };
  
  const handleMouseLeave = (e) => {
    setHover(false);
  };


  const getHeader = () => {
    let startTime = CBB.getTime();

    if (!CBB.isInProgress() && !CBB.isFinal()) {
      startTime = moment(cbb_game.start_datetime).format('MMM Do') + ' - ' + startTime;
    }
    
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
      </div>
    );
  }


  const divStyle = {
    'width': '250px',
    'minWidth': '250px',
    'minHeight': '100px',
    'margin': '5px',
  };

  const teamLineStyle = {
    'cursor': 'pointer',
    'padding': '10px',
  };

  if (hover) {
    teamLineStyle.backgroundColor = theme.palette.action.hover;
  }


  return (
    <Paper elevation={3} style = {divStyle}>
      <BackdropLoader open = {(spin === true)} />
      <div style = {teamLineStyle} onMouseEnter = {handleMouseEnter} onMouseLeave = {handleMouseLeave}>
        {getHeader()}
        <div onClick = {handleClick}>
          {getTeamLine('away')}
          {getTeamLine('home')}
        </div>
      </div>
    </Paper>
  );
}

export default Tile;
