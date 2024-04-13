'use client';
import React from 'react';

import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import Tile from '@/components/generic/CBB/Picks/Tile';
import AdditionalOptions from '@/components/generic/CBB/Picks/AdditionalOptions';
import ConferencePicker from '@/components/generic/CBB/ConferencePicker';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { gamesDataType } from '@/types/cbb';
import { updateConferences } from '@/redux/features/display-slice';


const Picks = ({ cbb_games }: {cbb_games: gamesDataType | object}) => {
  const dispatch = useAppDispatch();
  const skip_sort_cbb_game_ids = useAppSelector(state => state.favoriteReducer.skip_sort_cbb_game_ids);
  const cbb_game_ids = useAppSelector(state => state.favoriteReducer.cbb_game_ids);
  const picksSort = useAppSelector(state => state.displayReducer.picksSort);
  const conferences = useAppSelector(state => state.displayReducer.conferences);
  
  const picksData = useAppSelector(state => state.picksReducer.picks);

  for (let cbb_game_id in picksData) {
    if (cbb_game_id in cbb_games) {
      cbb_games[cbb_game_id].home_team_rating = picksData[cbb_game_id].home_team_rating;
      cbb_games[cbb_game_id].away_team_rating = picksData[cbb_game_id].away_team_rating;
    }
  }


  let sorted_games = Object.values(cbb_games);

  sorted_games.sort(function(a, b) {
    const aIsPinned = (
      skip_sort_cbb_game_ids.indexOf(a.cbb_game_id) === -1 &&
      cbb_game_ids.length &&
      cbb_game_ids.indexOf(a.cbb_game_id) > -1
    );

    const bIsPinned = (
      skip_sort_cbb_game_ids.indexOf(b.cbb_game_id) === -1 &&
      cbb_game_ids.length &&
      cbb_game_ids.indexOf(b.cbb_game_id) > -1
    );

    if (aIsPinned && !bIsPinned) {
      return -1;
    }
      
    if (!aIsPinned && bIsPinned) {
      return 1;
    }

    if (picksSort === 'win_percentage') {
      const a_percentage = a.home_team_rating > a.away_team_rating ? a.home_team_rating : a.away_team_rating;
      const b_percentage = b.home_team_rating > b.away_team_rating ? b.home_team_rating : b.away_team_rating;

      if (a_percentage !== b_percentage) {
        return a_percentage > b_percentage ? -1 : 1;
      }
    }

    return a.start_datetime > b.start_datetime ? 1 : -1;
  });

  const gameContainers: React.JSX.Element[] = [];

  for (let i = 0; i < sorted_games.length; i++) {
    const cbb_game = sorted_games[i];

    if (
      conferences.length &&
      conferences.indexOf(cbb_game.teams[cbb_game.away_team_id].conference) === -1 &&
      conferences.indexOf(cbb_game.teams[cbb_game.home_team_id].conference) === -1
    ) {
      continue;
    }

    let picks = null;

    if (picksData && cbb_game.cbb_game_id in picksData) {
      picks = picksData[cbb_game.cbb_game_id];
    }
    gameContainers.push(<Tile key = {cbb_game.cbb_game_id} cbb_game = {cbb_game} picks = {picks} />);
  }


  let confChips: React.JSX.Element[] = [];
  for (let i = 0; i < conferences.length; i++) {
    confChips.push(<Chip key = {conferences[i]} sx = {{'margin': '5px'}} label={conferences[i]} onDelete={() => {dispatch(updateConferences(conferences[i]))}} />);
  }


  return (
    <>
      <div style = {{'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center'}}>
        <ConferencePicker />
        <AdditionalOptions />
      </div>
      <div style = {{'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center'}}>
        {confChips}
      </div>
      <div style = {{'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center'}}>
        {
          gameContainers.length ? gameContainers : <Typography variant = 'h5'>No games found :( please adjust filter. </Typography>
        }
      </div>
    </>
  );
}

export default Picks;