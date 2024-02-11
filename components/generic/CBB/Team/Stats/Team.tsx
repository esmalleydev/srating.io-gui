'use client';
import React from 'react';

import { Tooltip, Typography } from '@mui/material';

import RankSpan from '@/components/generic/CBB/RankSpan';

interface Stats {
  adjusted_efficiency_rating: number;
  adjusted_efficiency_rating_rank: number;
  opponent_efficiency_rating: number;
  opponent_efficiency_rating_rank: number;
  offensive_rating: number;
  offensive_rating_rank: number;
  defensive_rating: number;
  defensive_rating_rank: number;
  points: number;
  points_rank: number;
  opponent_points: number;
  opponent_points_rank: number;
  win_margin: number;
  win_margin_rank: number;
  loss_margin: number;
  loss_margin_rank: number;
  confwin_margin: number;
  confwin_margin_rank: number;
  confloss_margin: number;
  confloss_margin_rank: number;
  field_goal: number;
  field_goal_rank: number;
  field_goal_attempts: number;
  field_goal_attempts_rank: number;
  field_goal_percentage: number;
  field_goal_percentage_rank: number;
  two_point_field_goal: number;
  two_point_field_goal_rank: number;
  two_point_field_goal_attempts: number;
  two_point_field_goal_attempts_rank: number;
  two_point_field_goal_percentage: number;
  two_point_field_goal_percentage_rank: number;
  three_point_field_goal: number;
  three_point_field_goal_rank: number;
  three_point_field_goal_attempts: number;
  three_point_field_goal_attempts_rank: number;
  three_point_field_goal_percentage: number;
  three_point_field_goal_percentage_rank: number;
  free_throws: number;
  free_throws_rank: number;
  free_throw_attempts: number;
  free_throw_attempts_rank: number;
  free_throw_percentage: number;
  free_throw_percentage_rank: number;
  offensive_rebounds: number;
  offensive_rebounds_rank: number;
  defensive_rebounds: number;
  defensive_rebounds_rank: number;
  assists: number;
  assists_rank: number;
  steals: number;
  steals_rank: number;
  blocks: number;
  blocks_rank: number;
  turnovers: number;
  turnovers_rank: number;
  fouls: number;
  fouls_rank: number;
  fatigue: number;
  fatigue_rank: number;
  desperation: number;
  desperation_rank: number;
  over_confidence: number;
  over_confidence_rank: number;
  wins: number;
  wins_rank: number;
  losses: number;
  losses_rank: number;
  confwins: number;
  confwins_rank: number;
  conflosses: number;
  conflosses_rank: number;
  neutralwins: number;
  neutralwins_rank: number;
  neutrallosses: number;
  neutrallosses_rank: number;
  homewins: number;
  homewins_rank: number;
  homelosses: number;
  homelosses_rank: number;
  roadwins: number;
  roadwins_rank: number;
  roadlosses: number;
  roadlosses_rank: number;
  opponent_field_goal: number;
  opponent_field_goal_rank: number;
  opponent_field_goal_attempts: number;
  opponent_field_goal_attempts_rank: number;
  opponent_field_goal_percentage: number;
  opponent_field_goal_percentage_rank: number;
  opponent_offensive_rebounds: number;
  opponent_offensive_rebounds_rank: number;
  opponent_defensive_rebounds: number;
  opponent_defensive_rebounds_rank: number;
  opponent_assists: number;
  opponent_assists_rank: number;
  opponent_steals: number;
  opponent_steals_rank: number;
  opponent_blocks: number;
  opponent_blocks_rank: number;
  opponent_turnovers: number;
  opponent_turnovers_rank: number;
  opponent_fouls: number;
  opponent_fouls_rank: number;
};


const Team = ({ teamStats }: { teamStats: Stats}) => {
  const efficiencyRows = [
    {
      'name': 'aEM',
      'title': 'Adjusted Efficiency margin',
      'value': teamStats.adjusted_efficiency_rating,
      'rank': teamStats.adjusted_efficiency_rating_rank,
    },
    {
      'name': 'SOS',
      'title': 'Strength of schedule',
      'value': teamStats.opponent_efficiency_rating,
      'rank': teamStats.opponent_efficiency_rating_rank,
    },
    {
      'name': 'ORT',
      'title': 'Offensive rating',
      'value': teamStats.offensive_rating,
      'rank': teamStats.offensive_rating_rank,
    },
    {
      'name': 'DRT',
      'title': 'Defensive rating',
      'value': teamStats.defensive_rating,
      'rank': teamStats.defensive_rating_rank,
    },
    {
      'name': 'PTS Off.',
      'title': 'Avg points scored',
      'value': teamStats.points,
      'rank': teamStats.points_rank,
    },
    {
      'name': 'PTS Def.',
      'title': 'Avg points allowed',
      'value': teamStats.opponent_points,
      'rank': teamStats.opponent_points_rank,
    },
  ];

  const marginRows = [
     {
      'name': 'Win MR',
      'title': 'Avg. Win margin',
      'value': teamStats.win_margin,
      'rank': teamStats.win_margin_rank,
    },
    {
      'name': 'Loss MR',
      'title': 'Avg. Loss margin',
      'value': teamStats.loss_margin,
      'rank': teamStats.loss_margin_rank,
    },
    {
      'name': 'Conf. W MR',
      'title': 'Avg. Conference win margin',
      'value': teamStats.confwin_margin,
      'rank': teamStats.confwin_margin_rank,
    },
    {
      'name': 'Conf. L MR',
      'title': 'Avg. Conference loss margin',
      'value': teamStats.confloss_margin,
      'rank': teamStats.confloss_margin_rank,
    },
  ];

  const offenseRows = [
    {
      'name': 'FG',
      'title': 'Field goals per game',
      'value': teamStats.field_goal,
      'rank': teamStats.field_goal_rank,
    },
    {
      'name': 'FGA',
      'title': 'Field goal attempts per game',
      'value': teamStats.field_goal_attempts,
      'rank': teamStats.field_goal_attempts_rank,
    },
    {
      'name': 'FG%',
      'title': 'Field goal percentage',
      'value': teamStats.field_goal_percentage || 0 + '%',
      'rank': teamStats.field_goal_percentage_rank,
    },
    {
      'name': '2P',
      'title': '2 point field goals per game',
      'value': teamStats.two_point_field_goal,
      'rank': teamStats.two_point_field_goal_rank,
    },
    {
      'name': '2PA',
      'title': '2 point field goal attempts per game',
      'value': teamStats.two_point_field_goal_attempts,
      'rank': teamStats.two_point_field_goal_attempts_rank,
    },
    {
      'name': '2P%',
      'title': '2 point field goal percentage',
      'value': teamStats.two_point_field_goal_percentage || 0 + '%',
      'rank': teamStats.two_point_field_goal_percentage_rank,
    },
    {
      'name': '3P',
      'title': '3 point field goals per game',
      'value': teamStats.three_point_field_goal,
      'rank': teamStats.three_point_field_goal_rank,
    },
    {
      'name': '3PA',
      'title': '3 point field goal attempts per game',
      'value': teamStats.three_point_field_goal_attempts,
      'rank': teamStats.three_point_field_goal_attempts_rank,
    },
    {
      'name': '3P%',
      'title': '3 point field goal percentage',
      'value': teamStats.three_point_field_goal_percentage || 0 + '%',
      'rank': teamStats.three_point_field_goal_percentage_rank,
    },
    {
      'name': 'FT',
      'title': 'Free throws per game',
      'value': teamStats.free_throws,
      'rank': teamStats.free_throws_rank,
    },
    {
      'name': 'FTA',
      'title': 'Free throw attempts per game',
      'value': teamStats.free_throw_attempts,
      'rank': teamStats.free_throw_attempts_rank,
    },
    {
      'name': 'FT%',
      'title': 'Free throw percentage',
      'value': teamStats.free_throw_percentage || 0 + '%',
      'rank': teamStats.free_throw_percentage_rank,
    },
  ];

  const specialRows = [
    {
      'name': 'ORB',
      'title': 'Offensive rebounds per game',
      'value': teamStats.offensive_rebounds,
      'rank': teamStats.offensive_rebounds_rank,
    },
    {
      'name': 'DRB',
      'title': 'Defensive rebounds per game',
      'value': teamStats.defensive_rebounds,
      'rank': teamStats.defensive_rebounds_rank,
    },
    {
      'name': 'AST',
      'title': 'Assists per game',
      'value': teamStats.assists,
      'rank': teamStats.assists_rank,
    },
    {
      'name': 'STL',
      'title': 'Steals per game',
      'value': teamStats.steals,
      'rank': teamStats.steals_rank,
    },
    {
      'name': 'BLK',
      'title': 'Blocks per game',
      'value': teamStats.blocks,
      'rank': teamStats.blocks_rank,
    },
    {
      'name': 'TOV',
      'title': 'Turnovers per game',
      'value': teamStats.turnovers,
      'rank': teamStats.turnovers_rank,
    },
    {
      'name': 'PF',
      'title': 'Turnovers per game',
      'value': teamStats.fouls,
      'rank': teamStats.fouls_rank,
    },
    {
      'name': 'FE',
      'title': 'Fatigue rating',
      'value': teamStats.fatigue,
      'rank': teamStats.fatigue_rank,
    },
    {
      'name': 'DES',
      'title': 'Desperation rating',
      'value': teamStats.desperation,
      'rank': teamStats.desperation_rank,
    },
    {
      'name': 'OVC',
      'title': 'Over confidence rating',
      'value': teamStats.over_confidence,
      'rank': teamStats.over_confidence_rank,
    },
  ];

  const recordRows = [
    {
     'name': 'Wins',
     'title': 'Total wins',
     'value': teamStats.wins,
     'rank': teamStats.wins_rank,
   },
   {
    'name': 'Losses',
    'title': 'Total losses',
    'value': teamStats.losses,
    'rank': teamStats.losses_rank,
  },
  {
    'name': 'Conf. wins',
    'title': 'Conference wins',
    'value': teamStats.confwins,
    'rank': teamStats.confwins_rank,
  },
  {
    'name': 'Conf. losses',
    'title': 'Conference losses',
    'value': teamStats.conflosses,
    'rank': teamStats.conflosses_rank,
  },
  {
    'name': 'Neut. wins',
    'title': 'Neutral wins',
    'value': teamStats.neutralwins,
    'rank': teamStats.neutralwins_rank,
  },
  {
    'name': 'Neut. losses',
    'title': 'Neutral losses',
    'value': teamStats.neutrallosses,
    'rank': teamStats.neutrallosses_rank,
  },
  {
    'name': 'Home wins',
    'title': 'Home wins',
    'value': teamStats.homewins,
    'rank': teamStats.homewins_rank,
  },
  {
    'name': 'Home losses',
    'title': 'Home losses',
    'value': teamStats.homelosses,
    'rank': teamStats.homelosses_rank,
  },
  {
    'name': 'Road wins',
    'title': 'Road wins',
    'value': teamStats.roadwins,
    'rank': teamStats.roadwins_rank,
  },
  {
    'name': 'Road losses',
    'title': 'Road losses',
    'value': teamStats.roadlosses,
    'rank': teamStats.roadlosses_rank,
  },
  
  ];

  const opponentRows = [
    {
      'name': 'FG',
      'title': 'Oppenent field goals per game',
      'value': teamStats.opponent_field_goal,
      'rank': teamStats.opponent_field_goal_rank,
    },
    {
      'name': 'FGA',
      'title': 'Oppenent field goal attempts per game',
      'value': teamStats.opponent_field_goal_attempts,
      'rank': teamStats.opponent_field_goal_attempts_rank,
    },
    {
      'name': 'FG%',
      'title': 'Oppenent field goal percentage',
      'value': teamStats.opponent_field_goal_percentage || 0 + '%',
      'rank': teamStats.opponent_field_goal_percentage_rank,
    },
    {
      'name': 'ORB',
      'title': 'Oppenent Offensive rebounds per game',
      'value': teamStats.opponent_offensive_rebounds,
      'rank': teamStats.opponent_offensive_rebounds_rank,
    },
    {
      'name': 'DRB',
      'title': 'Oppenent Defensive rebounds per game',
      'value': teamStats.opponent_defensive_rebounds,
      'rank': teamStats.opponent_defensive_rebounds_rank,
    },
    {
      'name': 'AST',
      'title': 'Oppenent Assists per game',
      'value': teamStats.opponent_assists,
      'rank': teamStats.opponent_assists_rank,
    },
    {
      'name': 'STL',
      'title': 'Oppenent Steals per game',
      'value': teamStats.opponent_steals,
      'rank': teamStats.opponent_steals_rank,
    },
    {
      'name': 'BLK',
      'title': 'Oppenent Blocks per game',
      'value': teamStats.opponent_blocks,
      'rank': teamStats.opponent_blocks_rank,
    },
    {
      'name': 'TOV',
      'title': 'Oppenent Turnovers per game',
      'value': teamStats.opponent_turnovers,
      'rank': teamStats.opponent_turnovers_rank,
    },
    {
      'name': 'PF',
      'title': 'Oppenent Turnovers per game',
      'value': teamStats.opponent_fouls,
      'rank': teamStats.opponent_fouls_rank,
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

export default Team;