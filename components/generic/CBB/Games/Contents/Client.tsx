'use client';
import React, { Suspense, useEffect, useState } from 'react';
import moment from 'moment';
import { Chip, Paper, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Game } from '@/types/cbb';
import { getHeaderHeight } from '@/components/generic/CBB/Games/SubNavBar';
import { updateConferences } from '@/redux/features/display-slice';
import Tile from '@/components/generic/CBB/Games/Tile';
import { useScrollContext } from '@/contexts/scrollContext';

const Client = ({ cbb_games, date }) => {

  const now =  moment().format('YYYY-MM-DD');

  const dispatch = useAppDispatch();
  const skip_sort_cbb_game_ids = useAppSelector(state => state.favoriteReducer.skip_sort_cbb_game_ids);
  const favorite_cbb_game_ids = useAppSelector(state => state.favoriteReducer.cbb_game_ids);
  const selectedConferences = useAppSelector(state => state.displayReducer.conferences);
  const conferences = useAppSelector(state => state.dictionaryReducer.conference);
  const statuses = useAppSelector(state => state.displayReducer.statuses);
  const scores = useAppSelector(state => state.gamesReducer.scores);
  const datesChecked = useAppSelector(state => state.gamesReducer.dates_checked);
  const scrollTop = useAppSelector(state => state.gamesReducer.scrollTop);

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

  for (let cbb_game_id in scores) {
    if (cbb_game_id in cbb_games) {
      Object.assign(cbb_games[cbb_game_id], scores[cbb_game_id]);
    }
  }
  
  const gameContainers: React.JSX.Element[] = [];

  let sorted_games: Game[] = Object.values(cbb_games);

  sorted_games.sort(function(a, b) {
    const aIsPinned = (
      skip_sort_cbb_game_ids.indexOf(a.cbb_game_id) === -1 &&
      favorite_cbb_game_ids.length &&
      favorite_cbb_game_ids.indexOf(a.cbb_game_id) > -1
    );

    const bIsPinned = (
      skip_sort_cbb_game_ids.indexOf(b.cbb_game_id) === -1 &&
      favorite_cbb_game_ids.length &&
      favorite_cbb_game_ids.indexOf(b.cbb_game_id) > -1
    );

    if (aIsPinned && !bIsPinned) {
      return -1;
    }
      
    if (!aIsPinned && bIsPinned) {
      return 1;
    }

    if (
      a.status === 'live' &&
      b.status !== 'live'
    ) {
      return -1;
    }

    if (
      a.status !== 'live' &&
      b.status === 'live'
    ) {
      return 1;
    }

    if (
      a.status === 'final' &&
      b.status === 'pre'
    ) {
      return 1;
    }

    if (
      a.status === 'pre' &&
      b.status === 'final'
    ) {
      return -1;
    }
    return a.start_datetime > b.start_datetime ? 1 : -1;
  });


  for (var i = 0; i < sorted_games.length; i++) {
    let game_ = sorted_games[i];

    // remove games where a team is TBA
    
    if (
      !game_.teams ||
      !game_.teams[game_.away_team_id] ||
      !game_.teams[game_.home_team_id]
    ) {
      continue;
    }

    if (
      selectedConferences.length &&
      selectedConferences.indexOf(game_.teams[game_.away_team_id].conference_id) === -1 &&
      selectedConferences.indexOf(game_.teams[game_.home_team_id].conference_id) === -1
    ) {
      continue;
    }

    if (statuses.indexOf(game_.status) === -1) {
      continue;
    }

    // remove games that are today but still TBA
    let game_timestamp;
    if (
      game_.status === 'pre' &&
      game_.start_date.split('T')[0] === now &&
      (game_timestamp = new Date(game_.start_timestamp * 1000)) &&
      game_timestamp.getHours() >= 0 && game_timestamp.getHours() <= 6
    ) {
      continue;
    }
    gameContainers.push(<Tile key={i} cbb_game={game_} isLoadingWinPercentage = {!datesChecked[date]} />);
  }


  const gameContainerStyle: React.CSSProperties = {
    'display': 'flex',
    'flexWrap': 'wrap',
    'justifyContent': 'center',
    'paddingBottom': 60,
  };


  let confChips: React.JSX.Element[] = [];
  for (let i = 0; i < selectedConferences.length; i++) {
    confChips.push(<Chip key = {selectedConferences[i]} sx = {{'margin': '5px'}} label={conferences[selectedConferences[i]].code} onDelete={() => {dispatch(updateConferences(selectedConferences[i]))}} />);
  }

  return (
    <div style = {{'padding': '46px 2.5px 0px 2.5px', 'marginTop': getHeaderHeight()}}>
      <div style = {{'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'marginTop': '10px', 'flexWrap': 'wrap'}}>
        {confChips}
      </div>
      <div style = {gameContainerStyle}>
        {
          gameContainers.length ?
            gameContainers :
            <Typography variant = 'h5'>No games found :( please adjust filter. </Typography>
        }
      </div>
    </div>
  );
};

export default Client;