'use client';

import React from 'react';
import Typography from '@mui/material/Typography';
import CompareStatistic from '@/components/generic/CompareStatistic';
import { useAppSelector } from '@/redux/hooks';
import { Skeleton } from '@mui/material';
import PredictionLine from './PredictionLine';


/**
* Get the loading skeletons for the picks stats
*/
export const getSkeleton = (numberOfSkeletons: number): React.JSX.Element[] => {
  const skeletons: React.JSX.Element[] = [];

  for (let i = 0; i < numberOfSkeletons; i++) {
    skeletons.push(<Skeleton key = {i} variant="text" animation="wave" sx = {{
      width: '100%', maxWidth, height: '30px', margin: '10px 0px',
    }} />);
  }

  return skeletons;
};

export const maxWidth = 600;

const Client = ({ game, elo }) => {
  const gameStats = useAppSelector((state) => state.gameReducer.gameStats);
  const gameStatsLoading = useAppSelector((state) => state.gameReducer.gameStatsLoading);

  const homeStats = (gameStats[game.game_id] && gameStats[game.game_id].historical[game.home_team_id]) || {};
  const awayStats = (gameStats[game.game_id] && gameStats[game.game_id].historical[game.away_team_id]) || {};

  const awayElo = (game.away_team_id in elo) ? elo[game.away_team_id] : null;
  const homeElo = (game.home_team_id in elo) ? elo[game.home_team_id] : null;


  const overviewRows = [
    {
      name: 'Record',
      title: 'Record',
      away: `${awayStats.wins}-${awayStats.losses}`,
      home: `${homeStats.wins}-${homeStats.losses}`,
      awayCompareValue: awayStats.wins,
      homeCompareValue: homeStats.wins,
      favored: 'higher',
      showDifference: true,
      precision: 0,
    },
    {
      name: 'Conf',
      title: 'Conference record',
      away: `${awayStats.confwins || 0}-${awayStats.conflosses || 0}`,
      home: `${homeStats.confwins || 0}-${homeStats.conflosses || 0}`,
      awayCompareValue: awayStats.confwins,
      homeCompareValue: homeStats.confwins,
      favored: 'higher',
      showDifference: true,
      precision: 0,
    },
    {
      name: 'Streak',
      title: 'Streak',
      away: (awayStats.streak < 0 ? 'L' : 'W') + Math.abs(awayStats.streak),
      home: (homeStats.streak < 0 ? 'L' : 'W') + Math.abs(homeStats.streak),
      awayCompareValue: awayStats.streak,
      homeCompareValue: homeStats.streak,
      favored: 'higher',
    },
    {
      name: 'A/H Rec.',
      title: 'Away record / Home record',
      away: `${awayStats.roadwins || 0}-${awayStats.roadlosses || 0}`,
      home: `${homeStats.homewins || 0}-${homeStats.homelosses || 0}`,
      awayCompareValue: awayStats.roadlosses,
      homeCompareValue: homeStats.homelosses,
      favored: 'lower',
      showDifference: true,
      precision: 0,
    },
  ];

  const efficiencyRows = [
    {
      name: 'aEM',
      title: 'Adjusted Efficiency margin',
      away: awayStats.adjusted_efficiency_rating,
      home: homeStats.adjusted_efficiency_rating,
      awayCompareValue: awayStats.adjusted_efficiency_rating,
      homeCompareValue: homeStats.adjusted_efficiency_rating,
      awayRank: awayStats.adjusted_efficiency_rating_rank,
      homeRank: homeStats.adjusted_efficiency_rating_rank,
      favored: 'higher',
      showDifference: true,
      compareType: 'rank',
    },
    {
      name: 'aSOS',
      title: 'aSOS',
      tooltip: 'Adj efficiency Strength of Schedule',
      away: awayStats.opponent_efficiency_rating,
      home: homeStats.opponent_efficiency_rating,
      awayCompareValue: awayStats.opponent_efficiency_rating,
      homeCompareValue: homeStats.opponent_efficiency_rating,
      awayRank: awayStats.opponent_efficiency_rating_rank,
      homeRank: homeStats.opponent_efficiency_rating_rank,
      favored: 'higher',
      showDifference: true,
      compareType: 'rank',
    },
    {
      name: 'eSOS',
      title: 'eSOS',
      tooltip: 'SR (elo) Strength of Schedule',
      away: awayStats.elo_sos,
      home: homeStats.elo_sos,
      awayCompareValue: awayStats.elo_sos,
      homeCompareValue: homeStats.elo_sos,
      awayRank: awayStats.elo_sos_rank,
      homeRank: homeStats.elo_sos_rank,
      favored: 'higher',
      showDifference: true,
      compareType: 'rank',
    },
    {
      name: 'ORT',
      title: 'Offensive rating',
      away: awayStats.offensive_rating,
      home: homeStats.offensive_rating,
      awayCompareValue: awayStats.offensive_rating,
      homeCompareValue: homeStats.offensive_rating,
      awayRank: awayStats.offensive_rating_rank,
      homeRank: homeStats.offensive_rating_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: 'DRT',
      title: 'Defensive rating',
      away: awayStats.defensive_rating,
      home: homeStats.defensive_rating,
      awayCompareValue: awayStats.defensive_rating,
      homeCompareValue: homeStats.defensive_rating,
      awayRank: awayStats.defensive_rating_rank,
      homeRank: homeStats.defensive_rating_rank,
      favored: 'lower',
      showDifference: true,
    },
    {
      name: 'PTS Off.',
      title: 'Avg points scored',
      away: awayStats.points,
      home: homeStats.points,
      awayCompareValue: awayStats.points,
      homeCompareValue: homeStats.points,
      awayRank: awayStats.points_rank,
      homeRank: homeStats.points_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: 'PTS Def.',
      title: 'Avg points allowed',
      away: awayStats.opponent_points,
      home: homeStats.opponent_points,
      awayCompareValue: awayStats.opponent_points,
      homeCompareValue: homeStats.opponent_points,
      awayRank: awayStats.opponent_points_rank,
      homeRank: homeStats.opponent_points_rank,
      favored: 'lower',
      showDifference: true,
    },
  ];

  const marginRows = [
    {
      name: 'Win MR',
      title: 'Avg. Win margin',
      away: awayStats.win_margin,
      home: homeStats.win_margin,
      awayCompareValue: awayStats.win_margin,
      homeCompareValue: homeStats.win_margin,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: 'Loss MR',
      title: 'Avg. Loss margin',
      away: awayStats.loss_margin,
      home: homeStats.loss_margin,
      awayCompareValue: awayStats.loss_margin,
      homeCompareValue: homeStats.loss_margin,
      favored: 'lower',
      showDifference: true,
    },
    {
      name: 'Conf. W MR',
      title: 'Avg. Conference win margin',
      away: awayStats.confwin_margin,
      home: homeStats.confwin_margin,
      awayCompareValue: awayStats.confwin_margin,
      homeCompareValue: homeStats.confwin_margin,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: 'Conf. L MR',
      title: 'Avg. Conference loss margin',
      away: awayStats.confloss_margin,
      home: homeStats.confloss_margin,
      awayCompareValue: awayStats.confloss_margin,
      homeCompareValue: homeStats.confloss_margin,
      favored: 'lower',
      showDifference: true,
    },
  ];

  const rankRows = [
    {
      name: 'Rank',
      title: 'Composite Rank',
      away: awayStats.rank || '-',
      home: homeStats.rank || '-',
      awayCompareValue: awayStats.rank || Infinity,
      homeCompareValue: homeStats.rank || Infinity,
      favored: 'lower',
      showDifference: true,
      precision: 0,
    },
    {
      name: 'sRating elo',
      title: 'sRating elo',
      away: awayElo,
      home: homeElo,
      awayCompareValue: awayElo,
      homeCompareValue: homeElo,
      awayRank: awayStats.elo_rank,
      homeRank: homeStats.elo_rank,
      favored: 'higher',
      showDifference: true,
      precision: 0,
    },
    {
      name: 'NET',
      title: 'NET',
      away: awayStats.net_rank || '-',
      home: homeStats.net_rank || '-',
      awayCompareValue: awayStats.net_rank || Infinity,
      homeCompareValue: homeStats.net_rank || Infinity,
      favored: 'lower',
      showDifference: true,
      precision: 0,
    },
    {
      name: 'KP',
      title: 'Kenpom',
      away: awayStats.kenpom_rank || '-',
      home: homeStats.kenpom_rank || '-',
      awayCompareValue: awayStats.kenpom_rank || Infinity,
      homeCompareValue: homeStats.kenpom_rank || Infinity,
      favored: 'lower',
      showDifference: true,
      precision: 0,
    },
    {
      name: 'SRS',
      title: 'SRS',
      away: awayStats.srs_rank || '-',
      home: homeStats.srs_rank || '-',
      awayCompareValue: awayStats.srs_rank || Infinity,
      homeCompareValue: homeStats.srs_rank || Infinity,
      favored: 'lower',
      showDifference: true,
      precision: 0,
    },
    {
      name: 'AP',
      title: 'AP',
      away: awayStats.ap_rank || '-',
      home: homeStats.ap_rank || '-',
      awayCompareValue: awayStats.ap_rank || Infinity,
      homeCompareValue: homeStats.ap_rank || Infinity,
      favored: 'lower',
      showDifference: true,
      precision: 0,
    },
    {
      name: 'Coaches',
      title: 'Coaches Poll',
      away: awayStats.coaches_rank || '-',
      home: homeStats.coaches_rank || '-',
      awayCompareValue: awayStats.coaches_rank || Infinity,
      homeCompareValue: homeStats.coaches_rank || Infinity,
      favored: 'lower',
      showDifference: true,
      precision: 0,
    },
  ];

  const offenseRows = [
    {
      name: 'Pace',
      title: 'Pace',
      tooltip: 'Possesions per game',
      away: awayStats.possessions,
      home: homeStats.possessions,
      awayCompareValue: awayStats.possessions,
      homeCompareValue: homeStats.possessions,
      awayRank: awayStats.possessions_rank,
      homeRank: homeStats.possessions_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: 'FG',
      title: 'FG',
      tooltip: 'Field goals per game',
      away: awayStats.field_goal,
      home: homeStats.field_goal,
      awayCompareValue: awayStats.field_goal,
      homeCompareValue: homeStats.field_goal,
      awayRank: awayStats.field_goal_rank,
      homeRank: homeStats.field_goal_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: 'FGA',
      title: 'FGA',
      tooltip: 'Field goal attempts per game',
      away: awayStats.field_goal_attempts,
      home: homeStats.field_goal_attempts,
      awayCompareValue: awayStats.field_goal_attempts,
      homeCompareValue: homeStats.field_goal_attempts,
      awayRank: awayStats.field_goal_attempts_rank,
      homeRank: homeStats.field_goal_attempts_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: 'FG%',
      title: 'FG%',
      tooltip: 'Field goal percentage',
      away: `${awayStats.field_goal_percentage || 0}%`,
      home: `${homeStats.field_goal_percentage || 0}%`,
      awayCompareValue: awayStats.field_goal_percentage,
      homeCompareValue: homeStats.field_goal_percentage,
      awayRank: awayStats.field_goal_percentage_rank,
      homeRank: homeStats.field_goal_percentage_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: '2P',
      title: '2P',
      tooltip: '2 point field goals per game',
      away: awayStats.two_point_field_goal,
      home: homeStats.two_point_field_goal,
      awayCompareValue: awayStats.two_point_field_goal,
      homeCompareValue: homeStats.two_point_field_goal,
      awayRank: awayStats.two_point_field_goal_rank,
      homeRank: homeStats.two_point_field_goal_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: '2PA',
      title: '2PA',
      tooltip: '2 point field goal attempts per game',
      away: awayStats.two_point_field_goal_attempts,
      home: homeStats.two_point_field_goal_attempts,
      awayCompareValue: awayStats.two_point_field_goal_attempts,
      homeCompareValue: homeStats.two_point_field_goal_attempts,
      awayRank: awayStats.two_point_field_goal_attempts_rank,
      homeRank: homeStats.two_point_field_goal_attempts_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: '2P%',
      title: '2P%',
      tooltip: '2 point field goal percentage',
      away: `${awayStats.two_point_field_goal_percentage || 0}%`,
      home: `${homeStats.two_point_field_goal_percentage || 0}%`,
      awayCompareValue: awayStats.two_point_field_goal_percentage,
      homeCompareValue: homeStats.two_point_field_goal_percentage,
      awayRank: awayStats.two_point_field_goal_percentage_rank,
      homeRank: homeStats.two_point_field_goal_percentage_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: '3P',
      title: '3P',
      tooltip: '3 point field goals per game',
      away: awayStats.three_point_field_goal,
      home: homeStats.three_point_field_goal,
      awayCompareValue: awayStats.three_point_field_goal,
      homeCompareValue: homeStats.three_point_field_goal,
      awayRank: awayStats.three_point_field_goal_rank,
      homeRank: homeStats.three_point_field_goal_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: '3PA',
      title: '3PA',
      tooltip: '3 point field goal attempts per game',
      away: awayStats.three_point_field_goal_attempts,
      home: homeStats.three_point_field_goal_attempts,
      awayCompareValue: awayStats.three_point_field_goal_attempts,
      homeCompareValue: homeStats.three_point_field_goal_attempts,
      awayRank: awayStats.three_point_field_goal_attempts_rank,
      homeRank: homeStats.three_point_field_goal_attempts_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: '3P%',
      title: '3P%',
      tooltip: '3 point field goal percentage',
      away: `${awayStats.three_point_field_goal_percentage || 0}%`,
      home: `${homeStats.three_point_field_goal_percentage || 0}%`,
      awayCompareValue: awayStats.three_point_field_goal_percentage,
      homeCompareValue: homeStats.three_point_field_goal_percentage,
      awayRank: awayStats.three_point_field_goal_percentage_rank,
      homeRank: homeStats.three_point_field_goal_percentage_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: 'FT',
      title: 'FT',
      tooltip: 'Free throws per game',
      away: awayStats.free_throws,
      home: homeStats.free_throws,
      awayCompareValue: awayStats.free_throws,
      homeCompareValue: homeStats.free_throws,
      awayRank: awayStats.free_throws_rank,
      homeRank: homeStats.free_throws_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: 'FTA',
      title: 'FTA',
      tooltip: 'Free throw attempts per game',
      away: awayStats.free_throw_attempts,
      home: homeStats.free_throw_attempts,
      awayCompareValue: awayStats.free_throw_attempts,
      homeCompareValue: homeStats.free_throw_attempts,
      awayRank: awayStats.free_throw_attempts_rank,
      homeRank: homeStats.free_throw_attempts_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: 'FT%',
      title: 'FT%',
      tooltip: 'Free throw percentage',
      away: `${awayStats.free_throw_percentage || 0}%`,
      home: `${homeStats.free_throw_percentage || 0}%`,
      awayCompareValue: awayStats.free_throw_percentage,
      homeCompareValue: homeStats.free_throw_percentage,
      awayRank: awayStats.free_throw_percentage_rank,
      homeRank: homeStats.free_throw_percentage_rank,
      favored: 'higher',
      showDifference: true,
    },
  ];

  const specialRows = [
    {
      name: 'ORB',
      title: 'ORB',
      tooltip: 'Offensive rebounds',
      away: awayStats.offensive_rebounds,
      home: homeStats.offensive_rebounds,
      awayCompareValue: awayStats.offensive_rebounds,
      homeCompareValue: homeStats.offensive_rebounds,
      awayRank: awayStats.offensive_rebounds_rank,
      homeRank: homeStats.offensive_rebounds_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: 'DRB',
      title: 'DRB',
      tooltip: 'Defensive rebounds',
      away: awayStats.defensive_rebounds,
      home: homeStats.defensive_rebounds,
      awayCompareValue: awayStats.defensive_rebounds,
      homeCompareValue: homeStats.defensive_rebounds,
      awayRank: awayStats.defensive_rebounds_rank,
      homeRank: homeStats.defensive_rebounds_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: 'AST',
      title: 'AST',
      tooltip: 'Assists',
      away: awayStats.assists,
      home: homeStats.assists,
      awayCompareValue: awayStats.assists,
      homeCompareValue: homeStats.assists,
      awayRank: awayStats.assists_rank,
      homeRank: homeStats.assists_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: 'STL',
      title: 'STL',
      tooltip: 'Steals',
      away: awayStats.steals,
      home: homeStats.steals,
      awayCompareValue: awayStats.steals,
      homeCompareValue: homeStats.steals,
      awayRank: awayStats.steals_rank,
      homeRank: homeStats.steals_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: 'BLK',
      title: 'BLK',
      tooltip: 'Blocks',
      away: awayStats.blocks,
      home: homeStats.blocks,
      awayCompareValue: awayStats.blocks,
      homeCompareValue: homeStats.blocks,
      awayRank: awayStats.blocks_rank,
      homeRank: homeStats.blocks_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: 'TOV',
      title: 'TOV',
      tooltip: 'Turnovers',
      away: awayStats.turnovers,
      home: homeStats.turnovers,
      awayCompareValue: awayStats.turnovers,
      homeCompareValue: homeStats.turnovers,
      awayRank: awayStats.turnovers_rank,
      homeRank: homeStats.turnovers_rank,
      favored: 'lower',
      showDifference: true,
    },
    {
      name: 'PF',
      title: 'PF',
      tooltip: 'Fouls',
      away: awayStats.fouls,
      home: homeStats.fouls,
      awayCompareValue: awayStats.fouls,
      homeCompareValue: homeStats.fouls,
      awayRank: awayStats.fouls_rank,
      homeRank: homeStats.fouls_rank,
      favored: 'lower',
      showDifference: true,
    },
    {
      name: 'FE',
      title: 'Fatigue rating',
      away: awayStats.fatigue,
      home: homeStats.fatigue,
      awayCompareValue: awayStats.fatigue,
      homeCompareValue: homeStats.fatigue,
      favored: 'lower',
      showDifference: true,
    },
    {
      name: 'DES',
      title: 'Desperation rating',
      away: awayStats.desperation,
      home: homeStats.desperation,
      awayCompareValue: awayStats.desperation,
      homeCompareValue: homeStats.desperation,
      favored: 'lower',
      showDifference: true,
    },
    {
      name: 'OVC',
      title: 'Over confidence rating',
      away: awayStats.over_confidence,
      home: homeStats.over_confidence,
      awayCompareValue: awayStats.over_confidence,
      homeCompareValue: homeStats.over_confidence,
      favored: 'lower',
      showDifference: true,
    },
  ];

  const opponentRows = [
    {
      name: 'FG',
      title: 'FG',
      tooltip: 'Oppenent field goals per game',
      away: awayStats.opponent_field_goal,
      home: homeStats.opponent_field_goal,
      awayCompareValue: awayStats.opponent_field_goal,
      homeCompareValue: homeStats.opponent_field_goal,
      awayRank: awayStats.opponent_field_goal_rank,
      homeRank: homeStats.opponent_field_goal_rank,
      favored: 'lower',
      showDifference: true,
    },
    {
      name: 'FGA',
      title: 'FGA',
      tooltip: 'Oppenent field goal attempts per game',
      away: awayStats.opponent_field_goal_attempts,
      home: homeStats.opponent_field_goal_attempts,
      awayCompareValue: awayStats.opponent_field_goal_attempts,
      homeCompareValue: homeStats.opponent_field_goal_attempts,
      awayRank: awayStats.opponent_field_goal_attempts_rank,
      homeRank: homeStats.opponent_field_goal_attempts_rank,
      favored: 'lower',
      showDifference: true,
    },
    {
      name: 'FG%',
      title: 'FG%',
      tooltip: 'Oppenent field goal percentage',
      away: `${awayStats.opponent_field_goal_percentage || 0}%`,
      home: `${homeStats.opponent_field_goal_percentage || 0}%`,
      awayCompareValue: awayStats.opponent_field_goal_percentage,
      homeCompareValue: homeStats.opponent_field_goal_percentage,
      awayRank: awayStats.opponent_field_goal_percentage_rank,
      homeRank: homeStats.opponent_field_goal_percentage_rank,
      favored: 'lower',
      showDifference: true,
    },
    {
      name: 'ORB',
      title: 'ORB',
      tooltip: 'Oppenent Offensive rebounds per game',
      away: awayStats.opponent_offensive_rebounds,
      home: homeStats.opponent_offensive_rebounds,
      awayCompareValue: awayStats.opponent_offensive_rebounds,
      homeCompareValue: homeStats.opponent_offensive_rebounds,
      awayRank: awayStats.opponent_offensive_rebounds_rank,
      homeRank: homeStats.opponent_offensive_rebounds_rank,
      favored: 'lower',
      showDifference: true,
    },
    {
      name: 'DRB',
      title: 'DRB',
      tooltip: 'Oppenent Defensive rebounds per game',
      away: awayStats.opponent_defensive_rebounds,
      home: homeStats.opponent_defensive_rebounds,
      awayCompareValue: awayStats.opponent_defensive_rebounds,
      homeCompareValue: homeStats.opponent_defensive_rebounds,
      awayRank: awayStats.opponent_defensive_rebounds_rank,
      homeRank: homeStats.opponent_defensive_rebounds_rank,
      favored: 'lower',
      showDifference: true,
    },
    {
      name: 'AST',
      title: 'AST',
      tooltip: 'Oppenent Assists per game',
      away: awayStats.opponent_assists,
      home: homeStats.opponent_assists,
      awayCompareValue: awayStats.opponent_assists,
      homeCompareValue: homeStats.opponent_assists,
      awayRank: awayStats.opponent_assists_rank,
      homeRank: homeStats.opponent_assists_rank,
      favored: 'lower',
      showDifference: true,
    },
    {
      name: 'STL',
      title: 'STL',
      tooltip: 'Oppenent Steals per game',
      away: awayStats.opponent_steals,
      home: homeStats.opponent_steals,
      awayCompareValue: awayStats.opponent_steals,
      homeCompareValue: homeStats.opponent_steals,
      awayRank: awayStats.opponent_steals_rank,
      homeRank: homeStats.opponent_steals_rank,
      favored: 'lower',
      showDifference: true,
    },
    {
      name: 'BLK',
      title: 'BLK',
      tooltip: 'Oppenent Blocks per game',
      away: awayStats.opponent_blocks,
      home: homeStats.opponent_blocks,
      awayCompareValue: awayStats.opponent_blocks,
      homeCompareValue: homeStats.opponent_blocks,
      awayRank: awayStats.opponent_blocks_rank,
      homeRank: homeStats.opponent_blocks_rank,
      favored: 'lower',
      showDifference: true,
    },
    {
      name: 'TOV',
      title: 'TOV',
      tooltip: 'Oppenent Turnovers per game',
      away: awayStats.opponent_turnovers,
      home: homeStats.opponent_turnovers,
      awayCompareValue: awayStats.opponent_turnovers,
      homeCompareValue: homeStats.opponent_turnovers,
      awayRank: awayStats.opponent_turnovers_rank,
      homeRank: homeStats.opponent_turnovers_rank,
      favored: 'higher',
      showDifference: true,
    },
    {
      name: 'PF',
      title: 'PF',
      tooltip: 'Oppenent Turnovers per game',
      away: awayStats.opponent_fouls,
      home: homeStats.opponent_fouls,
      awayCompareValue: awayStats.opponent_fouls,
      homeCompareValue: homeStats.opponent_fouls,
      awayRank: awayStats.opponent_fouls_rank,
      homeRank: homeStats.opponent_fouls_rank,
      favored: 'higher',
      showDifference: true,
    },
  ];


  return (
    <div style = {{ padding: '0px 5px 20px 5px', marginTop: 58 }}>
      <PredictionLine game={game} />

      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'body1'>Record</Typography>
      {
        gameStatsLoading ?
          getSkeleton(overviewRows.length) :
          <CompareStatistic season = {game.season} paper = {true} rows = {overviewRows} />
      }

      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'body1'>Efficiency</Typography>
      {
        gameStatsLoading ?
          getSkeleton(efficiencyRows.length) :
          <CompareStatistic season = {game.season} paper = {true} rows = {efficiencyRows} />
      }

      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'body1'>Rank</Typography>
      {
        gameStatsLoading ?
          getSkeleton(rankRows.length) :
          <CompareStatistic season = {game.season} paper = {true} rows = {rankRows} />
      }

      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'body1'>Win / Loss Margin</Typography>
      {
        gameStatsLoading ?
          getSkeleton(marginRows.length) :
          <CompareStatistic season = {game.season} paper = {true} rows = {marginRows} />
      }

      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'body1'>Offense</Typography>
      {
        gameStatsLoading ?
          getSkeleton(offenseRows.length) :
          <CompareStatistic season = {game.season} paper = {true} rows = {offenseRows} />
      }

      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'body1'>Special</Typography>
      {
        gameStatsLoading ?
          getSkeleton(specialRows.length) :
          <CompareStatistic season = {game.season} paper = {true} rows = {specialRows} />
      }

      <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'body1'>Opponent stats against</Typography>
      {
        gameStatsLoading ?
          getSkeleton(opponentRows.length) :
          <CompareStatistic season = {game.season} paper = {true} rows = {opponentRows} />
      }
    </div>
  );
};

export default Client;
