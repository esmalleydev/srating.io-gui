import React, { useState } from 'react';

import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import Tile from '@/components/generic/CBB/Picks/Tile';
import AdditionalOptions from '@/components/generic/CBB/Picks/AdditionalOptions';
import ConferencePicker from '@/components/generic/CBB/ConferencePicker';

import Api from '@/components/Api.jsx';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { gamesDataType } from '@/components/generic/types';
import { updateConferences } from '@/redux/features/display-slice';
const api = new Api();

// todo there is some bug, if I am on this page, not logged in, then login, with a subscription, after page reload, the skeleton lines never get replaced

const Picks = (props) => {
  const dispatch = useAppDispatch();
  const favoriteSlice = useAppSelector(state => state.favoriteReducer.value);
  const displaySlice = useAppSelector(state => state.displayReducer.value);

  const games: gamesDataType = props.games;

  const [requested, setRequested] = useState(false);
  const [picksData, setPicksData] = useState<Object | null>(null);

  if (!requested) {
    setRequested(true);
    api.Request({
      'class': 'cbb_game_odds',
      'function': 'getPicksData',
      'arguments': {
        'cbb_game_id': Object.keys(games),
      },
    }).then((response) => {
      setPicksData(response || {});
    }).catch((e) => {
      setPicksData({});
    });
  }

  let sorted_games = Object.values(games);

  sorted_games.sort(function(a, b) {
    if (
      favoriteSlice.skip_sort_cbb_game_ids.indexOf(a.cbb_game_id) === -1 &&
      favoriteSlice.cbb_game_ids.length &&
      favoriteSlice.cbb_game_ids.indexOf(a.cbb_game_id) > -1
    ) {
      return -1;
    }
      
    if (
      favoriteSlice.skip_sort_cbb_game_ids.indexOf(b.cbb_game_id) === -1 &&
      favoriteSlice.cbb_game_ids.length &&
      favoriteSlice.cbb_game_ids.indexOf(b.cbb_game_id) > -1
    ) {
      return 1;
    }

    if (displaySlice.picksSort === 'win_percentage') {
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
      displaySlice.conferences.length &&
      displaySlice.conferences.indexOf(cbb_game.teams[cbb_game.away_team_id].conference) === -1 &&
      displaySlice.conferences.indexOf(cbb_game.teams[cbb_game.home_team_id].conference) === -1
    ) {
      continue;
    }

    let picks = null;

    if (picksData && cbb_game.cbb_game_id in picksData) {
      picks = picksData[cbb_game.cbb_game_id];
    }
    gameContainers.push(<Tile key = {cbb_game.cbb_game_id} game = {cbb_game} picks = {picks} onClickTile = {props.onClickTile} />);
  }


  let confChips: React.JSX.Element[] = [];
  for (let i = 0; i < displaySlice.conferences.length; i++) {
    confChips.push(<Chip key = {displaySlice.conferences[i]} sx = {{'margin': '5px'}} label={displaySlice.conferences[i]} onDelete={() => {dispatch(updateConferences(displaySlice.conferences[i]))}} />);
  }


  return (
    <div>
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
    </div>
  );
}

export default Picks;