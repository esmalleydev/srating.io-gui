'use client';
import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';


import HelperTeam from '../../../helpers/Team';
import Tile from './Tile';
import { Link, Typography } from '@mui/material';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/loading-slice';
import Dates from '@/components/utils/Dates';


const Teams = (props) => {
  const self = this;

  const favorite = props.favorite;
  const schedule = props.schedule;
  const teams = props.teams;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [rankDisplay, setRankDisplay] = useState('composite_rank');

  const team_id_x_last_game = {};
  const team_id_x_next_2_games = {};

  const now = Dates.format(Dates.parse(), 'Y-m-d');

  const handleTeamClick = (team_id) => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push('/cbb/team/' + team_id);
    });
  };

  if (schedule) {
    for (let game_id in schedule) {
      const game = schedule[game_id];

      // game in the past
      if (
        game.status === 'final' &&
        Dates.format(game.start_datetime, 'Y-m-d') <= now
      ) {
        // handle the away team, add last game if it more recent
        if (
          !(game.away_team_id in team_id_x_last_game) ||
          (
            game.away_team_id in team_id_x_last_game &&
            team_id_x_last_game[game.away_team_id].start_date < game.start_date
          )
        ) {
          team_id_x_last_game[game.away_team_id] = game;
        }

        // handle the home team now
        if (
          !(game.home_team_id in team_id_x_last_game) ||
          (
            game.home_team_id in team_id_x_last_game &&
            team_id_x_last_game[game.home_team_id].start_date < game.start_date
          )
        ) {
          team_id_x_last_game[game.home_team_id] = game;
        }
      }

      // handle the 2 future games now
      if (
        // game.status !== 'final' && // todo uncomment
        Dates.format(game.start_datetime, 'Y-m-d') >= now
      ) {

        // handle the away team, initialize array if needed
        if (!(game.away_team_id in team_id_x_next_2_games)) {
          team_id_x_next_2_games[game.away_team_id] = {};
        }

        // add all the future games, will sort and pop off later
        team_id_x_next_2_games[game.away_team_id][game.start_timestamp] = game;

        // handle the home team, initialize array if needed
        if (!(game.home_team_id in team_id_x_next_2_games)) {
          team_id_x_next_2_games[game.home_team_id] = {};
        }

        // add all the future games, will sort and pop off later
        team_id_x_next_2_games[game.home_team_id][game.start_timestamp] = game;
      }
    }
  }


  // sort and pop off the extra future schedule games, only want the next 2
  for (let team_id in team_id_x_next_2_games) {
    let timestamps = Object.keys(team_id_x_next_2_games[team_id]).sort();

    const temporary = team_id_x_next_2_games[team_id];

    // reset this variable
    team_id_x_next_2_games[team_id] = [];

    for (let i = 0; i < timestamps.length; i++) {
      const game = temporary[timestamps[i]];

      // fill in with the 2 future games
      team_id_x_next_2_games[team_id].push(game);

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
      if (team.team_id in team_id_x_last_game) {
        const game = team_id_x_last_game[team.team_id];
        // game.rankings = ranking;
        team_with_ranking = game.teams[team.team_id];
        tileContainers.push(<Tile data = {game} rankDisplay = {rankDisplay} />);
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
      if (team.team_id in team_id_x_next_2_games) {
        const games = team_id_x_next_2_games[team.team_id];

        for (let i = 0; i < games.length; i++) {
          tileContainers.push(<Tile data = {games[i]} rankDisplay = {rankDisplay} />);
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
      {scheduleContainers}
    </div>
  );
}

export default Teams;