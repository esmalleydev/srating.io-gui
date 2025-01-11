'use client';

import React from 'react';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import moment from 'moment';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import CompareStatistic from '@/components/generic/CompareStatistic';

import HelperGame from '@/components/helpers/Game';
import { Game, Games } from '@/types/general';
import { getNavHeaderHeight } from '../NavBar';
import { getSubNavHeaderHeight } from '../SubNavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';

/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div>
      {children}
    </div>
  );
};


const ClientSkeleton = () => {
  const paddingTop = getNavHeaderHeight() + getSubNavHeaderHeight();

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 120;
  return (
    <Contents>
      <div style = {{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100vh - ${heightToRemove}px)`,
      }}>
        <LinearProgress color = 'secondary' style={{ width: '50%' }} />
      </div>
    </Contents>
  );
};


// TODO update to show differential from season averages, build it into stats compare component?


const Client = ({ game, momentumData, stats }) => {
  const { width } = useWindowDimensions() as Dimensions;

  const Game = new HelperGame({
    game,
  });

  let numberOfTeams = CBB.getNumberOfD1Teams(game.season);

  if (game.organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id: game.division_id, season: game.season });
  }

  const awayStats = (game.away_team_id in stats) ? stats[game.away_team_id] : {};
  const homeStats = (game.home_team_id in stats) ? stats[game.home_team_id] : {};

  const awayMomentumStats = (momentumData && momentumData[game.away_team_id] && momentumData[game.away_team_id].stats) || {};
  const homeMomentumStats = (momentumData && momentumData[game.home_team_id] && momentumData[game.home_team_id].stats) || {};

  const awayTeamGames: Games = (momentumData && momentumData[game.away_team_id] && momentumData[game.away_team_id].games) || {};
  const homeTeamGames: Games = (momentumData && momentumData[game.home_team_id] && momentumData[game.home_team_id].games) || {};


  const getSections = () => {
    // Ones up here are shared by both CBB and CFB (for now)
    const marginRows = [
      {
        name: 'Win MR',
        title: 'Avg. Win margin',
        away: awayMomentumStats.win_margin,
        home: homeMomentumStats.win_margin,
        awayCompareValue: awayMomentumStats.win_margin,
        homeCompareValue: homeMomentumStats.win_margin,
        favored: 'higher',
        showDifference: true,
      },
      {
        name: 'Loss MR',
        title: 'Avg. Loss margin',
        away: awayMomentumStats.loss_margin,
        home: homeMomentumStats.loss_margin,
        awayCompareValue: awayMomentumStats.loss_margin,
        homeCompareValue: homeMomentumStats.loss_margin,
        favored: 'lower',
        showDifference: true,
      },
      {
        name: 'Conf. W MR',
        title: 'Avg. Conference win margin',
        away: awayMomentumStats.confwin_margin,
        home: homeMomentumStats.confwin_margin,
        awayCompareValue: awayMomentumStats.confwin_margin,
        homeCompareValue: homeMomentumStats.confwin_margin,
        favored: 'higher',
        showDifference: true,
      },
      {
        name: 'Conf. L MR',
        title: 'Avg. Conference loss margin',
        away: awayMomentumStats.confloss_margin,
        home: homeMomentumStats.confloss_margin,
        awayCompareValue: awayMomentumStats.confloss_margin,
        homeCompareValue: homeMomentumStats.confloss_margin,
        favored: 'lower',
        showDifference: true,
      },
    ];

    const recordRows = [
      {
        name: 'Wins',
        title: 'Total wins',
        away: awayMomentumStats.wins,
        home: homeMomentumStats.wins,
        awayCompareValue: awayMomentumStats.wins,
        homeCompareValue: homeMomentumStats.wins,
        favored: 'higher',
        showDifference: true,
      },
      {
        name: 'Losses',
        title: 'Total losses',
        away: awayMomentumStats.losses,
        home: homeMomentumStats.losses,
        awayCompareValue: awayMomentumStats.losses,
        homeCompareValue: homeMomentumStats.losses,
        favored: 'lower',
        showDifference: true,
      },
      {
        name: 'Conf. wins',
        title: 'Conference wins',
        away: awayMomentumStats.confwins,
        home: homeMomentumStats.confwins,
        awayCompareValue: awayMomentumStats.confwins,
        homeCompareValue: homeMomentumStats.confwins,
        favored: 'higher',
        showDifference: true,
      },
      {
        name: 'Conf. losses',
        title: 'Conference losses',
        away: awayMomentumStats.conflosses,
        home: homeMomentumStats.conflosses,
        awayCompareValue: awayMomentumStats.conflosses,
        homeCompareValue: homeMomentumStats.conflosses,
        favored: 'lower',
        showDifference: true,
      },
      {
        name: 'Neut. wins',
        title: 'Neutral wins',
        away: awayMomentumStats.neutralwins,
        home: homeMomentumStats.neutralwins,
        awayCompareValue: awayMomentumStats.neutralwins,
        homeCompareValue: homeMomentumStats.neutralwins,
        favored: 'higher',
        showDifference: true,
      },
      {
        name: 'Neut. losses',
        title: 'Neutral losses',
        away: awayMomentumStats.neutrallosses,
        home: homeMomentumStats.neutrallosses,
        awayCompareValue: awayMomentumStats.neutrallosses,
        homeCompareValue: homeMomentumStats.neutrallosses,
        favored: 'lower',
        showDifference: true,
      },
      {
        name: 'Home wins',
        title: 'Home wins',
        away: awayMomentumStats.homewins,
        home: homeMomentumStats.homewins,
        awayCompareValue: awayMomentumStats.homewins,
        homeCompareValue: homeMomentumStats.homewins,
        favored: 'higher',
        showDifference: true,
      },
      {
        name: 'Home losses',
        title: 'Home losses',
        away: awayMomentumStats.homelosses,
        home: homeMomentumStats.homelosses,
        awayCompareValue: awayMomentumStats.homelosses,
        homeCompareValue: homeMomentumStats.homelosses,
        favored: 'lower',
        showDifference: true,
      },
      {
        name: 'Road wins',
        title: 'Road wins',
        away: awayMomentumStats.roadwins,
        home: homeMomentumStats.roadwins,
        awayCompareValue: awayMomentumStats.roadwins,
        homeCompareValue: homeMomentumStats.roadwins,
        favored: 'higher',
        showDifference: true,
      },
      {
        name: 'Road losses',
        title: 'Road losses',
        away: awayMomentumStats.roadlosses,
        home: homeMomentumStats.roadlosses,
        awayCompareValue: awayMomentumStats.roadlosses,
        homeCompareValue: homeMomentumStats.roadlosses,
        favored: 'lower',
        showDifference: true,
      },
    ];

    if (Organization.isCFB()) {
      return [
        {
          name: 'Overview',
          rows: [
            {
              name: 'Record',
              title: 'Record',
              away: `${awayMomentumStats.wins}-${awayMomentumStats.losses}`,
              home: `${homeMomentumStats.wins}-${homeMomentumStats.losses}`,
              awayCompareValue: awayMomentumStats.wins,
              homeCompareValue: homeMomentumStats.wins,
              favored: 'higher',
              showDifference: true,
              precision: 0,
            },
            {
              name: 'QBR(c)',
              title: 'Quarterback rating (college)',
              away: awayMomentumStats.passing_rating_college,
              home: homeMomentumStats.passing_rating_college,
              awayCompareValue: awayMomentumStats.passing_rating_college,
              homeCompareValue: homeMomentumStats.passing_rating_college,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'PTS Off.',
              title: 'Avg points scored',
              away: awayMomentumStats.points,
              home: homeMomentumStats.points,
              awayCompareValue: awayMomentumStats.points,
              homeCompareValue: homeMomentumStats.points,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'PTS Def.',
              title: 'Avg points allowed',
              away: awayMomentumStats.opponent_points,
              home: homeMomentumStats.opponent_points,
              awayCompareValue: awayMomentumStats.opponent_points,
              homeCompareValue: homeMomentumStats.opponent_points,
              favored: 'lower',
              showDifference: true,
            },
          ],
        },
        {
          name: 'Efficiency',
          rows: [
            {
              name: 'YPP',
              title: 'Yards per play',
              away: awayMomentumStats.yards_per_play,
              home: homeMomentumStats.yards_per_play,
              awayCompareValue: awayMomentumStats.yards_per_play,
              homeCompareValue: homeMomentumStats.yards_per_play,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'PPP',
              title: 'Points per play',
              away: awayMomentumStats.points_per_play,
              home: homeMomentumStats.points_per_play,
              awayCompareValue: awayMomentumStats.points_per_play,
              homeCompareValue: homeMomentumStats.points_per_play,
              favored: 'higher',
              showDifference: true,
            },
            // {
            //   name: 'D-DVOA',
            //   title: 'Defensive DVOA',
            //   value: teamStats.defensive_dvoa,
            //   rank: teamStats.defensive_dvoa_rank,
            // },
            // {
            //   name: 'O-DVOA',
            //   title: 'Offensive DVOA',
            //   value: teamStats.offensive_dvoa,
            //   rank: teamStats.offensive_dvoa_rank,
            // },
          ],
        },
        {
          name: 'Passing',
          rows: [
            {
              name: 'Pass att.',
              title: 'Passing attempts',
              away: awayMomentumStats.passing_attempts,
              home: homeMomentumStats.passing_attempts,
              awayCompareValue: awayMomentumStats.passing_attempts,
              homeCompareValue: homeMomentumStats.passing_attempts,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Pass comp.',
              title: 'Passing completions',
              away: awayMomentumStats.passing_completions,
              home: homeMomentumStats.passing_completions,
              awayCompareValue: awayMomentumStats.passing_completions,
              homeCompareValue: homeMomentumStats.passing_completions,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Pass yards',
              title: 'Passing yards',
              away: awayMomentumStats.passing_yards,
              home: homeMomentumStats.passing_yards,
              awayCompareValue: awayMomentumStats.passing_yards,
              homeCompareValue: homeMomentumStats.passing_yards,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Pass comp. %',
              title: 'Passing completions percentage',
              away: awayMomentumStats.passing_completion_percentage,
              home: homeMomentumStats.passing_completion_percentage,
              awayCompareValue: awayMomentumStats.passing_completion_percentage,
              homeCompareValue: homeMomentumStats.passing_completion_percentage,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Pass yards per att.',
              title: 'Passing yard per attempt',
              away: awayMomentumStats.passing_yards_per_attempt,
              home: homeMomentumStats.passing_yards_per_attempt,
              awayCompareValue: awayMomentumStats.passing_yards_per_attempt,
              homeCompareValue: homeMomentumStats.passing_yards_per_attempt,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Pass yards per comp.',
              title: 'Passing yards per completion',
              away: awayMomentumStats.passing_yards_per_completion,
              home: homeMomentumStats.passing_yards_per_completion,
              awayCompareValue: awayMomentumStats.passing_yards_per_completion,
              homeCompareValue: homeMomentumStats.passing_yards_per_completion,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Pass TD',
              title: 'Passing touchdowns',
              away: awayMomentumStats.passing_touchdowns,
              home: homeMomentumStats.passing_touchdowns,
              awayCompareValue: awayMomentumStats.passing_touchdowns,
              homeCompareValue: homeMomentumStats.passing_touchdowns,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Pass int.',
              title: 'Passing interceptions',
              away: awayMomentumStats.passing_interceptions,
              home: homeMomentumStats.passing_interceptions,
              awayCompareValue: awayMomentumStats.passing_interceptions,
              homeCompareValue: homeMomentumStats.passing_interceptions,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Pass long',
              title: 'Passing long',
              away: awayMomentumStats.passing_long,
              home: homeMomentumStats.passing_long,
              awayCompareValue: awayMomentumStats.passing_long,
              homeCompareValue: homeMomentumStats.passing_long,
              favored: 'higher',
              showDifference: true,
            },
          ],
        },
        {
          name: 'Rushing',
          rows: [
            {
              name: 'Rush att.',
              title: 'Rushing attempts',
              away: awayMomentumStats.rushing_attempts,
              home: homeMomentumStats.rushing_attempts,
              awayCompareValue: awayMomentumStats.rushing_attempts,
              homeCompareValue: homeMomentumStats.rushing_attempts,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Rush yards',
              title: 'Rushing yards',
              away: awayMomentumStats.rushing_yards,
              home: homeMomentumStats.rushing_yards,
              awayCompareValue: awayMomentumStats.rushing_yards,
              homeCompareValue: homeMomentumStats.rushing_yards,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Rush yards per att.',
              title: 'Rushing yards per attempt',
              away: awayMomentumStats.rushing_yards_per_attempt,
              home: homeMomentumStats.rushing_yards_per_attempt,
              awayCompareValue: awayMomentumStats.rushing_yards_per_attempt,
              homeCompareValue: homeMomentumStats.rushing_yards_per_attempt,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Rush TD',
              title: 'Rushing touchdowns',
              away: awayMomentumStats.rushing_touchdowns,
              home: homeMomentumStats.rushing_touchdowns,
              awayCompareValue: awayMomentumStats.rushing_touchdowns,
              homeCompareValue: homeMomentumStats.rushing_touchdowns,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Rush long',
              title: 'Rushing long',
              away: awayMomentumStats.rushing_long,
              home: homeMomentumStats.rushing_long,
              awayCompareValue: awayMomentumStats.rushing_long,
              homeCompareValue: homeMomentumStats.rushing_long,
              favored: 'higher',
              showDifference: true,
            },
          ],
        },
        {
          name: 'Receiving',
          rows: [
            {
              name: 'Receptions',
              title: '# of receptions',
              away: awayMomentumStats.receptions,
              home: homeMomentumStats.receptions,
              awayCompareValue: awayMomentumStats.receptions,
              homeCompareValue: homeMomentumStats.receptions,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Rec. yards',
              title: 'Receiving yards',
              away: awayMomentumStats.receiving_yards,
              home: homeMomentumStats.receiving_yards,
              awayCompareValue: awayMomentumStats.receiving_yards,
              homeCompareValue: homeMomentumStats.receiving_yards,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Rec. yards per recep.',
              title: 'Receiving yards per reception',
              away: awayMomentumStats.receiving_yards_per_reception,
              home: homeMomentumStats.receiving_yards_per_reception,
              awayCompareValue: awayMomentumStats.receiving_yards_per_reception,
              homeCompareValue: homeMomentumStats.receiving_yards_per_reception,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Rec. TD',
              title: 'Receiving touchdowns',
              away: awayMomentumStats.receiving_touchdowns,
              home: homeMomentumStats.receiving_touchdowns,
              awayCompareValue: awayMomentumStats.receiving_touchdowns,
              homeCompareValue: homeMomentumStats.receiving_touchdowns,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Rec. long',
              title: 'Receiving long',
              away: awayMomentumStats.receiving_long,
              home: homeMomentumStats.receiving_long,
              awayCompareValue: awayMomentumStats.receiving_long,
              homeCompareValue: homeMomentumStats.receiving_long,
              favored: 'higher',
              showDifference: true,
            },
          ],
        },
        {
          name: 'Margin',
          rows: marginRows,
        },
        {
          name: 'Record',
          rows: recordRows,
        },
        {
          name: 'Defensive',
          rows: [
            {
              name: 'Opp. PTS',
              title: 'Opponent points',
              away: awayMomentumStats.opponent_points,
              home: homeMomentumStats.opponent_points,
              awayCompareValue: awayMomentumStats.opponent_points,
              homeCompareValue: homeMomentumStats.opponent_points,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. YPP',
              title: 'Opponent Yards per play',
              away: awayMomentumStats.opponent_yards_per_play,
              home: homeMomentumStats.opponent_yards_per_play,
              awayCompareValue: awayMomentumStats.opponent_yards_per_play,
              homeCompareValue: homeMomentumStats.opponent_yards_per_play,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. PPP',
              title: 'Opponent Points per play',
              away: awayMomentumStats.opponent_points_per_play,
              home: homeMomentumStats.opponent_points_per_play,
              awayCompareValue: awayMomentumStats.opponent_points_per_play,
              homeCompareValue: homeMomentumStats.opponent_points_per_play,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Pass att.',
              title: 'Opponent Passing attempts',
              away: awayMomentumStats.opponent_passing_attempts,
              home: homeMomentumStats.opponent_passing_attempts,
              awayCompareValue: awayMomentumStats.opponent_passing_attempts,
              homeCompareValue: homeMomentumStats.opponent_passing_attempts,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Pass comp.',
              title: 'Opponent Passing completions',
              away: awayMomentumStats.opponent_passing_completions,
              home: homeMomentumStats.opponent_passing_completions,
              awayCompareValue: awayMomentumStats.opponent_passing_completions,
              homeCompareValue: homeMomentumStats.opponent_passing_completions,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Pass yards',
              title: 'Opponent Passing yards',
              away: awayMomentumStats.opponent_passing_yards,
              home: homeMomentumStats.opponent_passing_yards,
              awayCompareValue: awayMomentumStats.opponent_passing_yards,
              homeCompareValue: homeMomentumStats.opponent_passing_yards,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Pass comp. %',
              title: 'Opponent Passing completions percentage',
              away: awayMomentumStats.opponent_passing_completion_percentage,
              home: homeMomentumStats.opponent_passing_completion_percentage,
              awayCompareValue: awayMomentumStats.opponent_passing_completion_percentage,
              homeCompareValue: homeMomentumStats.opponent_passing_completion_percentage,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Pass yards per att.',
              title: 'Opponent Passing yard per attempt',
              away: awayMomentumStats.opponent_passing_yards_per_attempt,
              home: homeMomentumStats.opponent_passing_yards_per_attempt,
              awayCompareValue: awayMomentumStats.opponent_passing_yards_per_attempt,
              homeCompareValue: homeMomentumStats.opponent_passing_yards_per_attempt,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Pass yards per comp.',
              title: 'Opponent Passing yards per completion',
              away: awayMomentumStats.opponent_passing_yards_per_completion,
              home: homeMomentumStats.opponent_passing_yards_per_completion,
              awayCompareValue: awayMomentumStats.opponent_passing_yards_per_completion,
              homeCompareValue: homeMomentumStats.opponent_passing_yards_per_completion,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Pass TD',
              title: 'Opponent Passing touchdowns',
              away: awayMomentumStats.opponent_passing_touchdowns,
              home: homeMomentumStats.opponent_passing_touchdowns,
              awayCompareValue: awayMomentumStats.opponent_passing_touchdowns,
              homeCompareValue: homeMomentumStats.opponent_passing_touchdowns,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Pass int.',
              title: 'Opponent Passing interceptions',
              away: awayMomentumStats.opponent_passing_interceptions,
              home: homeMomentumStats.opponent_passing_interceptions,
              awayCompareValue: awayMomentumStats.opponent_passing_interceptions,
              homeCompareValue: homeMomentumStats.opponent_passing_interceptions,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Pass long',
              title: 'Opponent Passing long',
              away: awayMomentumStats.opponent_passing_long,
              home: homeMomentumStats.opponent_passing_long,
              awayCompareValue: awayMomentumStats.opponent_passing_long,
              homeCompareValue: homeMomentumStats.opponent_passing_long,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Rush att.',
              title: 'Opponent Rushing attempts',
              away: awayMomentumStats.opponent_rushing_attempts,
              home: homeMomentumStats.opponent_rushing_attempts,
              awayCompareValue: awayMomentumStats.opponent_rushing_attempts,
              homeCompareValue: homeMomentumStats.opponent_rushing_attempts,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Rush yards',
              title: 'Opponent Rushing yards',
              away: awayMomentumStats.opponent_rushing_yards,
              home: homeMomentumStats.opponent_rushing_yards,
              awayCompareValue: awayMomentumStats.opponent_rushing_yards,
              homeCompareValue: homeMomentumStats.opponent_rushing_yards,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Rush yards per att.',
              title: 'Opponent Rushing yards per attempt',
              away: awayMomentumStats.opponent_rushing_yards_per_attempt,
              home: homeMomentumStats.opponent_rushing_yards_per_attempt,
              awayCompareValue: awayMomentumStats.opponent_rushing_yards_per_attempt,
              homeCompareValue: homeMomentumStats.opponent_rushing_yards_per_attempt,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Rush TD',
              title: 'Opponent Rushing touchdowns',
              away: awayMomentumStats.opponent_rushing_touchdowns,
              home: homeMomentumStats.opponent_rushing_touchdowns,
              awayCompareValue: awayMomentumStats.opponent_rushing_touchdowns,
              homeCompareValue: homeMomentumStats.opponent_rushing_touchdowns,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Rush long',
              title: 'Opponent Rushing long',
              away: awayMomentumStats.opponent_rushing_long,
              home: homeMomentumStats.opponent_rushing_long,
              awayCompareValue: awayMomentumStats.opponent_rushing_long,
              homeCompareValue: homeMomentumStats.opponent_rushing_long,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Receptions',
              title: 'Opponent # of receptions',
              away: awayMomentumStats.opponent_receptions,
              home: homeMomentumStats.opponent_receptions,
              awayCompareValue: awayMomentumStats.opponent_receptions,
              homeCompareValue: homeMomentumStats.opponent_receptions,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Rec. yards',
              title: 'Opponent Receiving yards',
              away: awayMomentumStats.opponent_receiving_yards,
              home: homeMomentumStats.opponent_receiving_yards,
              awayCompareValue: awayMomentumStats.opponent_receiving_yards,
              homeCompareValue: homeMomentumStats.opponent_receiving_yards,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Rec. yards per recep.',
              title: 'Opponent Receiving yards per reception',
              away: awayMomentumStats.opponent_receiving_yards_per_reception,
              home: homeMomentumStats.opponent_receiving_yards_per_reception,
              awayCompareValue: awayMomentumStats.opponent_receiving_yards_per_reception,
              homeCompareValue: homeMomentumStats.opponent_receiving_yards_per_reception,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Rec. TD',
              title: 'Opponent Receiving touchdowns',
              away: awayMomentumStats.opponent_receiving_touchdowns,
              home: homeMomentumStats.opponent_receiving_touchdowns,
              awayCompareValue: awayMomentumStats.opponent_receiving_touchdowns,
              homeCompareValue: homeMomentumStats.opponent_receiving_touchdowns,
              favored: 'lower',
              showDifference: true,
            },
            {
              name: 'Opp. Rec. long',
              title: 'Opponent Receiving long',
              away: awayMomentumStats.opponent_receiving_long,
              home: homeMomentumStats.opponent_receiving_long,
              awayCompareValue: awayMomentumStats.opponent_receiving_long,
              homeCompareValue: homeMomentumStats.opponent_receiving_long,
              favored: 'lower',
              showDifference: true,
            },
          ],
        },
      ];
    }

    // defaulting to CBB
    return [
      {
        name: 'Overview',
        rows: [
          {
            name: 'Record',
            title: 'Record',
            away: `${awayMomentumStats.wins}-${awayMomentumStats.losses}`,
            home: `${homeMomentumStats.wins}-${homeMomentumStats.losses}`,
            awayCompareValue: awayMomentumStats.wins,
            homeCompareValue: homeMomentumStats.wins,
            favored: 'higher',
            showDifference: true,
            precision: 0,
          },
          {
            name: 'ORT',
            title: 'Offensive rating',
            away: awayMomentumStats.offensive_rating,
            home: homeMomentumStats.offensive_rating,
            awayCompareValue: awayMomentumStats.offensive_rating,
            homeCompareValue: homeMomentumStats.offensive_rating,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: 'DRT',
            title: 'Defensive rating',
            away: awayMomentumStats.defensive_rating,
            home: homeMomentumStats.defensive_rating,
            awayCompareValue: awayMomentumStats.defensive_rating,
            homeCompareValue: homeMomentumStats.defensive_rating,
            favored: 'lower',
            showDifference: true,
          },
          {
            name: 'PTS Off.',
            title: 'Avg points scored',
            away: awayMomentumStats.points,
            home: homeMomentumStats.points,
            awayCompareValue: awayMomentumStats.points,
            homeCompareValue: homeMomentumStats.points,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: 'PTS Def.',
            title: 'Avg points allowed',
            away: awayMomentumStats.opponent_points,
            home: homeMomentumStats.opponent_points,
            awayCompareValue: awayMomentumStats.opponent_points,
            homeCompareValue: homeMomentumStats.opponent_points,
            favored: 'lower',
            showDifference: true,
          },
        ],
      },
      {
        name: 'Offense',
        rows: [
          {
            name: 'Pace',
            title: 'Pace',
            tooltip: 'Possesions per game',
            away: awayMomentumStats.possessions,
            home: homeMomentumStats.possessions,
            awayCompareValue: awayMomentumStats.possessions,
            homeCompareValue: homeMomentumStats.possessions,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: 'FG',
            title: 'FG',
            tooltip: 'Field goals per game',
            away: awayMomentumStats.field_goal,
            home: homeMomentumStats.field_goal,
            awayCompareValue: awayMomentumStats.field_goal,
            homeCompareValue: homeMomentumStats.field_goal,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: 'FGA',
            title: 'FGA',
            tooltip: 'Field goal attempts per game',
            away: awayMomentumStats.field_goal_attempts,
            home: homeMomentumStats.field_goal_attempts,
            awayCompareValue: awayMomentumStats.field_goal_attempts,
            homeCompareValue: homeMomentumStats.field_goal_attempts,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: 'FG%',
            title: 'FG%',
            tooltip: 'Field goal percentage',
            away: `${awayMomentumStats.field_goal_percentage}%`,
            home: `${homeMomentumStats.field_goal_percentage}%`,
            awayCompareValue: awayMomentumStats.field_goal_percentage,
            homeCompareValue: homeMomentumStats.field_goal_percentage,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: '2P',
            title: '2P',
            tooltip: '2 point field goals per game',
            away: awayMomentumStats.two_point_field_goal,
            home: homeMomentumStats.two_point_field_goal,
            awayCompareValue: awayMomentumStats.two_point_field_goal,
            homeCompareValue: homeMomentumStats.two_point_field_goal,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: '2PA',
            title: '2PA',
            tooltip: '2 point field goal attempts per game',
            away: awayMomentumStats.two_point_field_goal_attempts,
            home: homeMomentumStats.two_point_field_goal_attempts,
            awayCompareValue: awayMomentumStats.two_point_field_goal_attempts,
            homeCompareValue: homeMomentumStats.two_point_field_goal_attempts,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: '2P%',
            title: '2P%',
            tooltip: '2 point field goal percentage',
            away: `${awayMomentumStats.two_point_field_goal_percentage}%`,
            home: `${homeMomentumStats.two_point_field_goal_percentage}%`,
            awayCompareValue: awayMomentumStats.two_point_field_goal_percentage,
            homeCompareValue: homeMomentumStats.two_point_field_goal_percentage,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: '3P',
            title: '3P',
            tooltip: '3 point field goals per game',
            away: awayMomentumStats.three_point_field_goal,
            home: homeMomentumStats.three_point_field_goal,
            awayCompareValue: awayMomentumStats.three_point_field_goal,
            homeCompareValue: homeMomentumStats.three_point_field_goal,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: '3PA',
            title: '3PA',
            tooltip: '3 point field goal attempts per game',
            away: awayMomentumStats.three_point_field_goal_attempts,
            home: homeMomentumStats.three_point_field_goal_attempts,
            awayCompareValue: awayMomentumStats.three_point_field_goal_attempts,
            homeCompareValue: homeMomentumStats.three_point_field_goal_attempts,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: '3P%',
            title: '3P%',
            tooltip: '3 point field goal percentage',
            away: `${awayMomentumStats.three_point_field_goal_percentage}%`,
            home: `${homeMomentumStats.three_point_field_goal_percentage}%`,
            awayCompareValue: awayMomentumStats.three_point_field_goal_percentage,
            homeCompareValue: homeMomentumStats.three_point_field_goal_percentage,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: 'FT',
            title: 'FT',
            tooltip: 'Free throws per game',
            away: awayMomentumStats.free_throws,
            home: homeMomentumStats.free_throws,
            awayCompareValue: awayMomentumStats.free_throws,
            homeCompareValue: homeMomentumStats.free_throws,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: 'FTA',
            title: 'FTA',
            tooltip: 'Free throw attempts per game',
            away: awayMomentumStats.free_throw_attempts,
            home: homeMomentumStats.free_throw_attempts,
            awayCompareValue: awayMomentumStats.free_throw_attempts,
            homeCompareValue: homeMomentumStats.free_throw_attempts,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: 'FT%',
            title: 'FT%',
            tooltip: 'Free throw percentage',
            away: `${awayMomentumStats.free_throw_percentage}%`,
            home: `${homeMomentumStats.free_throw_percentage}%`,
            awayCompareValue: awayMomentumStats.free_throw_percentage,
            homeCompareValue: homeMomentumStats.free_throw_percentage,
            favored: 'higher',
            showDifference: true,
          },
        ],
      },
      {
        name: 'Special',
        rows: [
          {
            name: 'ORB',
            title: 'ORB',
            tooltip: 'Offensive rebounds per game',
            away: awayMomentumStats.offensive_rebounds,
            home: homeMomentumStats.offensive_rebounds,
            awayCompareValue: awayMomentumStats.offensive_rebounds,
            homeCompareValue: homeMomentumStats.offensive_rebounds,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: 'DRB',
            title: 'DRB',
            tooltip: 'Defensive rebounds per game',
            away: awayMomentumStats.defensive_rebounds,
            home: homeMomentumStats.defensive_rebounds,
            awayCompareValue: awayMomentumStats.defensive_rebounds,
            homeCompareValue: homeMomentumStats.defensive_rebounds,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: 'AST',
            title: 'AST',
            tooltip: 'Assists per game',
            away: awayMomentumStats.assists,
            home: homeMomentumStats.assists,
            awayCompareValue: awayMomentumStats.assists,
            homeCompareValue: homeMomentumStats.assists,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: 'STL',
            title: 'STL',
            tooltip: 'Steals per game',
            away: awayMomentumStats.steals,
            home: homeMomentumStats.steals,
            awayCompareValue: awayMomentumStats.steals,
            homeCompareValue: homeMomentumStats.steals,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: 'BLK',
            title: 'BLK',
            tooltip: 'Blocks per game',
            away: awayMomentumStats.blocks,
            home: homeMomentumStats.blocks,
            awayCompareValue: awayMomentumStats.blocks,
            homeCompareValue: homeMomentumStats.blocks,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: 'TOV',
            title: 'TOV',
            tooltip: 'Turnovers per game',
            away: awayMomentumStats.turnovers,
            home: homeMomentumStats.turnovers,
            awayCompareValue: awayMomentumStats.turnovers,
            homeCompareValue: homeMomentumStats.turnovers,
            favored: 'lower',
            showDifference: true,
          },
          {
            name: 'PF',
            title: 'PF',
            tooltip: 'Turnovers per game',
            away: awayMomentumStats.fouls,
            home: homeMomentumStats.fouls,
            awayCompareValue: awayMomentumStats.fouls,
            homeCompareValue: homeMomentumStats.fouls,
            favored: 'lower',
            showDifference: true,
          },
        ],
      },
      {
        name: 'Margin',
        rows: marginRows,
      },
      {
        name: 'Record',
        rows: recordRows,
      },
      {
        name: 'Defensive',
        rows: [
          {
            name: 'FG',
            title: 'FG',
            tooltip: 'Oppenent field goals per game',
            away: awayMomentumStats.opponent_field_goal,
            home: homeMomentumStats.opponent_field_goal,
            awayCompareValue: awayMomentumStats.opponent_field_goal,
            homeCompareValue: homeMomentumStats.opponent_field_goal,
            favored: 'lower',
            showDifference: true,
          },
          {
            name: 'FGA',
            title: 'FGA',
            tooltip: 'Oppenent field goal attempts per game',
            away: awayMomentumStats.opponent_field_goal_attempts,
            home: homeMomentumStats.opponent_field_goal_attempts,
            awayCompareValue: awayMomentumStats.opponent_field_goal_attempts,
            homeCompareValue: homeMomentumStats.opponent_field_goal_attempts,
            favored: 'lower',
            showDifference: true,
          },
          {
            name: 'FG%',
            title: 'FG%',
            tooltip: 'Oppenent field goal percentage',
            away: `${awayMomentumStats.opponent_field_goal_percentage}%`,
            home: `${homeMomentumStats.opponent_field_goal_percentage}%`,
            awayCompareValue: awayMomentumStats.opponent_field_goal_percentage,
            homeCompareValue: homeMomentumStats.opponent_field_goal_percentage,
            favored: 'lower',
            showDifference: true,
          },
          {
            name: 'ORB',
            title: 'ORB',
            tooltip: 'Oppenent Offensive rebounds per game',
            away: awayMomentumStats.opponent_offensive_rebounds,
            home: homeMomentumStats.opponent_offensive_rebounds,
            awayCompareValue: awayMomentumStats.opponent_offensive_rebounds,
            homeCompareValue: homeMomentumStats.opponent_offensive_rebounds,
            favored: 'lower',
            showDifference: true,
          },
          {
            name: 'DRB',
            title: 'DRB',
            tooltip: 'Oppenent Defensive rebounds per game',
            away: awayMomentumStats.opponent_defensive_rebounds,
            home: homeMomentumStats.opponent_defensive_rebounds,
            awayCompareValue: awayMomentumStats.opponent_defensive_rebounds,
            homeCompareValue: homeMomentumStats.opponent_defensive_rebounds,
            favored: 'lower',
            showDifference: true,
          },
          {
            name: 'AST',
            title: 'AST',
            tooltip: 'Oppenent Assists per game',
            away: awayMomentumStats.opponent_assists,
            home: homeMomentumStats.opponent_assists,
            awayCompareValue: awayMomentumStats.opponent_assists,
            homeCompareValue: homeMomentumStats.opponent_assists,
            favored: 'lower',
            showDifference: true,
          },
          {
            name: 'STL',
            title: 'STL',
            tooltip: 'Oppenent Steals per game',
            away: awayMomentumStats.opponent_steals,
            home: homeMomentumStats.opponent_steals,
            awayCompareValue: awayMomentumStats.opponent_steals,
            homeCompareValue: homeMomentumStats.opponent_steals,
            favored: 'lower',
            showDifference: true,
          },
          {
            name: 'BLK',
            title: 'BLK',
            tooltip: 'Oppenent Blocks per game',
            away: awayMomentumStats.opponent_blocks,
            home: homeMomentumStats.opponent_blocks,
            awayCompareValue: awayMomentumStats.opponent_blocks,
            homeCompareValue: homeMomentumStats.opponent_blocks,
            favored: 'lower',
            showDifference: true,
          },
          {
            name: 'TOV',
            title: 'TOV',
            tooltip: 'Oppenent Turnovers per game',
            away: awayMomentumStats.opponent_turnovers,
            home: homeMomentumStats.opponent_turnovers,
            awayCompareValue: awayMomentumStats.opponent_turnovers,
            homeCompareValue: homeMomentumStats.opponent_turnovers,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: 'PF',
            title: 'PF',
            tooltip: 'Oppenent Turnovers per game',
            away: awayMomentumStats.opponent_fouls,
            home: homeMomentumStats.opponent_fouls,
            awayCompareValue: awayMomentumStats.opponent_fouls,
            homeCompareValue: homeMomentumStats.opponent_fouls,
            favored: 'higher',
            showDifference: true,
          },
        ],
      },
    ];
  };

  const sections = getSections();

  const sortedHomeGames: Game[] = Object.values(homeTeamGames).sort((a, b) => {
    return a.start_date < b.start_date ? -1 : 1;
  });

  const sortedAwayGames: Game[] = Object.values(awayTeamGames).sort((a, b) => {
    return a.start_date < b.start_date ? -1 : 1;
  });

  const flexContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-evenly',
    marginBottom: '10px',
    flexWrap: 'nowrap',
  };

  if (width < 700) {
    flexContainerStyle.flexDirection = 'column';
  }

  let moreThanOneGame = false;

  if (momentumData) {
    for (const team_id in momentumData) {
      const counter = Object.keys(momentumData[team_id].games).length;
      if (counter > 1) {
        moreThanOneGame = true;
      }
    }
  }


  return (
    <Contents>
      <div style = {{ padding: '0px 5px 20px 5px' }}>
        {
          momentumData !== null && moreThanOneGame ?
          <div>
            <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'h6'>Last 5 game stat comparison</Typography>
              <div style = {flexContainerStyle}>
              <Paper elevation = {3} style = {{ padding: 10, margin: '0px 5px 10px 5px' }}>
                <table style = {{ width: '100%' }}>
                  <tr>
                    <th colSpan = {3}><Typography variant = 'caption'>{Game.getTeamName('away')}</Typography></th>
                  </tr>
                  {
                    sortedAwayGames.map((game_) => {
                      const G = new HelperGame({
                        game: game_,
                      });

                      const won = ((game_.home_score || 0) > (game_.away_score || 0) && game_.home_team_id === game.away_team_id) || ((game_.home_score || 0) < (game_.away_score || 0) && game_.away_team_id === game.away_team_id);

                      return (<tr>
                        <td style = {{ padding: '0px 5px' }}><Typography variant = 'caption'>{moment(game_.start_datetime).format('M/D')}</Typography></td>
                        <td style = {{ padding: '0px 5px' }}><Typography variant = 'caption'>{game_.away_team_id === game.away_team_id ? `@ ${G.getTeamName('home')}` : `vs ${G.getTeamName('away')}`}</Typography></td>
                        <td style = {{ padding: '0px 5px', textAlign: 'right' }}><Typography variant = 'caption'>{won ? 'W' : 'L'} {game_.away_score} - {game_.home_score}</Typography></td>
                      </tr>);
                    })
                  }
                </table>
                <Typography variant = 'caption'>{Game.getTeamName('away')} offense is trending {awayMomentumStats.offensive_rating > awayStats.offensive_rating ? 'up' : 'down'}, Defense is trending {awayMomentumStats.defensive_rating < awayStats.defensive_rating ? 'up' : 'down'}.</Typography>
                </Paper>
                <Paper elevation = {3} style = {{ padding: 10, margin: '0px 5px 10px 5px' }}>
                <table style = {{ width: '100%' }}>
                  <tr>
                    <th colSpan = {3}><Typography variant = 'caption'>{Game.getTeamName('home')}</Typography></th>
                  </tr>
                  {
                    sortedHomeGames.map((game_) => {
                      const G = new HelperGame({
                        game: game_,
                      });

                      const won = ((game_.home_score || 0) > (game_.away_score || 0) && game_.home_team_id === game.home_team_id) || ((game_.home_score || 0) < (game_.away_score || 0) && game_.away_team_id === game.home_team_id);

                      return (<tr>
                        <td style = {{ padding: '0px 5px' }}><Typography variant = 'caption'>{moment(game_.start_datetime).format('M/D')}</Typography></td>
                        <td style = {{ padding: '0px 5px' }}><Typography variant = 'caption'>{game_.home_team_id === game.home_team_id ? `@ ${G.getTeamName('away')}` : `vs ${G.getTeamName('home')}`}</Typography></td>
                        <td style = {{ padding: '0px 5px', textAlign: 'right' }}><Typography variant = 'caption'>{won ? 'W' : 'L'} {game_.away_score} - {game_.home_score}</Typography></td>
                      </tr>);
                    })
                  }
                </table>
                <Typography variant = 'caption'>{Game.getTeamName('home')} offense is trending {homeMomentumStats.offensive_rating > homeStats.offensive_rating ? 'up' : 'down'}. Defense is trending {homeMomentumStats.defensive_rating < homeStats.defensive_rating ? 'up' : 'down'}.</Typography>
                </Paper>
              </div>
              {// <Typography style = {{'margin': '10px 0px'}} variant = 'body2'>Below shows the averages of the last 5 games. Next to each statisic shows the team's season average.</Typography>
              }
            {sections.map((section) => {
              return (
                <>
                  <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'body1'>{section.name}</Typography>
                  <CompareStatistic max = {numberOfTeams} season = {game.season} paper = {true} rows = {section.rows} />
                </>
              );
            })}
          </div>
            : ''
        }
        {
          momentumData !== null && !moreThanOneGame ?
          <div style={{ textAlign: 'center' }}>
            <Typography variant = 'h5'>Not enough data to determine momentum yet.</Typography>
          </div>
            : ''
        }
      </div>
    </Contents>
  );
};

export { Client, ClientSkeleton };
