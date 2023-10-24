import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { Link, Typography } from '@mui/material';

import GameLog from './GameLog';
import BackdropLoader from '../../BackdropLoader';


const Players = (props) => {
  const self = this;

  const favorite = props.favorite;
  const players = props.players;
  const gamelogs = props.gamelogs;
  const player_team_seasons = props.player_team_seasons;

  const router = useRouter();

  const [spin, setSpin] = useState(false);

  const handlePlayerClick = (player_id) => {
    setSpin(true);
    router.push('/cbb/player/' + player_id).then(() => {
      setSpin(false);
    });
  };

  let player_id_x_cbb_player_boxscores = {};
  let player_id_x_player_team_season_id = {};

  for (let cbb_player_boxscore_id in gamelogs) {
    const cbb_player_boxscore = gamelogs[cbb_player_boxscore_id];

    if (!(cbb_player_boxscore.player_id in player_id_x_cbb_player_boxscores)) {
      player_id_x_cbb_player_boxscores[cbb_player_boxscore.player_id] = {};
    }

    player_id_x_cbb_player_boxscores[cbb_player_boxscore.player_id][cbb_player_boxscore.cbb_game.start_timestamp] = cbb_player_boxscore;
  }

  for (let player_team_season_id in player_team_seasons) {
    const player_team_season = player_team_seasons[player_team_season_id]
    player_id_x_player_team_season_id[player_team_season.player_id] = player_team_season;
  }


  const gamelogContainers = [];
  if (favorite && favorite.json_player_ids && favorite.json_player_ids.length) {
    gamelogContainers.push(
      <div>
        <Typography variant='h5'>My Players</Typography>
        <hr />
      </div>
    );

    let atleastOneBoxscore = false;

    for (let i = 0; i < favorite.json_player_ids.length; i++) {
      const player = players && players[favorite.json_player_ids[i]];

      if (!player || !(player.player_id in player_id_x_cbb_player_boxscores)) {
        continue;
      }

      let timestamps = Object.keys(player_id_x_cbb_player_boxscores[player.player_id]).sort().reverse();

      const temporary = player_id_x_cbb_player_boxscores[player.player_id];

      // reset this variable
      player_id_x_cbb_player_boxscores[player.player_id] = {};

      for (let i = 0; i < timestamps.length; i++) {
        const cbb_player_boxscore = temporary[timestamps[i]];
  
        // fill in with the 3 past games
        player_id_x_cbb_player_boxscores[player.player_id][cbb_player_boxscore.cbb_player_boxscore_id] = cbb_player_boxscore;
  
        // only want the first 3 games
        if (i === 2) {
          break;
        }
      }

      if (!Object.keys(player_id_x_cbb_player_boxscores[player.player_id]).length) {
        continue;
      }

      atleastOneBoxscore = true;

      gamelogContainers.push(
        <div>
          <Typography variant='h6'><Link style = {{'cursor': 'pointer'}} underline='hover' onClick={() => handlePlayerClick(player.player_id)}>{player.first_name + ' ' + player.last_name}</Link></Typography>
        </div>
      );

      const tableContainers = [];

      
      tableContainers.push(
        <GameLog gamelogs = {player_id_x_cbb_player_boxscores[player.player_id]} player_team_season = {player_id_x_player_team_season_id[player.player_id]} />
      );
      
      // get last 3 gamelogs

      if (tableContainers.length) {
        gamelogContainers.push(
          <div>
            {tableContainers}
          </div>
        );
      }
    }

    if (!atleastOneBoxscore) {
      gamelogContainers.push(
        <div>
          <Typography variant='h6' style = {{'textAlign': 'center'}}>No recent boxscores :(</Typography>
        </div>
      );
    }
  }

  return (
    <div>
      <BackdropLoader open = {(spin === true)} />
      {gamelogContainers}
    </div>
  );
}

export default Players;