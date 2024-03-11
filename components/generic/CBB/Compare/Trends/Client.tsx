'use client';
import React from 'react';
import { Typography, Paper } from '@mui/material';

import HelperTeam from '@/components/helpers/Team';

import PreviousMatchupTile from '@/components/generic/CBB/Game/PreviousMatchups/Tile';
import { Game, Team, gamesDataType } from '@/components/generic/types';



const Client = ({cbb_games, teams, home_team_id, away_team_id}: {cbb_games: gamesDataType, teams: Team[], home_team_id: string, away_team_id: string}) => {

  let previousMatchupContainers: React.JSX.Element[] = [];
  let summaryPRContainers: React.JSX.Element[] = [];

  if (cbb_games && !Object.keys(cbb_games).length) {
    previousMatchupContainers.push(<Paper key = {1} elevation = {3} style = {{'padding': 10}}><Typography variant = 'body1'>Could not find any previous games :(</Typography></Paper>);
  } else if (cbb_games) {
    const sorted_matchups: Game[] = Object.values(cbb_games).sort(function(a, b) {
      return a.start_date > b.start_date ? -1 : 1;
    });

    let away_wins = 0;
    let home_wins = 0;

    let home_points = 0;
    let away_points = 0;

    let lastThree_away_wins = 0;
    let lastThree_home_wins = 0;

    let lastThree_home_points = 0;
    let lastThree_away_points = 0;

    for (let i = 0; i < sorted_matchups.length; i++) {
      const game_ = sorted_matchups[i];

      const lastThree = sorted_matchups.length > 3 && i < 3;

      if (game_.away_score > game_.home_score) {
        if (game_.away_team_id === away_team_id) {
          away_wins++;
          away_points += game_.away_score - game_.home_score;
          if (lastThree) {
            lastThree_away_wins++;
            lastThree_away_points += game_.away_score - game_.home_score;
          }
        } else if (game_.away_team_id === home_team_id) {
          home_wins++;
          home_points += game_.away_score - game_.home_score;
          if (lastThree) {
            lastThree_home_wins++;
            lastThree_home_points += game_.away_score - game_.home_score;
          }
        }
      } else if (game_.away_score < game_.home_score) {
        if (game_.home_team_id === away_team_id) {
          away_wins++;
          away_points += game_.home_score - game_.away_score;
          if (lastThree) {
            lastThree_away_wins++;
            lastThree_away_points += game_.home_score - game_.away_score;
          }
        } else if (game_.home_team_id === home_team_id) {
          home_wins++;
          home_points += game_.home_score - game_.away_score;
          if (lastThree) {
            lastThree_home_wins++;
            lastThree_home_points += game_.home_score - game_.away_score;
          }
        }
      }
      previousMatchupContainers.push(<PreviousMatchupTile cbb_game = {sorted_matchups[i]} />);
    }

    if (sorted_matchups.length > 5) {
      if (lastThree_home_wins >= lastThree_away_wins) {
        summaryPRContainers.push(<Typography variant = 'body2'>{new HelperTeam({'team': teams[home_team_id]}).getName()} has won {lastThree_home_wins} of last 3 by an average of {(lastThree_home_points / lastThree_home_wins).toFixed(2)} pts.</Typography>);
      } else {
        summaryPRContainers.push(<Typography variant = 'body2'>{new HelperTeam({'team': teams[away_team_id]}).getName()} has won {lastThree_away_wins} of last 3 by an average of {(lastThree_away_points / lastThree_away_wins).toFixed(2)} pts.</Typography>);
      }
    }

    if (home_wins >= away_wins) {
      summaryPRContainers.push(<Typography variant = 'body2'>{new HelperTeam({'team': teams[home_team_id]}).getName()} has won {home_wins} of last {sorted_matchups.length} by an average of {(home_points / home_wins).toFixed(2)} pts.</Typography>);
    } else {
      summaryPRContainers.push(<Typography variant = 'body2'>{new HelperTeam({'team': teams[away_team_id]}).getName()} has won {away_wins} of last {sorted_matchups.length} by an average of {(away_points / away_wins).toFixed(2)} pts.</Typography>);
    }
  }


  return (
    <div style = {{'padding': '0px 10px'}}>
      <Typography variant = 'body1'>Previous match-ups since 2011:</Typography>

      {summaryPRContainers}
      {
        cbb_games !== null ?
        <div style = {{'display': 'flex', 'flexWrap': 'wrap', 'alignItems': 'center'}}>
          {previousMatchupContainers}
        </div>
        : ''
      }
    </div>
  );
}

export default Client;
