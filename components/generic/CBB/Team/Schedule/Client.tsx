'use client';
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

import moment from 'moment';

import Tile from '@/components/generic/CBB/Team/Schedule/Tile';
import { getNavHeaderHeight } from '../NavBar';
import { getSubNavHeaderHeight } from '../SubNavbar';
import { useAppSelector } from '@/redux/hooks';
import Differentials from './Differentials';
import { useScrollContext } from '@/contexts/scrollContext';
import TableView from './TableView';


const Client = ({cbb_games, team_id}: {cbb_games: object, team_id: string}) => {
  const paddingTop = getNavHeaderHeight() + getSubNavHeaderHeight();

  const predictions = useAppSelector(state => state.teamReducer.schedulePredictions);
  const scheduleView = useAppSelector(state => state.teamReducer.scheduleView);
  const showScheduleDifferentials = useAppSelector(state => state.teamReducer.showScheduleDifferentials);
  const visibleScheduleDifferentials = useAppSelector(state => state.teamReducer.visibleScheduleDifferentials);
  const scrollTop = useAppSelector(state => state.teamReducer.scrollTop);

  const [firstRender, setFirstRender] = useState(true);

  const scrollRef  = useScrollContext();
  
  
  useEffect(() => {
    if (firstRender && scrollRef && scrollRef.current) {
      // todo something in nextjs is setting scrolltop to zero right after this, so trick it by putting this at the end of the execution :)
      // https://github.com/vercel/next.js/issues/20951
      setTimeout(function() {
        if (scrollRef && scrollRef.current) {
          scrollRef.current.scrollTop = scrollTop;
        }
      }, 1);
    }
    setFirstRender(false);
  });

  for (let cbb_game_id in predictions) {
    if (cbb_game_id in cbb_games) {
      Object.assign(cbb_games[cbb_game_id], predictions[cbb_game_id]);
    }
  }

  let sorted_games = Object.values(cbb_games || {}).sort(function (a, b) {
    return a.start_date < b.start_date ? -1 : 1;
  });

  let gameContainers: React.JSX.Element[] = [];
  let lastMonth: number | null = null;
  let lastYear: number | null = null;
  let nextUpcomingGame: boolean | null = null;

  if (scheduleView === 'default') {
    for (let i = 0; i < sorted_games.length; i++) {
      const cbb_game = sorted_games[i];
      if (!lastMonth || lastMonth < +moment(cbb_game.start_datetime).format('MM') || (lastYear && lastYear < +moment(cbb_game.start_datetime).format('YYYY'))) {
        lastMonth = +moment(cbb_game.start_datetime).format('MM');
        lastYear = +moment(cbb_game.start_datetime).format('YYYY');
        gameContainers.push(<Typography key = {i} style = {{'marginBottom': '10px', 'padding': 5}} variant = 'body1'>{moment(cbb_game.start_datetime).format('MMMM')}</Typography>);
      }
  
      if (!nextUpcomingGame && (cbb_game.status === 'pre' || cbb_game.status === 'live')) {
        nextUpcomingGame = true;
        gameContainers.push(<Tile key = {cbb_game.cbb_game_id} /*scroll = {true}*/ cbb_game = {cbb_game} team = {cbb_game.teams[team_id]} />);
      } else {
        gameContainers.push(<Tile key = {cbb_game.cbb_game_id} cbb_game = {cbb_game} team = {cbb_game.teams[team_id]} />);
      }
  
      if (showScheduleDifferentials || visibleScheduleDifferentials.indexOf(cbb_game.cbb_game_id) > -1) {
        gameContainers.push(<Differentials key = {'differentials-' + cbb_game.cbb_game_id}  cbb_game = {cbb_game} team_id = {team_id} />)
      }
    }
  } else if (scheduleView === 'table') {
    gameContainers.push(<TableView sorted_games = {sorted_games} team_id = {team_id} />)
  }

  return (
    <div style = {{'padding': paddingTop + 'px 5px 20px 5px'}}>
      {gameContainers}
    </div>
  );
}

export default Client;