import React, { useState } from 'react';
// import { useTheme } from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';

import moment from 'moment';

import Tile from './Tile.tsx';
import Api from './../../../Api.jsx';


const api = new Api();

let season_ = null;

// TODO fix the scrollintoview for the tiles, for novemeber it scrolls past the element, even with the scrollmargintop set

const Schedule = (props) => {
  const self = this;

  const season = props.season;
  const team = props.team;

  // const theme = useTheme();

  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);


  if (season_ && season_ != season) {
    setRequested(false);
    setData(null);
    setLoading(true);
  }

  season_ = season;


  if (!requested) {
    setLoading(true);
    setRequested(true);
    api.Request({
      'class': 'team',
      'function': 'getSchedule',
      'arguments': {
        'team_id': team.team_id,
        'season': season,
      },
    }).then((response) => {
      setData(response || {});
      setLoading(false);
    }).catch((e) => {
      setData({});
      setLoading(false);
    });
  }

  if (loading) {
    return <div style = {{'display': 'flex', 'justifyContent': 'center', 'paddingTop': 68}}><CircularProgress /></div>;
  }

  let sorted_games = Object.values(data || {}).sort(function (a, b) {
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
      gameContainers.push(<Typography key = {i} style = {{'marginBottom': '10px'}} variant = 'h6'>{moment(game.start_datetime).format('MMMM \'YY')}</Typography>);
    }

    if (!nextUpcomingGame && (game.status === 'pre' || game.status === 'live')) {
      nextUpcomingGame = true;
      gameContainers.push(<Tile key = {game.cbb_game_id} /*scroll = {true}*/ game = {game} team = {team} />);
    } else {
      gameContainers.push(<Tile key = {game.cbb_game_id} game = {game} team = {team} />);
    }
  }


  return (
    <div style = {{'padding': '68px 5px 20px 5px'}}>
      {gameContainers}
    </div>
  );
}

export default Schedule;