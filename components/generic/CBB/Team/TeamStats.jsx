import React, { useState, useRef, useEffect } from 'react';
// import { useTheme } from '@mui/material/styles';

import { Tooltip, Typography } from '@mui/material';

import Api from './../../../Api.jsx';
import RankSpan from '../RankSpan.jsx';

const api = new Api();

const TeamStats = (props) => {
  const self = this;
  
  const stats = props.stats || {};

  const efficiencyRows = [
    {
      'name': 'aEM',
      'title': 'Adjusted Efficiency margin',
      'value': stats.adjusted_efficiency_rating,
      'rank': stats.adjusted_efficiency_rating_rank,
    },
    {
      'name': 'SOS',
      'title': 'Strength of schedule',
      'value': stats.opponent_efficiency_rating,
      'rank': stats.opponent_efficiency_rating_rank,
    },
    {
      'name': 'ORT',
      'title': 'Offensive rating',
      'value': stats.offensive_rating,
      'rank': stats.offensive_rating_rank,
    },
    {
      'name': 'DRT',
      'title': 'Defensive rating',
      'value': stats.defensive_rating,
      'rank': stats.defensive_rating_rank,
    },
    {
      'name': 'PTS Off.',
      'title': 'Avg points scored',
      'value': stats.points,
      'rank': stats.points_rank,
    },
    {
      'name': 'PTS Def.',
      'title': 'Avg points allowed',
      'value': stats.opponent_points,
      'rank': stats.opponent_points_rank,
    },
  ];

  const marginRows = [
     {
      'name': 'Win MR',
      'title': 'Avg. Win margin',
      'value': stats.win_margin,
      'rank': stats.win_margin_rank,
    },
    {
      'name': 'Loss MR',
      'title': 'Avg. Loss margin',
      'value': stats.loss_margin,
      'rank': stats.loss_margin_rank,
    },
    {
      'name': 'Conf. W MR',
      'title': 'Avg. Conference win margin',
      'value': stats.confwin_margin,
      'rank': stats.confwin_margin_rank,
    },
    {
      'name': 'Conf. L MR',
      'title': 'Avg. Conference loss margin',
      'value': stats.confloss_margin,
      'rank': stats.confloss_margin_rank,
    },
  ];

  const offenseRows = [
    {
      'name': 'FG',
      'title': 'Field goals per game',
      'value': stats.field_goal,
      'rank': stats.field_goal_rank,
    },
    {
      'name': 'FGA',
      'title': 'Field goal attempts per game',
      'value': stats.field_goal_attempts,
      'rank': stats.field_goal_attempts_rank,
    },
    {
      'name': 'FG%',
      'title': 'Field goal percentage',
      'value': stats.field_goal_percentage || 0 + '%',
      'rank': stats.field_goal_percentage_rank,
    },
    {
      'name': '2P',
      'title': '2 point field goals per game',
      'value': stats.two_point_field_goal,
      'rank': stats.two_point_field_goal_rank,
    },
    {
      'name': '2PA',
      'title': '2 point field goal attempts per game',
      'value': stats.two_point_field_goal_attempts,
      'rank': stats.two_point_field_goal_attempts_rank,
    },
    {
      'name': '2P%',
      'title': '2 point field goal percentage',
      'value': stats.two_point_field_goal_percentage || 0 + '%',
      'rank': stats.two_point_field_goal_percentage_rank,
    },
    {
      'name': '3P',
      'title': '3 point field goals per game',
      'value': stats.three_point_field_goal,
      'rank': stats.three_point_field_goal_rank,
    },
    {
      'name': '3PA',
      'title': '3 point field goal attempts per game',
      'value': stats.three_point_field_goal_attempts,
      'rank': stats.three_point_field_goal_attempts_rank,
    },
    {
      'name': '3P%',
      'title': '3 point field goal percentage',
      'value': stats.three_point_field_goal_percentage || 0 + '%',
      'rank': stats.three_point_field_goal_percentage_rank,
    },
    {
      'name': 'FT',
      'title': 'Free throws per game',
      'value': stats.free_throws,
      'rank': stats.free_throws_rank,
    },
    {
      'name': 'FTA',
      'title': 'Free throw attempts per game',
      'value': stats.free_throw_attempts,
      'rank': stats.free_throw_attempts_rank,
    },
    {
      'name': 'FT%',
      'title': 'Free throw percentage',
      'value': stats.free_throw_percentage || 0 + '%',
      'rank': stats.free_throw_percentage_rank,
    },
  ];

  const specialRows = [
    {
      'name': 'ORB',
      'title': 'Offensive rebounds per game',
      'value': stats.offensive_rebounds,
      'rank': stats.offensive_rebounds_rank,
    },
    {
      'name': 'DRB',
      'title': 'Defensive rebounds per game',
      'value': stats.defensive_rebounds,
      'rank': stats.defensive_rebounds_rank,
    },
    {
      'name': 'AST',
      'title': 'Assists per game',
      'value': stats.assists,
      'rank': stats.assists_rank,
    },
    {
      'name': 'STL',
      'title': 'Steals per game',
      'value': stats.steals,
      'rank': stats.steals_rank,
    },
    {
      'name': 'BLK',
      'title': 'Blocks per game',
      'value': stats.blocks,
      'rank': stats.blocks_rank,
    },
    {
      'name': 'TOV',
      'title': 'Turnovers per game',
      'value': stats.turnovers,
      'rank': stats.turnovers_rank,
    },
    {
      'name': 'PF',
      'title': 'Turnovers per game',
      'value': stats.fouls,
      'rank': stats.fouls_rank,
    },
    {
      'name': 'FE',
      'title': 'Fatigue rating',
      'value': stats.fatigue,
      'rank': stats.fatigue_rank,
    },
    {
      'name': 'DES',
      'title': 'Desperation rating',
      'value': stats.desperation,
      'rank': stats.desperation_rank,
    },
    {
      'name': 'OVC',
      'title': 'Over confidence rating',
      'value': stats.over_confidence,
      'rank': stats.over_confidence_rank,
    },
  ];

  const recordRows = [
    {
     'name': 'Wins',
     'title': 'Total wins',
     'value': stats.wins,
     'rank': stats.wins_rank,
   },
   {
    'name': 'Losses',
    'title': 'Total losses',
    'value': stats.losses,
    'rank': stats.losses_rank,
  },
  {
    'name': 'Conf. wins',
    'title': 'Conference wins',
    'value': stats.confwins,
    'rank': stats.confwins_rank,
  },
  {
    'name': 'Conf. losses',
    'title': 'Conference losses',
    'value': stats.conflosses,
    'rank': stats.conflosses_rank,
  },
  {
    'name': 'Neut. wins',
    'title': 'Neutral wins',
    'value': stats.neutralwins,
    'rank': stats.neutralwins_rank,
  },
  {
    'name': 'Neut. losses',
    'title': 'Neutral losses',
    'value': stats.neutrallosses,
    'rank': stats.neutrallosses_rank,
  },
  {
    'name': 'Home wins',
    'title': 'Home wins',
    'value': stats.homewins,
    'rank': stats.homewins_rank,
  },
  {
    'name': 'Home losses',
    'title': 'Home losses',
    'value': stats.homelosses,
    'rank': stats.homelosses_rank,
  },
  {
    'name': 'Road wins',
    'title': 'Road wins',
    'value': stats.roadwins,
    'rank': stats.roadwins_rank,
  },
  {
    'name': 'Road losses',
    'title': 'Road losses',
    'value': stats.roadlosses,
    'rank': stats.roadlosses_rank,
  },
  
  ];

  const opponentRows = [
    {
      'name': 'FG',
      'title': 'Oppenent field goals per game',
      'value': stats.opponent_field_goal,
      'rank': stats.opponent_field_goal_rank,
    },
    {
      'name': 'FGA',
      'title': 'Oppenent field goal attempts per game',
      'value': stats.opponent_field_goal_attempts,
      'rank': stats.opponent_field_goal_attempts_rank,
    },
    {
      'name': 'FG%',
      'title': 'Oppenent field goal percentage',
      'value': stats.opponent_field_goal_percentage || 0 + '%',
      'rank': stats.opponent_field_goal_percentage_rank,
    },
    {
      'name': 'ORB',
      'title': 'Oppenent Offensive rebounds per game',
      'value': stats.opponent_offensive_rebounds,
      'rank': stats.opponent_offensive_rebounds_rank,
    },
    {
      'name': 'DRB',
      'title': 'Oppenent Defensive rebounds per game',
      'value': stats.opponent_defensive_rebounds,
      'rank': stats.opponent_defensive_rebounds_rank,
    },
    {
      'name': 'AST',
      'title': 'Oppenent Assists per game',
      'value': stats.opponent_assists,
      'rank': stats.opponent_assists_rank,
    },
    {
      'name': 'STL',
      'title': 'Oppenent Steals per game',
      'value': stats.opponent_steals,
      'rank': stats.opponent_steals_rank,
    },
    {
      'name': 'BLK',
      'title': 'Oppenent Blocks per game',
      'value': stats.opponent_blocks,
      'rank': stats.opponent_blocks_rank,
    },
    {
      'name': 'TOV',
      'title': 'Oppenent Turnovers per game',
      'value': stats.opponent_turnovers,
      'rank': stats.opponent_turnovers_rank,
    },
    {
      'name': 'PF',
      'title': 'Oppenent Turnovers per game',
      'value': stats.opponent_fouls,
      'rank': stats.opponent_fouls_rank,
    },
  ];

  const getStatBlock = (statistic) => {
    return (
      <div style = {{'textAlign': 'center', 'flex': '1', 'minWidth': 100, 'maxWidth': 100, 'margin': 10}}>
        <Tooltip key={statistic.name} disableFocusListener placement = 'top' title={statistic.title}><Typography color = {'text.secondary'} variant='body1'>{statistic.name}</Typography></Tooltip>
        {/* <hr style = {{'padding': 0, 'margin': 'auto', 'width': 50}} /> */}
        <div><Typography variant='caption'>{statistic.value || 0}</Typography>{statistic.rank ? <RankSpan rank = {statistic.rank} useOrdinal = {true} max = {362} /> : ''}</div>
      </div>
    );
  };


  return (
    <div>
      <Typography variant='h6'>Efficiency</Typography>
      <div style = {{'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'center'}}>
        {efficiencyRows.map((row) => {
          return getStatBlock(row);
        })}
      </div>
      <hr />
      <Typography variant='h6'>Offense</Typography>
      <div style = {{'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'center'}}>
        {offenseRows.map((row) => {
          return getStatBlock(row);
        })}
      </div>
      <hr />
      <Typography variant='h6'>Special</Typography>
      <div style = {{'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'center'}}>
        {specialRows.map((row) => {
          return getStatBlock(row);
        })}
      </div>
      <hr />
      <Typography variant='h6'>Margin</Typography>
      <div style = {{'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'center'}}>
        {marginRows.map((row) => {
          return getStatBlock(row);
        })}
      </div>
      <hr />
      <Typography variant='h6'>Record</Typography>
      <div style = {{'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'center'}}>
        {recordRows.map((row) => {
          return getStatBlock(row);
        })}
      </div>
      <hr />
      <Typography variant='h6'>Opponent</Typography>
      <div style = {{'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'center'}}>
        {opponentRows.map((row) => {
          return getStatBlock(row);
        })}
      </div>
    </div>
  );
}

export default TeamStats;