'use client';
import React, { useState } from 'react';
import { Chip, Typography, Paper, Skeleton } from '@mui/material';

import HelperCBB from '@/components/helpers/CBB';

import PreviousMatchupTile from '@/components/generic/CBB/Game/PreviousMatchups/Tile';
import { Game, gamesDataType } from '@/types/cbb';



const Client = ({cbb_game, previousMatchups}: {cbb_game: Game, previousMatchups: gamesDataType}) => {

  const [showAllPreviousMatchups, setShowAllPreviousMatchups] = useState(false);

  const CBB = new HelperCBB({
    'cbb_game': cbb_game,
  });


  let previousMatchupContainers: React.JSX.Element[] = [];
  let summaryPRContainers: React.JSX.Element[] = [];

  if (previousMatchups && !Object.keys(previousMatchups).length) {
    previousMatchupContainers.push(<Paper elevation = {3} style = {{'padding': 10}}><Typography variant = 'body1'>Could not find any previous games :(</Typography></Paper>);
  } else if (previousMatchups) {
    const sorted_matchups: Game[] = Object.values(previousMatchups).sort(function(a, b) {
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
        if (game_.away_team_id === cbb_game.away_team_id) {
          away_wins++;
          away_points += game_.away_score - game_.home_score;
          if (lastThree) {
            lastThree_away_wins++;
            lastThree_away_points += game_.away_score - game_.home_score;
          }
        } else if (game_.away_team_id === cbb_game.home_team_id) {
          home_wins++;
          home_points += game_.away_score - game_.home_score;
          if (lastThree) {
            lastThree_home_wins++;
            lastThree_home_points += game_.away_score - game_.home_score;
          }
        }
      } else if (game_.away_score < game_.home_score) {
        if (game_.home_team_id === cbb_game.away_team_id) {
          away_wins++;
          away_points += game_.home_score - game_.away_score;
          if (lastThree) {
            lastThree_away_wins++;
            lastThree_away_points += game_.home_score - game_.away_score;
          }
        } else if (game_.home_team_id === cbb_game.home_team_id) {
          home_wins++;
          home_points += game_.home_score - game_.away_score;
          if (lastThree) {
            lastThree_home_wins++;
            lastThree_home_points += game_.home_score - game_.away_score;
          }
        }
      }
      if (i < 3 || showAllPreviousMatchups) {
        previousMatchupContainers.push(<PreviousMatchupTile cbb_game = {sorted_matchups[i]} />);
      }
    }

    if (sorted_matchups.length > 3 && !showAllPreviousMatchups) {
      previousMatchupContainers.push(<Chip
        key = 'showAllPreviousMatchups'
        sx = {{'margin': '5px 5px 10px 5px'}}
        variant = 'outlined'
        color = 'primary'
        onClick = {() => {setShowAllPreviousMatchups(true);}}
        label = '+ Match-ups'
      />);
    }

    if (sorted_matchups.length > 5) {
      if (lastThree_home_wins >= lastThree_away_wins) {
        summaryPRContainers.push(<Typography variant = 'body2'>{CBB.getTeamName('home')} has won {lastThree_home_wins} of last 3 by an average of {(lastThree_home_points / lastThree_home_wins).toFixed(2)} pts.</Typography>);
      } else {
        summaryPRContainers.push(<Typography variant = 'body2'>{CBB.getTeamName('away')} has won {lastThree_away_wins} of last 3 by an average of {(lastThree_away_points / lastThree_away_wins).toFixed(2)} pts.</Typography>);
      }
    }

    if (home_wins >= away_wins) {
      summaryPRContainers.push(<Typography variant = 'body2'>{CBB.getTeamName('home')} has won {home_wins} of last {sorted_matchups.length} by an average of {(home_points / home_wins).toFixed(2)} pts.</Typography>);
    } else {
      summaryPRContainers.push(<Typography variant = 'body2'>{CBB.getTeamName('away')} has won {away_wins} of last {sorted_matchups.length} by an average of {(away_points / away_wins).toFixed(2)} pts.</Typography>);
    }
  }


  return (
    <div style = {{'padding': '0px 10px'}}>
      <Typography variant = 'body1'>Previous match-ups</Typography>
      {/* {
        previousMatchups === null ?
        <Paper elevation = {3} style = {{'padding': 10}}>
          <div>
            <Typography variant = 'h5'><Skeleton /></Typography>
            <Typography variant = 'h5'><Skeleton /></Typography>
            <Typography variant = 'h5'><Skeleton /></Typography>
            <Typography variant = 'h5'><Skeleton /></Typography>
            <Typography variant = 'h5'><Skeleton /></Typography>
          </div>
        </Paper>
        : ''
      } */}
      {summaryPRContainers}
      {
        previousMatchups !== null ?
        <div style = {{'display': 'flex', 'flexWrap': 'wrap', 'alignItems': 'center'}}>
          {previousMatchupContainers}
        </div>
        : ''
      }
    </div>
  );
}

export default Client;
