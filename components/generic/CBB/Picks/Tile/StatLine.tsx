'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import CompareStatistic from '@/components/generic/CompareStatistic';
import { getSkeleton, maxWidth } from '../Tile';


const StatLine = ({ game }) => {
  const gameStatsLoading = useAppSelector((state) => state.picksReducer.gameStatsLoading);
  const gameStats = useAppSelector((state) => state.picksReducer.gameStats);

  const homeStats = (gameStats[game.game_id] && gameStats[game.game_id].historical[game.home_team_id]) || null;
  const awayStats = (gameStats[game.game_id] && gameStats[game.game_id].historical[game.away_team_id]) || null;


  const compareRows = [
    {
      name: 'aEM',
      title: 'Adjusted Efficiency margin',
      away: awayStats && awayStats.adjusted_efficiency_rating,
      home: homeStats && homeStats.adjusted_efficiency_rating,
      awayCompareValue: awayStats && awayStats.adjusted_efficiency_rating,
      homeCompareValue: homeStats && homeStats.adjusted_efficiency_rating,
      awayRank: awayStats && awayStats.adjusted_efficiency_rating_rank,
      homeRank: homeStats && homeStats.adjusted_efficiency_rating_rank,
      favored: 'higher',
      showDifference: true,
      compareType: 'rank',
    },
    {
      name: 'aSOS',
      title: 'aEM SoS',
      tooltip: 'aEM Strength of schedule (Opponent Efficiency margin (oORT - oDRT))',
      away: awayStats && awayStats.opponent_efficiency_rating,
      home: homeStats && homeStats.opponent_efficiency_rating,
      awayCompareValue: awayStats && awayStats.opponent_efficiency_rating,
      homeCompareValue: homeStats && homeStats.opponent_efficiency_rating,
      awayRank: awayStats && awayStats.opponent_efficiency_rating_rank,
      homeRank: homeStats && homeStats.opponent_efficiency_rating_rank,
      favored: 'higher',
      showDifference: true,
      compareType: 'rank',
    },
    {
      name: 'eSOS',
      title: 'Elo SoS',
      tooltip: 'sRating elo Strength of schedule (Average opponent elo)',
      away: awayStats && awayStats.elo_sos,
      home: homeStats && homeStats.elo_sos,
      awayCompareValue: awayStats && awayStats.elo_sos,
      homeCompareValue: homeStats && homeStats.elo_sos,
      awayRank: awayStats && awayStats.elo_sos_rank,
      homeRank: homeStats && homeStats.elo_sos_rank,
      favored: 'higher',
      showDifference: true,
      compareType: 'rank',
    },
    {
      name: 'ORT',
      title: 'Offensive rating',
      away: awayStats && awayStats.offensive_rating,
      home: homeStats && homeStats.offensive_rating,
      awayCompareValue: awayStats && awayStats.offensive_rating,
      homeCompareValue: homeStats && homeStats.offensive_rating,
      awayRank: awayStats && awayStats.offensive_rating_rank,
      homeRank: homeStats && homeStats.offensive_rating_rank,
      favored: 'higher',
      showDifference: true,
    },
    // {
    //   'name': 'DRT',
    //   'title': 'Defensive rating',
    //   'away': awayStats && awayStats.defensive_rating,
    //   'home': homeStats && homeStats.defensive_rating,
    //   'awayCompareValue': awayStats && awayStats.defensive_rating,
    //   'homeCompareValue': homeStats && homeStats.defensive_rating,
    //   'awayRank': awayStats && awayStats.defensive_rating_rank,
    //   'homeRank': homeStats && homeStats.defensive_rating_rank,
    //   'favored': 'lower',
    //   'showDifference': true,
    // },
    // {
    //   'name': 'PTS Off.',
    //   'title': 'Avg points scored',
    //   'away': awayStats && awayStats.points,
    //   'home': homeStats && homeStats.points,
    //   'awayCompareValue': awayStats && awayStats.points,
    //   'homeCompareValue': homeStats && homeStats.points,
    //   'awayRank': awayStats && awayStats.points_rank,
    //   'homeRank': homeStats && homeStats.points_rank,
    //   'favored': 'higher',
    //   'showDifference': true,
    // },
    // {
    //   'name': 'PTS Def.',
    //   'title': 'Avg points allowed',
    //   'away': awayStats && awayStats.opponent_points,
    //   'home': homeStats && homeStats.opponent_points,
    //   'awayCompareValue': awayStats && awayStats.opponent_points,
    //   'homeCompareValue': homeStats && homeStats.opponent_points,
    //   'awayRank': awayStats && awayStats.opponent_points_rank,
    //   'homeRank': homeStats && homeStats.opponent_points_rank,
    //   'favored': 'lower',
    //   'showDifference': true,
    // },
  ];



  return (
    <>
      {
        gameStatsLoading ?
          getSkeleton(compareRows.length) :
          <CompareStatistic key = {game.game_id} maxWidth = {maxWidth} paper = {false} rows = {compareRows} />
      }
    </>
  );
};

export default StatLine;
