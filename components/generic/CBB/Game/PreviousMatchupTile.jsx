import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import moment from 'moment';

import HelperCBB from '../../../helpers/CBB';


const PreviousMatchupTile = (props) => {
  const self = this;
  const { height, width } = useWindowDimensions();

  const theme = useTheme();

  const game = props.game;

  const CBB = new HelperCBB({
    'cbb_game': game,
  });

  const getColor = (side) => {
    if (side === 'away' && game.away_score > game.home_score) {
      return theme.palette.success.light;
    }

    if (side === 'home' && game.away_score < game.home_score) {
      return theme.palette.success.light;
    }

    return theme.palette.text.primary;
  };

  const getTitle = () => {
    let team = null;
    if (game.away_score > game.home_score) {
      team = CBB.getTeamName('away') + ' @';
    } else if (game.away_score < game.home_score) {
      team = CBB.getTeamName('home');
    }

    return <span style = {{'color': theme.palette.success.light}}>{team}</span>;
  };

  const getScore = () => {
    let score = null;
    if (game.away_score > game.home_score) {
      score = game.away_score + ' - ' + game.home_score;
    } else if (game.away_score < game.home_score) {
      score = game.home_score + ' - ' + game.away_score;
    }

    return <span>{score}</span>;
  };

  return (
    <Paper elevation = {3} style = {{'margin': '5px 10px', 'padding': 10}}>
      <div>
        <Typography variant = 'body2'>{moment(game.start_date).format('MMM Do, YYYY')}</Typography>
        <Typography variant = 'body1'>{getTitle()} ({getScore()})</Typography>
      </div>
    </Paper>
  );
}

export default PreviousMatchupTile;