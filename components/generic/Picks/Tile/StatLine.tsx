'use client';

import React from 'react';

import { useAppSelector } from '@/redux/hooks';
import CompareStatistic from '@/components/generic/CompareStatistic';
import { getSkeleton, maxWidth } from '../Tile';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';


const StatLine = ({ game }) => {
  const gameStatsLoading = useAppSelector((state) => state.picksReducer.gameStatsLoading);
  const gameStats = useAppSelector((state) => state.picksReducer.gameStats);
  const homeStats = (gameStats[game.game_id] && gameStats[game.game_id].historical[game.home_team_id]) || null;
  const awayStats = (gameStats[game.game_id] && gameStats[game.game_id].historical[game.away_team_id]) || null;

  let numberOfTeams = 1;
  let compareRows: {
    name: string;
    title: string;
    tooltip?: string;
    away: string | number;
    home: string | number;
    awayCompareValue: string | number;
    homeCompareValue: string | number;
    awayRank: string | number;
    homeRank: string | number;
    favored: string;
    showDifference: boolean;
    compareType: string;
  }[] = [];

  if (game.organization_id === Organization.getCBBID()) {
    numberOfTeams = CBB.getNumberOfD1Teams(game.season);
    compareRows = [
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
        compareType: 'rank',
      },
    ];
  }

  if (game.organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id: game.division_id, season: game.season });
    compareRows = [
      // todo need to load elo
      // {
      //   name: 'SR Elo',
      //   title: 'SR Elo',
      //   away: awayStats && awayStats.elo,
      //   home: homeStats && homeStats.elo,
      //   awayCompareValue: awayStats && awayStats.elo,
      //   homeCompareValue: homeStats && homeStats.elo,
      //   awayRank: awayStats && awayStats.elo_rank,
      //   homeRank: homeStats && homeStats.elo_rank,
      //   favored: 'higher',
      //   showDifference: true,
      //   compareType: 'rank',
      // },
      {
        name: 'QBR',
        title: 'Quarterback rating',
        away: awayStats && awayStats.passing_rating_college,
        home: homeStats && homeStats.passing_rating_college,
        awayCompareValue: awayStats && awayStats.passing_rating_college,
        homeCompareValue: homeStats && homeStats.passing_rating_college,
        awayRank: awayStats && awayStats.passing_rating_college_rank,
        homeRank: homeStats && homeStats.passing_rating_college_rank,
        favored: 'higher',
        showDifference: true,
        compareType: 'rank',
      },
      {
        name: 'PTS',
        title: 'Points',
        away: awayStats && awayStats.points,
        home: homeStats && homeStats.points,
        awayCompareValue: awayStats && awayStats.points,
        homeCompareValue: homeStats && homeStats.points,
        awayRank: awayStats && awayStats.points_rank,
        homeRank: homeStats && homeStats.points_rank,
        favored: 'higher',
        showDifference: true,
        compareType: 'rank',
      },
      {
        name: 'Yards per play',
        title: 'Yard per play',
        away: awayStats && awayStats.yards_per_play,
        home: homeStats && homeStats.yards_per_play,
        awayCompareValue: awayStats && awayStats.yards_per_play,
        homeCompareValue: homeStats && homeStats.yards_per_play,
        awayRank: awayStats && awayStats.yards_per_play_rank,
        homeRank: homeStats && homeStats.yards_per_play_rank,
        favored: 'higher',
        showDifference: true,
        compareType: 'rank',
      },
    ];
  }



  return (
    <>
      {
        gameStatsLoading ?
          getSkeleton(compareRows.length) :
          <CompareStatistic key = {game.game_id} maxWidth = {maxWidth} paper = {false} rows = {compareRows} season = {game.season} max = {numberOfTeams} />
      }
    </>
  );
};

export default StatLine;
