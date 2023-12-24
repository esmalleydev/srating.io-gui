'use client';
import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import moment from 'moment';

import HelperTeam from '../../../helpers/Team';
import Tile from './Tile';
import { Link, Typography } from '@mui/material';
import BackdropLoader from '../../BackdropLoader';


const Teams = (props) => {
  const self = this;

  const favorite = props.favorite;
  const schedule = props.schedule;
  const teams = props.teams;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [rankDisplay, setRankDisplay] = useState('composite_rank');
  const [spin, setSpin] = useState(false);

  const team_id_x_last_cbb_game = {};
  const team_id_x_next_2_cbb_games = {};

  const now = moment().format('YYYY-MM-DD');

  const handleTeamClick = (team_id) => {
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/team/' + team_id);
      setSpin(false);
    });
  };

  if (schedule) {
    for (let cbb_game_id in schedule) {
      const cbb_game = schedule[cbb_game_id];

      // game in the past
      if (
        cbb_game.status === 'final' &&
        moment(cbb_game.start_datetime).format('YYYY-MM-DD') <= now
      ) {
        // handle the away team, add last game if it more recent
        if (
          !(cbb_game.away_team_id in team_id_x_last_cbb_game) ||
          (
            cbb_game.away_team_id in team_id_x_last_cbb_game &&
            team_id_x_last_cbb_game[cbb_game.away_team_id].start_date < cbb_game.start_date
          )
        ) {
          team_id_x_last_cbb_game[cbb_game.away_team_id] = cbb_game;
        }

        // handle the home team now
        if (
          !(cbb_game.home_team_id in team_id_x_last_cbb_game) ||
          (
            cbb_game.home_team_id in team_id_x_last_cbb_game &&
            team_id_x_last_cbb_game[cbb_game.home_team_id].start_date < cbb_game.start_date
          )
        ) {
          team_id_x_last_cbb_game[cbb_game.home_team_id] = cbb_game;
        }
      }

      // handle the 2 future games now
      if (
        // cbb_game.status !== 'final' && // todo uncomment
        moment(cbb_game.start_datetime).format('YYYY-MM-DD') >= now
      ) {

        // handle the away team, initialize array if needed
        if (!(cbb_game.away_team_id in team_id_x_next_2_cbb_games)) {
          team_id_x_next_2_cbb_games[cbb_game.away_team_id] = {};
        }

        // add all the future games, will sort and pop off later
        team_id_x_next_2_cbb_games[cbb_game.away_team_id][cbb_game.start_timestamp] = cbb_game;

        // handle the home team, initialize array if needed
        if (!(cbb_game.home_team_id in team_id_x_next_2_cbb_games)) {
          team_id_x_next_2_cbb_games[cbb_game.home_team_id] = {};
        }

        // add all the future games, will sort and pop off later
        team_id_x_next_2_cbb_games[cbb_game.home_team_id][cbb_game.start_timestamp] = cbb_game;
      }
    }
  }


  // sort and pop off the extra future schedule games, only want the next 2
  for (let team_id in team_id_x_next_2_cbb_games) {
    let timestamps = Object.keys(team_id_x_next_2_cbb_games[team_id]).sort();

    const temporary = team_id_x_next_2_cbb_games[team_id];

    // reset this variable
    team_id_x_next_2_cbb_games[team_id] = [];

    for (let i = 0; i < timestamps.length; i++) {
      const cbb_game = temporary[timestamps[i]];

      // fill in with the 2 future games
      team_id_x_next_2_cbb_games[team_id].push(cbb_game);

      // only want the first 2 games
      if (i === 1) {
        break;
      }
    }
  }

  const scheduleContainers = [];
  if (favorite && favorite.json_team_ids && favorite.json_team_ids.length) {
    scheduleContainers.push(
      <div>
        <Typography variant='h5'>My Teams</Typography>
        <hr />
      </div>
    );

    for (let i = 0; i < favorite.json_team_ids.length; i++) {
      const team = teams && teams[favorite.json_team_ids[i]];

      if (!team) {
        continue;
      }

      const tileContainers = [];

      let team_with_ranking = null;
      
      // decorate previous games + steal the last ranking for team title
      if (team.team_id in team_id_x_last_cbb_game) {
        const cbb_game = team_id_x_last_cbb_game[team.team_id];
        // cbb_game.rankings = ranking;
        team_with_ranking = cbb_game.teams[team.team_id];
        tileContainers.push(<Tile data = {cbb_game} rankDisplay = {rankDisplay} />);
      }

      const teamHelper = new HelperTeam({'team': team_with_ranking || team});

      scheduleContainers.push(
        <div>
          <Typography variant='h6'>
            {teamHelper.getRank(rankDisplay) ? <sup style = {{'marginRight': '5px'}}>{teamHelper.getRank(rankDisplay)}</sup> : ''}
            <Link style = {{'cursor': 'pointer'}} underline='hover' onClick={() => handleTeamClick(team.team_id)}>{teamHelper.getName()}</Link>
          </Typography>
        </div>
      );

      // decorate future games
      if (team.team_id in team_id_x_next_2_cbb_games) {
        const cbb_games = team_id_x_next_2_cbb_games[team.team_id];

        for (let i = 0; i < cbb_games.length; i++) {
          tileContainers.push(<Tile data = {cbb_games[i]} rankDisplay = {rankDisplay} />);
        }
      }

      if (tileContainers.length) {
        scheduleContainers.push(
          <div style = {{'display': 'flex', 'justifyContent': 'center', 'flexWrap': 'wrap'}}>
            {tileContainers}
          </div>
        );
      }

    }
  } else {
    scheduleContainers.push(
      <div>
        <Typography variant='h5'>My Teams</Typography>
        <hr />
        <Typography variant='h6' style = {{'textAlign': 'center'}}>You have no favorites :(</Typography>
      </div>
    );
  }


  return (
    <div>
      <BackdropLoader open = {(spin === true)} />
      {scheduleContainers}
    </div>
  );
}

export default Teams;