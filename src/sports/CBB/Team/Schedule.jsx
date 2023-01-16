import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import moment from 'moment';

import Tile from './Tile';
import HelperCBB from '../../../helpers/CBB';

const Schedule = (props) => {
  const self = this;
  
  // console.log(props);

  const team = props.team;
  const games = props.games;

  const ranking = props.ranking || {};

  const theme = useTheme();

  let sorted_games = Object.values(team.cbb_games || {}).sort(function (a, b) {
    return a.start_date < b.start_date ? -1 : 1;
  });

  let gameContainers = [];
  let lastMonth = null;
  let lastYear = null;
  let nextUpcomingGame = null;

  for (let i = 0; i < sorted_games.length; i++) {
    let game = sorted_games[i];
    if (!lastMonth || lastMonth < +moment(game.start_datetime).format('MM') || lastYear < +moment(game.start_datetime).format('YYYY')) {
      lastMonth = +moment(game.start_datetime).format('MM');
      lastYear = +moment(game.start_datetime).format('YYYY');
      gameContainers.push(<Typography key = {i} style = {{'marginBottom': '10px'}} variant = 'h5'>{moment(game.start_datetime).format('MMMM')}</Typography>);
    }

    if (!nextUpcomingGame && (game.status === 'pre' || game.status === 'live')) {
      nextUpcomingGame = true;
      gameContainers.push(<Tile key = {game.cbb_game_id} scroll = {true} game = {game} team = {team} />);
    } else {
      gameContainers.push(<Tile key = {game.cbb_game_id} game = {game} team = {team} />);
    }
  }


  return (
    <div>
      {gameContainers}
    </div>
  );
}

export default Schedule;