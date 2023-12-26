import React, { useState, useEffect } from 'react';

import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import Tile from './Tile';
import AdditionalOptions from './AdditionalOptions';
import ConferencePicker from '../ConferencePicker';

import Api from '@/components/Api.jsx';
import { useAppSelector } from '@/redux/hooks';
const api = new Api();

// todo there is some bug, if I am on this page, not logged in, then login, with a subscription, after page reload, the skeleton lines never get replaced

const Picks = (props) => {

  const favoriteSlice = useAppSelector(state => state.favoriteReducer.value);

  const games = props.games;

  const [requested, setRequested] = useState(false);
  const [picksData, setPicksData] = useState(null);
  const [rankDisplay, setRankDisplay] = useState('composite_rank');
  const [sortOrder, setSortOrder] = useState('start_time');
  const [conferences, setConferences] = useState([]);

  useEffect(() => {
    setConferences(localStorage.getItem('CBB.CONFERENCEPICKER.DEFAULT') ? JSON.parse(localStorage.getItem('CBB.CONFERENCEPICKER.DEFAULT')) : []);
    setRankDisplay(localStorage.getItem('CBB.RANKPICKER.DEFAULT') ? JSON.parse(localStorage.getItem('CBB.RANKPICKER.DEFAULT')) : 'composite_rank');
    setSortOrder(localStorage.getItem('CBB.SORTPICKER.DEFAULT') ? JSON.parse(localStorage.getItem('CBB.SORTPICKER.DEFAULT')) : 'start_time');
  }, []);


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

    if (sortOrder === 'win_percentage') {
      const a_percentage = a.home_team_rating > a.away_team_rating ? a.home_team_rating : a.away_team_rating;
      const b_percentage = b.home_team_rating > b.away_team_rating ? b.home_team_rating : b.away_team_rating;

      if (a_percentage !== b_percentage) {
        return a_percentage > b_percentage ? -1 : 1;
      }
    }

    return a.start_datetime > b.start_datetime ? 1 : -1;
  });

  const gameContainers = [];

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
    gameContainers.push(<Tile key = {cbb_game.cbb_game_id} game = {cbb_game} picks = {picks} rankDisplay = {rankDisplay} onClickTile = {props.onClickTile} />);
  }

  const handleConferences = (conference) => {
    let currentConferences = [...conferences];


    if (conference && conference !== 'all') {
      const conf_index = currentConferences.indexOf(conference);

      if (conf_index > -1) {
        currentConferences.splice(conf_index, 1);
      } else {
        currentConferences.push(conference);
      }
    } else {
      currentConferences = [];
    }

    localStorage.setItem('CBB.CONFERENCEPICKER.DEFAULT', JSON.stringify(currentConferences));
    setConferences(currentConferences);
  }

  let confChips = [];
  for (let i = 0; i < conferences.length; i++) {
    confChips.push(<Chip key = {conferences[i]} sx = {{'margin': '5px'}} label={conferences[i]} onDelete={() => {handleConferences(conferences[i])}} />);
  }


  return (
    <div>
      <div style = {{'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center'}}>
        <ConferencePicker selected = {conferences} actionHandler = {handleConferences} />
        <AdditionalOptions rankDisplayHandler = {(value) => {setRankDisplay(value);}} rankDisplay = {rankDisplay} sortHandler = {(value) => {setSortOrder(value);}} sortOrder = {sortOrder} />
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