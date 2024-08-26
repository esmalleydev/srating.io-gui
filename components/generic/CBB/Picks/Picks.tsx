'use client';

import React from 'react';

import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import Tile from '@/components/generic/CBB/Picks/Tile';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateConferences } from '@/redux/features/display-slice';
import AdditionalOptions from '@/components/generic/CBB/Picks/AdditionalOptions';
import ConferencePicker from '@/components/generic/CBB/ConferencePicker';
import { Games } from '@/types/cbb';


const Picks = ({ games }: {games: Games}) => {
  const dispatch = useAppDispatch();
  const conferences = useAppSelector((state) => state.dictionaryReducer.conference);
  const skip_sort_game_ids = useAppSelector((state) => state.favoriteReducer.skip_sort_game_ids);
  const game_ids = useAppSelector((state) => state.favoriteReducer.game_ids);
  const picksSort = useAppSelector((state) => state.displayReducer.picksSort);
  const selectedConferences = useAppSelector((state) => state.displayReducer.conferences);

  const sorted_games = Object.values(games);

  sorted_games.sort((a, b) => {
    const aIsPinned = (
      skip_sort_game_ids.indexOf(a.game_id) === -1 &&
      game_ids.length &&
      game_ids.indexOf(a.game_id) > -1
    );

    const bIsPinned = (
      skip_sort_game_ids.indexOf(b.game_id) === -1 &&
      game_ids.length &&
      game_ids.indexOf(b.game_id) > -1
    );

    if (aIsPinned && !bIsPinned) {
      return -1;
    }

    if (!aIsPinned && bIsPinned) {
      return 1;
    }

    if (
      picksSort === 'win_percentage' &&
      a.prediction &&
      b.prediction
    ) {
      const a_percentage = a.prediction.home_percentage > a.prediction.away_percentage ? a.prediction.home_percentage : a.prediction.away_percentage;
      const b_percentage = b.prediction.home_percentage > b.prediction.away_percentage ? b.prediction.home_percentage : b.prediction.away_percentage;

      if (a_percentage !== b_percentage) {
        return a_percentage > b_percentage ? -1 : 1;
      }
    }

    return a.start_datetime > b.start_datetime ? 1 : -1;
  });

  const gameContainers: React.JSX.Element[] = [];

  for (let i = 0; i < sorted_games.length; i++) {
    const game = sorted_games[i];

    if (
      selectedConferences.length &&
      selectedConferences.indexOf(game.teams[game.away_team_id].conference_id) === -1 &&
      selectedConferences.indexOf(game.teams[game.home_team_id].conference_id) === -1
    ) {
      continue;
    }

    gameContainers.push(<Tile key = {game.game_id} game = {game} />);
  }

  const confChips: React.JSX.Element[] = [];
  for (let i = 0; i < selectedConferences.length; i++) {
    confChips.push(<Chip key = {selectedConferences[i]} sx = {{ margin: '5px' }} label={conferences[selectedConferences[i]].code} onDelete={() => { dispatch(updateConferences(selectedConferences[i])); }} />);
  }

  return (
    <>
      <div style = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ConferencePicker />
        <AdditionalOptions />
      </div>
      <div style = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {confChips}
      </div>
      <div style = {{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {
          gameContainers.length ? gameContainers : <Typography variant = 'h5'>No games found :( please adjust filter. </Typography>
        }
      </div>
    </>
  );
};

export default Picks;
