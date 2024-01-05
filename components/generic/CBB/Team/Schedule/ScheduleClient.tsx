'use client';
import React, { useState } from 'react';

import Typography from '@mui/material/Typography';

import moment from 'moment';

import Tile from '@/components/generic/CBB/Team/Tile';


const ScheduleClient = ({schedule, team_id}: {schedule: object, team_id: string}) => {
  let sorted_games = Object.values(schedule || {}).sort(function (a, b) {
    return a.start_date < b.start_date ? -1 : 1;
  });

  let gameContainers: React.JSX.Element[] = [];
  let lastMonth: number | null = null;
  let lastYear: number | null = null;
  let nextUpcomingGame: boolean | null = null;

  for (let i = 0; i < sorted_games.length; i++) {
    let game = sorted_games[i];
    if (!lastMonth || lastMonth < +moment(game.start_datetime).format('MM') || (lastYear && lastYear < +moment(game.start_datetime).format('YYYY'))) {
      lastMonth = +moment(game.start_datetime).format('MM');
      lastYear = +moment(game.start_datetime).format('YYYY');
      gameContainers.push(<Typography key = {i} style = {{'marginBottom': '10px', 'padding': 5}} variant = 'h6'>{moment(game.start_datetime).format('MMMM')}</Typography>);
    }

    if (!nextUpcomingGame && (game.status === 'pre' || game.status === 'live')) {
      nextUpcomingGame = true;
      gameContainers.push(<Tile key = {game.cbb_game_id} /*scroll = {true}*/ game = {game} team = {game.teams[team_id]} />);
    } else {
      gameContainers.push(<Tile key = {game.cbb_game_id} game = {game} team = {game.teams[team_id]} />);
    }
  }


  return (
    <>
      {gameContainers}
    </>
  );
}

export default ScheduleClient;