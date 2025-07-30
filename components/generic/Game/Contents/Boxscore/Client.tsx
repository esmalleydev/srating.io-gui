'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import HelperGame from '@/components/helpers/Game';
import CompareStatistic from '@/components/generic/CompareStatistic';
import { Boxscore as BoxscoreCBB, PlayerBoxscore, PlayerBoxscores } from '@/types/cbb';
import { Boxscore as BoxscoreCFB } from '@/types/cfb';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';
import { LinearProgress } from '@mui/material';
import { getNavHeaderHeight, getSubNavHeaderHeight } from '@/components/generic/Game/NavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';
// import ButtonSwitch from '../../ButtonSwitch';
import RankTable from '@/components/generic/RankTable';
import { Game, Players } from '@/types/general';
import Chip from '@/components/ux/container/Chip';
import Typography from '@/components/ux/text/Typography';




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


const Client = (
  { game, boxscores, player_boxscores, players /* tag */ }:
  { game: Game; boxscores: BoxscoreCBB[] | BoxscoreCFB[]; player_boxscores: PlayerBoxscores; players: Players /* tag */ },
) => {
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  let numberOfTeams = CBB.getNumberOfD1Teams(game.season);

  if (game.organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id: game.division_id, season: game.season });
  }

  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id: game.organization_id });

  const [boxscore_team_id, set_boxscore_team_id] = useState(game.away_team_id);

  const playerColumns = ['name', 'minutes_played', 'points', 'fg', 'two_fg', 'three_fg', 'ft', 'offensive_rebounds', 'defensive_rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'fouls'];

  let home_boxscore: BoxscoreCBB | BoxscoreCFB | null = null;
  let away_boxscore: BoxscoreCBB | BoxscoreCFB | null = null;

  for (const boxscore_id in boxscores) {
    const row = boxscores[boxscore_id];

    if (row.team_id === game.away_team_id) {
      away_boxscore = row;
    }

    if (row.team_id === game.home_team_id) {
      home_boxscore = row;
    }
  }

  const playerRows: object[] = [];

  type FooterRow = Partial<PlayerBoxscore> & {
    name?: string;
    fg?: string;
    fg_secondary?: string;
    two_fg?: string;
    two_fg_secondary?: string;
    three_fg?: string;
    three_fg_secondary?: string;
    ft?: string;
    ft_secondary?: string;
  }

  const footerRow: FooterRow = {
    name: 'Total',
  };

  for (const player_boxscore_id in player_boxscores) {
    const row = player_boxscores[player_boxscore_id];

    if (!row.minutes_played) {
      continue;
    }

    if (boxscore_team_id !== row.team_id) {
      continue;
    }

    let player_name = (row.first_name ? `${row.first_name.charAt(0)}. ` : '') + row.last_name;

    if (row.player_id && players && row.player_id in players) {
      const player = players[row.player_id];
      player_name = (player.first_name ? `${player.first_name.charAt(0)}. ` : '') + player.last_name;
    }

    const formattedRow = { ...row } as FooterRow;

    formattedRow.name = player_name;

    formattedRow.fg = `${row.field_goal || 0}-${row.field_goal_attempts || 0}`;
    formattedRow.fg_secondary = `${row.field_goal_percentage || 0}%`;

    formattedRow.two_fg = `${row.two_point_field_goal || 0}-${row.two_point_field_goal_attempts || 0}`;
    formattedRow.two_fg_secondary = `${row.two_point_field_goal_percentage || 0}%`;

    formattedRow.three_fg = `${row.three_point_field_goal || 0}-${row.three_point_field_goal_attempts || 0}`;
    formattedRow.three_fg_secondary = `${row.three_point_field_goal_percentage || 0}%`;

    formattedRow.ft = `${row.free_throws || 0}-${row.free_throw_attempts || 0}`;
    formattedRow.ft_secondary = `${row.free_throw_percentage || 0}%`;

    for (const key in row) {
      if (!(key in footerRow)) {
        footerRow[key] = row[key];
      } else {
        footerRow[key] = +(+footerRow[key] + +row[key]).toFixed(2);
      }
    }

    playerRows.push(formattedRow);
  }

  footerRow.fg = `${footerRow.field_goal || 0}-${footerRow.field_goal_attempts || 0}`;
  footerRow.fg_secondary = footerRow.field_goal_attempts !== undefined && footerRow.field_goal_attempts > 0 ? `${(((footerRow.field_goal || 0) / footerRow.field_goal_attempts) * 100).toFixed(2)}%` : '0%';

  footerRow.two_fg = `${footerRow.two_point_field_goal || 0}-${footerRow.two_point_field_goal_attempts || 0}`;
  footerRow.two_fg_secondary = footerRow.two_point_field_goal_attempts !== undefined && footerRow.two_point_field_goal_attempts > 0 ? `${(((footerRow.two_point_field_goal || 0) / footerRow.two_point_field_goal_attempts) * 100).toFixed(2)}%` : '0%';

  footerRow.three_fg = `${footerRow.three_point_field_goal || 0}-${footerRow.three_point_field_goal_attempts || 0}`;
  footerRow.three_fg_secondary = footerRow.three_point_field_goal_attempts !== undefined && footerRow.three_point_field_goal_attempts > 0 ? `${(((footerRow.three_point_field_goal || 0) / footerRow.three_point_field_goal_attempts) * 100).toFixed(2)}%` : '0%';

  footerRow.ft = `${footerRow.free_throws || 0}-${footerRow.free_throw_attempts || 0}`;
  footerRow.ft_secondary = footerRow.free_throw_attempts !== undefined && footerRow.free_throw_attempts > 0 ? `${(((footerRow.free_throws || 0) / footerRow.free_throw_attempts) * 100).toFixed(2)}%` : '0%';

  const hasBoxscoreData = away_boxscore && home_boxscore && ('points' in away_boxscore) && ('points' in home_boxscore);

  const handleClick = (player_id) => {
    if (!player_id) {
      console.warn('Missing player_id');
      return;
    }
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/${path}/player/${player_id}`);
    });
  };

  const Game = new HelperGame({
    game,
  });

  const getBoxscoreRows = () => {
    if (!hasBoxscoreData) {
      return [];
    }

    if (game.organization_id === Organization.getCFBID()) {
      away_boxscore = away_boxscore as BoxscoreCFB;
      home_boxscore = home_boxscore as BoxscoreCFB;
      return [
        {
          name: 'PTS',
          title: 'PTS',
          tooltip: 'Points',
          away: away_boxscore.points,
          home: home_boxscore.points,
          awayCompareValue: away_boxscore.points,
          homeCompareValue: home_boxscore.points,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'QBR(c)',
          title: 'QBR(c)',
          away: away_boxscore.passing_rating_college,
          home: home_boxscore.passing_rating_college,
          awayCompareValue: away_boxscore.passing_rating_college,
          homeCompareValue: home_boxscore.passing_rating_college,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Pass att.',
          title: 'Passing attempts',
          away: away_boxscore.passing_attempts,
          home: home_boxscore.passing_attempts,
          awayCompareValue: away_boxscore.passing_attempts,
          homeCompareValue: home_boxscore.passing_attempts,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Pass comp.',
          title: 'Passing completions',
          away: away_boxscore.passing_completions,
          home: home_boxscore.passing_completions,
          awayCompareValue: away_boxscore.passing_completions,
          homeCompareValue: home_boxscore.passing_completions,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Pass yds',
          title: 'Passing yards',
          away: away_boxscore.passing_yards,
          home: home_boxscore.passing_yards,
          awayCompareValue: away_boxscore.passing_yards,
          homeCompareValue: home_boxscore.passing_yards,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Pass comp. %',
          title: 'Passing completions percentage',
          away: away_boxscore.passing_completion_percentage,
          home: home_boxscore.passing_completion_percentage,
          awayCompareValue: away_boxscore.passing_completion_percentage,
          homeCompareValue: home_boxscore.passing_completion_percentage,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Pass yds att.',
          title: 'Passing yard per attempt',
          away: away_boxscore.passing_yards_per_attempt,
          home: home_boxscore.passing_yards_per_attempt,
          awayCompareValue: away_boxscore.passing_yards_per_attempt,
          homeCompareValue: home_boxscore.passing_yards_per_attempt,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Pass yds comp.',
          title: 'Passing yards per completion',
          away: away_boxscore.passing_yards_per_completion,
          home: home_boxscore.passing_yards_per_completion,
          awayCompareValue: away_boxscore.passing_yards_per_completion,
          homeCompareValue: home_boxscore.passing_yards_per_completion,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Pass TD',
          title: 'Passing touchdowns',
          away: away_boxscore.passing_touchdowns,
          home: home_boxscore.passing_touchdowns,
          awayCompareValue: away_boxscore.passing_touchdowns,
          homeCompareValue: home_boxscore.passing_touchdowns,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Pass int.',
          title: 'Passing interceptions',
          away: away_boxscore.passing_interceptions,
          home: home_boxscore.passing_interceptions,
          awayCompareValue: away_boxscore.passing_interceptions,
          homeCompareValue: home_boxscore.passing_interceptions,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Pass long',
          title: 'Passing long',
          away: away_boxscore.passing_long,
          home: home_boxscore.passing_long,
          awayCompareValue: away_boxscore.passing_long,
          homeCompareValue: home_boxscore.passing_long,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Rush att.',
          title: 'Rushing attempts',
          away: away_boxscore.rushing_attempts,
          home: home_boxscore.rushing_attempts,
          awayCompareValue: away_boxscore.rushing_attempts,
          homeCompareValue: home_boxscore.rushing_attempts,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rush yds',
          title: 'Rushing yards',
          away: away_boxscore.rushing_yards,
          home: home_boxscore.rushing_yards,
          awayCompareValue: away_boxscore.rushing_yards,
          homeCompareValue: home_boxscore.rushing_yards,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rush yds att.',
          title: 'Rushing yards per attempt',
          away: away_boxscore.rushing_yards_per_attempt,
          home: home_boxscore.rushing_yards_per_attempt,
          awayCompareValue: away_boxscore.rushing_yards_per_attempt,
          homeCompareValue: home_boxscore.rushing_yards_per_attempt,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rush TD',
          title: 'Rushing touchdowns',
          away: away_boxscore.rushing_touchdowns,
          home: home_boxscore.rushing_touchdowns,
          awayCompareValue: away_boxscore.rushing_touchdowns,
          homeCompareValue: home_boxscore.rushing_touchdowns,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rush long',
          title: 'Rushing long',
          away: away_boxscore.rushing_long,
          home: home_boxscore.rushing_long,
          awayCompareValue: away_boxscore.rushing_long,
          homeCompareValue: home_boxscore.rushing_long,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rec.',
          title: 'Receptions',
          away: away_boxscore.receptions,
          home: home_boxscore.receptions,
          awayCompareValue: away_boxscore.receptions,
          homeCompareValue: home_boxscore.receptions,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rec. yds',
          title: 'Receiving yards',
          away: away_boxscore.receiving_yards,
          home: home_boxscore.receiving_yards,
          awayCompareValue: away_boxscore.receiving_yards,
          homeCompareValue: home_boxscore.receiving_yards,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rec. yds per catch',
          title: 'Receiving yards per reception',
          away: away_boxscore.receiving_yards_per_reception,
          home: home_boxscore.receiving_yards_per_reception,
          awayCompareValue: away_boxscore.receiving_yards_per_reception,
          homeCompareValue: home_boxscore.receiving_yards_per_reception,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rec. TD',
          title: 'Receiving touchdowns',
          away: away_boxscore.receiving_touchdowns,
          home: home_boxscore.receiving_touchdowns,
          awayCompareValue: away_boxscore.receiving_touchdowns,
          homeCompareValue: home_boxscore.receiving_touchdowns,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rec. long',
          title: 'Receiving long',
          away: away_boxscore.receiving_long,
          home: home_boxscore.receiving_long,
          awayCompareValue: away_boxscore.receiving_long,
          homeCompareValue: home_boxscore.receiving_long,
          favored: 'higher',
          showDifference: true,
        },
      ];
    }

    away_boxscore = away_boxscore as BoxscoreCBB;
    home_boxscore = home_boxscore as BoxscoreCBB;

    return [
      {
        name: 'PTS',
        title: 'PTS',
        tooltip: 'Points',
        away: away_boxscore.points,
        home: home_boxscore.points,
        awayCompareValue: away_boxscore.points,
        homeCompareValue: home_boxscore.points,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'FG',
        title: 'FG',
        tooltip: 'Field goals per game',
        away: away_boxscore.field_goal,
        home: home_boxscore.field_goal,
        awayCompareValue: away_boxscore.field_goal,
        homeCompareValue: home_boxscore.field_goal,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'FGA',
        title: 'FGA',
        tooltip: 'Field goal attempts per game',
        away: away_boxscore.field_goal_attempts,
        home: home_boxscore.field_goal_attempts,
        awayCompareValue: away_boxscore.field_goal_attempts,
        homeCompareValue: home_boxscore.field_goal_attempts,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'FG%',
        title: 'FG%',
        tooltip: 'Field goal percentage',
        away: away_boxscore.field_goal_percentage !== null ? `${away_boxscore.field_goal_percentage}%` : '',
        home: home_boxscore.field_goal_percentage !== null ? `${home_boxscore.field_goal_percentage}%` : '',
        awayCompareValue: away_boxscore.field_goal_percentage,
        homeCompareValue: home_boxscore.field_goal_percentage,
        favored: 'higher',
        showDifference: true,
      },
      {
        name: '2P',
        title: '2P',
        tooltip: '2 point field goals per game',
        away: away_boxscore.two_point_field_goal,
        home: home_boxscore.two_point_field_goal,
        awayCompareValue: away_boxscore.two_point_field_goal,
        homeCompareValue: home_boxscore.two_point_field_goal,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: '2PA',
        title: '2PA',
        tooltip: '2 point field goal attempts per game',
        away: away_boxscore.two_point_field_goal_attempts,
        home: home_boxscore.two_point_field_goal_attempts,
        awayCompareValue: away_boxscore.two_point_field_goal_attempts,
        homeCompareValue: home_boxscore.two_point_field_goal_attempts,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: '2P%',
        title: '2P%',
        tooltip: '2 point field goal percentage',
        away: away_boxscore.two_point_field_goal_percentage !== null ? `${away_boxscore.two_point_field_goal_percentage}%` : '',
        home: home_boxscore.two_point_field_goal_percentage !== null ? `${home_boxscore.two_point_field_goal_percentage}%` : '',
        awayCompareValue: away_boxscore.two_point_field_goal_percentage,
        homeCompareValue: home_boxscore.two_point_field_goal_percentage,
        favored: 'higher',
        showDifference: true,
      },
      {
        name: '3P',
        title: '3P',
        tooltip: '3 point field goals per game',
        away: away_boxscore.three_point_field_goal,
        home: home_boxscore.three_point_field_goal,
        awayCompareValue: away_boxscore.three_point_field_goal,
        homeCompareValue: home_boxscore.three_point_field_goal,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: '3PA',
        title: '3PA',
        tooltip: '3 point field goal attempts per game',
        away: away_boxscore.three_point_field_goal_attempts,
        home: home_boxscore.three_point_field_goal_attempts,
        awayCompareValue: away_boxscore.three_point_field_goal_attempts,
        homeCompareValue: home_boxscore.three_point_field_goal_attempts,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: '3P%',
        title: '3P%',
        tooltip: '3 point field goal percentage',
        away: away_boxscore.three_point_field_goal_percentage !== null ? `${away_boxscore.three_point_field_goal_percentage}%` : '',
        home: home_boxscore.three_point_field_goal_percentage !== null ? `${home_boxscore.three_point_field_goal_percentage}%` : '',
        awayCompareValue: away_boxscore.three_point_field_goal_percentage,
        homeCompareValue: home_boxscore.three_point_field_goal_percentage,
        favored: 'higher',
        showDifference: true,
      },
      {
        name: 'FT',
        title: 'FT',
        tooltip: 'Free throws per game',
        away: away_boxscore.free_throws,
        home: home_boxscore.free_throws,
        awayCompareValue: away_boxscore.free_throws,
        homeCompareValue: home_boxscore.free_throws,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'FTA',
        title: 'FTA',
        tooltip: 'Free throw attempts per game',
        away: away_boxscore.free_throw_attempts,
        home: home_boxscore.free_throw_attempts,
        awayCompareValue: away_boxscore.free_throw_attempts,
        homeCompareValue: home_boxscore.free_throw_attempts,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'FT%',
        title: 'FT%',
        tooltip: 'Free throw percentage',
        away: away_boxscore.free_throw_percentage !== null ? `${away_boxscore.free_throw_percentage}%` : '',
        home: home_boxscore.free_throw_percentage !== null ? `${home_boxscore.free_throw_percentage}%` : '',
        awayCompareValue: away_boxscore.free_throw_percentage,
        homeCompareValue: home_boxscore.free_throw_percentage,
        favored: 'higher',
        showDifference: true,
      },
      {
        name: 'ORB',
        title: 'ORB',
        tooltip: 'Offensive rebounds',
        away: away_boxscore.offensive_rebounds,
        home: home_boxscore.offensive_rebounds,
        awayCompareValue: away_boxscore.offensive_rebounds,
        homeCompareValue: home_boxscore.offensive_rebounds,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'DRB',
        title: 'DRB',
        tooltip: 'Defensive rebounds',
        away: away_boxscore.defensive_rebounds,
        home: home_boxscore.defensive_rebounds,
        awayCompareValue: away_boxscore.defensive_rebounds,
        homeCompareValue: home_boxscore.defensive_rebounds,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'AST',
        title: 'AST',
        tooltip: 'Assists',
        away: away_boxscore.assists,
        home: home_boxscore.assists,
        awayCompareValue: away_boxscore.assists,
        homeCompareValue: home_boxscore.assists,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'STL',
        title: 'STL',
        tooltip: 'Steals',
        away: away_boxscore.steals,
        home: home_boxscore.steals,
        awayCompareValue: away_boxscore.steals,
        homeCompareValue: home_boxscore.steals,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'BLK',
        title: 'BLK',
        tooltip: 'Blocks',
        away: away_boxscore.blocks,
        home: home_boxscore.blocks,
        awayCompareValue: away_boxscore.blocks,
        homeCompareValue: home_boxscore.blocks,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'TOV',
        title: 'TOV',
        tooltip: 'Turnovers',
        away: away_boxscore.turnovers,
        home: home_boxscore.turnovers,
        awayCompareValue: away_boxscore.turnovers,
        homeCompareValue: home_boxscore.turnovers,
        favored: 'lower',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'PF',
        title: 'PF',
        tooltip: 'Fouls',
        away: away_boxscore.fouls,
        home: home_boxscore.fouls,
        awayCompareValue: away_boxscore.fouls,
        homeCompareValue: home_boxscore.fouls,
        favored: 'lower',
        showDifference: true,
        precision: 0,
      },
    ];
  };

  const playerBoxscoreHeaderColumns = {
    name: {
      id: 'name',
      numeric: false,
      label: 'Player',
      tooltip: 'Player',
      sticky: true,
    },
    minutes_played: {
      id: 'minutes_played',
      label: 'MP',
      tooltip: 'Minutes played',
      sort: 'higher',
      numeric: true,
    },
    points: {
      id: 'points',
      label: 'PTS',
      tooltip: 'Points',
      sort: 'higher',
      numeric: true,
    },
    fg: {
      id: 'fg',
      label: 'FG',
      tooltip: 'Field goals',
      sort: 'higher',
      numeric: true,
    },
    two_fg: {
      id: 'two_fg',
      label: '2P',
      tooltip: '2 point field goals',
      sort: 'higher',
      numeric: true,
    },
    three_fg: {
      id: 'three_fg',
      label: '3P',
      tooltip: '3 point field goals',
      sort: 'higher',
      numeric: true,
    },
    ft: {
      id: 'ft',
      label: 'FT',
      tooltip: 'Free throws',
      sort: 'higher',
      numeric: true,
    },
    offensive_rebounds: {
      id: 'offensive_rebounds',
      label: 'ORB',
      tooltip: 'Offensive rebounds',
      sort: 'higher',
      numeric: true,
    },
    defensive_rebounds: {
      id: 'defensive_rebounds',
      label: 'DRB',
      tooltip: 'Defensive rebounds',
      sort: 'higher',
      numeric: true,
    },
    assists: {
      id: 'assists',
      label: 'AST',
      tooltip: 'Assists',
      sort: 'higher',
      numeric: true,
    },
    steals: {
      id: 'steals',
      label: 'STL',
      tooltip: 'Steals',
      sort: 'higher',
      numeric: true,
    },
    blocks: {
      id: 'blocks',
      label: 'BLK',
      tooltip: 'Blocks',
      sort: 'higher',
      numeric: true,
    },
    turnovers: {
      id: 'turnovers',
      label: 'TOV',
      tooltip: 'Turnovers',
      sort: 'higher',
      numeric: true,
    },
    fouls: {
      id: 'fouls',
      label: 'PF',
      title: 'Personal fouls',
      sort: 'higher',
      numeric: true,
    },
  };


  return (
    <Contents>
      <div>
        <div style = {{ padding: '10px 5px' }}>
          {hasBoxscoreData ? <CompareStatistic season = {game.season} max = {numberOfTeams} paper = {true} rows = {getBoxscoreRows()} /> : <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} type = 'h5'>No boxscore data yet...</Typography>}
        </div>
      </div>
      {
        game.organization_id === Organization.getCBBID() ?
        <div style = {{ padding: '0px 5px 10px 5px' }}>
          {/* <ButtonSwitch leftTitle={Game.getTeamName('away')} rightTitle={Game.getTeamName('home')} selected = {boxscore_team_id === 'away' ? 'left' : 'right'} handleClick={() => { set_boxscore_team_id(boxscore_team_id === 'away' ? 'home' : 'away'); }} /> */}
          <div style = {{ textAlign: 'center' }}>
            <Chip style = {{ margin: '0px 10px 10px 10px' }} filled = {boxscore_team_id === game.away_team_id} value = {game.away_team_id} onClick= {() => { set_boxscore_team_id(game.away_team_id); }} title = {Game.getTeamName('away')} />
            <Chip style = {{ margin: '0px 10px 10px 10px' }} filled = {boxscore_team_id === game.home_team_id} value = {game.home_team_id} onClick= {() => { set_boxscore_team_id(game.home_team_id); }} title = {Game.getTeamName('home')} />
          </div>
          <RankTable
            rows={playerRows}
            footerRow={footerRow}
            columns={playerBoxscoreHeaderColumns}
            displayColumns={playerColumns}
            rowKey = 'player_id'
            defaultSortOrder = 'asc'
            defaultSortOrderBy = 'minutes_played'
            sessionStorageKey = {`${path}.TEAM.ROSTER`}
            secondaryKey = 'secondary'
            handleRowClick={handleClick}
           />
        </div>
          : ''
      }
    </Contents>
  );
};

export { Client, ClientSkeleton };
