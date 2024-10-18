'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { styled, useTheme } from '@mui/material/styles';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import HelperGame from '@/components/helpers/Game';
import CompareStatistic from '@/components/generic/CompareStatistic';
import { Boxscore as BoxscoreCBB, PlayerBoxscore } from '@/types/cbb';
import { Boxscore as BoxscoreCFB } from '@/types/cfb';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';
import { LinearProgress } from '@mui/material';
import { getNavHeaderHeight } from '../NavBar';
import { getSubNavHeaderHeight } from '../SubNavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // '&:nth-of-type(odd)': {
  //   backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[900],
  // },
  // '&:nth-of-type(even)': {
  //   backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  // },
  '&:last-child td, &:last-child th': {
    // border: 0,
  },
  '&:hover td': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
  },
  border: 0,
  '&:hover': {
    cursor: 'pointer',
  },
}));

/*
const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
}));
*/


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


const Client = ({ game, boxscores, player_boxscores, players /* tag */ }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  let numberOfTeams = CBB.getNumberOfD1Teams(game.season);

  if (game.organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id: game.division_id, season: game.season });
  }

  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id: game.organization_id });

  const [boxscoreSide, setBoxscoreSide] = useState('away');

  const awayBoxscores: PlayerBoxscore[] = [];
  const homeBoxscores: PlayerBoxscore[] = [];

  for (const player_boxscore_id in player_boxscores) {
    const row = player_boxscores[player_boxscore_id];

    if (row.team_id === game.away_team_id) {
      awayBoxscores.push(row);
    } else if (row.team_id === game.home_team_id) {
      homeBoxscores.push(row);
    }
  }

  let awayTotalBoxscore: any = {} as any;
  let homeTotalBoxscore: any = {} as any;

  for (const boxscore_id in boxscores) {
    const row = boxscores[boxscore_id];

    if (row.team_id === game.away_team_id) {
      awayTotalBoxscore = row;
    } else if (row.team_id === game.home_team_id) {
      homeTotalBoxscore = row;
    }
  }


  const hasBoxscoreData = ('points' in awayTotalBoxscore) && ('points' in homeTotalBoxscore);


  const boxscore = (boxscoreSide === 'home' ? homeBoxscores : awayBoxscores).sort((a, b) => {
    return a.minutes_played > b.minutes_played ? -1 : 1;
  });
  const boxscoreTotal = boxscoreSide === 'home' ? homeTotalBoxscore : awayTotalBoxscore;

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

  const headCells = [
    {
      id: 'player_name',
      numeric: false,
      label: 'Player',
      tooltip: 'Player name',
    },
    {
      id: 'MP',
      numeric: false,
      label: 'MP',
      tooltip: 'Minutes played',
    },
    {
      id: 'PTS',
      numeric: false,
      label: 'PTS',
      tooltip: 'Points',
    },
    {
      id: 'FG',
      label: 'FG',
      tooltip: 'Field goals',
    },
    {
      id: '2P',
      label: '2P',
      tooltip: '2 point field goals',
    },
    {
      id: '3P',
      label: '3P',
      tooltip: '3 point field goals',
    },
    {
      id: 'FT',
      label: 'FT',
      tooltip: 'Free throws',
    },
    {
      id: 'ORB',
      label: 'ORB',
      tooltip: 'Offensive rebounds',
    },
    {
      id: 'DRB',
      label: 'DRB',
      tooltip: 'Defensive rebounds',
    },
    {
      id: 'AST',
      label: 'AST',
      tooltip: 'Assists',
    },
    {
      id: 'STL',
      label: 'STL',
      tooltip: 'Steals',
    },
    {
      id: 'BLK',
      label: 'BLK',
      tooltip: 'Blocks',
    },
    {
      id: 'TOV',
      label: 'TOV',
      tooltip: 'Turnovers',
    },
    {
      id: 'PF',
      label: 'PF',
      title: 'Personal fouls',
    },
  ];

  const getBoxscoreRows = () => {
    if (game.organization_id === Organization.getCFBID()) {
      return [
        {
          name: 'PTS',
          title: 'PTS',
          tooltip: 'Points',
          away: awayTotalBoxscore.points,
          home: homeTotalBoxscore.points,
          awayCompareValue: awayTotalBoxscore.points,
          homeCompareValue: homeTotalBoxscore.points,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'QBR(c)',
          title: 'QBR(c)',
          away: awayTotalBoxscore.passing_rating_college,
          home: homeTotalBoxscore.passing_rating_college,
          awayCompareValue: awayTotalBoxscore.passing_rating_college,
          homeCompareValue: homeTotalBoxscore.passing_rating_college,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Pass att.',
          title: 'Passing attempts',
          away: awayTotalBoxscore.passing_attempts,
          home: homeTotalBoxscore.passing_attempts,
          awayCompareValue: awayTotalBoxscore.passing_attempts,
          homeCompareValue: homeTotalBoxscore.passing_attempts,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Pass comp.',
          title: 'Passing completions',
          away: awayTotalBoxscore.passing_completions,
          home: homeTotalBoxscore.passing_completions,
          awayCompareValue: awayTotalBoxscore.passing_completions,
          homeCompareValue: homeTotalBoxscore.passing_completions,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Pass yds',
          title: 'Passing yards',
          away: awayTotalBoxscore.passing_yards,
          home: homeTotalBoxscore.passing_yards,
          awayCompareValue: awayTotalBoxscore.passing_yards,
          homeCompareValue: homeTotalBoxscore.passing_yards,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Pass comp. %',
          title: 'Passing completions percentage',
          away: awayTotalBoxscore.passing_completion_percentage,
          home: homeTotalBoxscore.passing_completion_percentage,
          awayCompareValue: awayTotalBoxscore.passing_completion_percentage,
          homeCompareValue: homeTotalBoxscore.passing_completion_percentage,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Pass yds att.',
          title: 'Passing yard per attempt',
          away: awayTotalBoxscore.passing_yards_per_attempt,
          home: homeTotalBoxscore.passing_yards_per_attempt,
          awayCompareValue: awayTotalBoxscore.passing_yards_per_attempt,
          homeCompareValue: homeTotalBoxscore.passing_yards_per_attempt,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Pass yds comp.',
          title: 'Passing yards per completion',
          away: awayTotalBoxscore.passing_yards_per_completion,
          home: homeTotalBoxscore.passing_yards_per_completion,
          awayCompareValue: awayTotalBoxscore.passing_yards_per_completion,
          homeCompareValue: homeTotalBoxscore.passing_yards_per_completion,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Pass TD',
          title: 'Passing touchdowns',
          away: awayTotalBoxscore.passing_touchdowns,
          home: homeTotalBoxscore.passing_touchdowns,
          awayCompareValue: awayTotalBoxscore.passing_touchdowns,
          homeCompareValue: homeTotalBoxscore.passing_touchdowns,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Pass int.',
          title: 'Passing interceptions',
          away: awayTotalBoxscore.passing_interceptions,
          home: homeTotalBoxscore.passing_interceptions,
          awayCompareValue: awayTotalBoxscore.passing_interceptions,
          homeCompareValue: homeTotalBoxscore.passing_interceptions,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Pass long',
          title: 'Passing long',
          away: awayTotalBoxscore.passing_long,
          home: homeTotalBoxscore.passing_long,
          awayCompareValue: awayTotalBoxscore.passing_long,
          homeCompareValue: homeTotalBoxscore.passing_long,
          favored: 'higher',
          showDifference: true,
          precision: 0,
        },
        {
          name: 'Rush att.',
          title: 'Rushing attempts',
          away: awayTotalBoxscore.rushing_attempts,
          home: homeTotalBoxscore.rushing_attempts,
          awayCompareValue: awayTotalBoxscore.rushing_attempts,
          homeCompareValue: homeTotalBoxscore.rushing_attempts,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rush yds',
          title: 'Rushing yards',
          away: awayTotalBoxscore.rushing_yards,
          home: homeTotalBoxscore.rushing_yards,
          awayCompareValue: awayTotalBoxscore.rushing_yards,
          homeCompareValue: homeTotalBoxscore.rushing_yards,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rush yds att.',
          title: 'Rushing yards per attempt',
          away: awayTotalBoxscore.rushing_yards_per_attempt,
          home: homeTotalBoxscore.rushing_yards_per_attempt,
          awayCompareValue: awayTotalBoxscore.rushing_yards_per_attempt,
          homeCompareValue: homeTotalBoxscore.rushing_yards_per_attempt,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rush TD',
          title: 'Rushing touchdowns',
          away: awayTotalBoxscore.rushing_touchdowns,
          home: homeTotalBoxscore.rushing_touchdowns,
          awayCompareValue: awayTotalBoxscore.rushing_touchdowns,
          homeCompareValue: homeTotalBoxscore.rushing_touchdowns,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rush long',
          title: 'Rushing long',
          away: awayTotalBoxscore.rushing_long,
          home: homeTotalBoxscore.rushing_long,
          awayCompareValue: awayTotalBoxscore.rushing_long,
          homeCompareValue: homeTotalBoxscore.rushing_long,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rec.',
          title: 'Receptions',
          away: awayTotalBoxscore.receptions,
          home: homeTotalBoxscore.receptions,
          awayCompareValue: awayTotalBoxscore.receptions,
          homeCompareValue: homeTotalBoxscore.receptions,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rec. yds',
          title: 'Recieving yards',
          away: awayTotalBoxscore.receiving_yards,
          home: homeTotalBoxscore.receiving_yards,
          awayCompareValue: awayTotalBoxscore.receiving_yards,
          homeCompareValue: homeTotalBoxscore.receiving_yards,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rec. yds per catch',
          title: 'Receiving yards per reception',
          away: awayTotalBoxscore.receiving_yards_per_reception,
          home: homeTotalBoxscore.receiving_yards_per_reception,
          awayCompareValue: awayTotalBoxscore.receiving_yards_per_reception,
          homeCompareValue: homeTotalBoxscore.receiving_yards_per_reception,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rec. TD',
          title: 'Receiving touchdowns',
          away: awayTotalBoxscore.receiving_touchdowns,
          home: homeTotalBoxscore.receiving_touchdowns,
          awayCompareValue: awayTotalBoxscore.receiving_touchdowns,
          homeCompareValue: homeTotalBoxscore.receiving_touchdowns,
          favored: 'higher',
          showDifference: true,
        },
        {
          name: 'Rec. long',
          title: 'Receiving long',
          away: awayTotalBoxscore.receiving_long,
          home: homeTotalBoxscore.receiving_long,
          awayCompareValue: awayTotalBoxscore.receiving_long,
          homeCompareValue: homeTotalBoxscore.receiving_long,
          favored: 'higher',
          showDifference: true,
        },
      ];
    }

    return [
      {
        name: 'PTS',
        title: 'PTS',
        tooltip: 'Points',
        away: awayTotalBoxscore.points,
        home: homeTotalBoxscore.points,
        awayCompareValue: awayTotalBoxscore.points,
        homeCompareValue: homeTotalBoxscore.points,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'FG',
        title: 'FG',
        tooltip: 'Field goals per game',
        away: awayTotalBoxscore.field_goal,
        home: homeTotalBoxscore.field_goal,
        awayCompareValue: awayTotalBoxscore.field_goal,
        homeCompareValue: homeTotalBoxscore.field_goal,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'FGA',
        title: 'FGA',
        tooltip: 'Field goal attempts per game',
        away: awayTotalBoxscore.field_goal_attempts,
        home: homeTotalBoxscore.field_goal_attempts,
        awayCompareValue: awayTotalBoxscore.field_goal_attempts,
        homeCompareValue: homeTotalBoxscore.field_goal_attempts,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'FG%',
        title: 'FG%',
        tooltip: 'Field goal percentage',
        away: `${awayTotalBoxscore.field_goal_percentage}%`,
        home: `${homeTotalBoxscore.field_goal_percentage}%`,
        awayCompareValue: awayTotalBoxscore.field_goal_percentage,
        homeCompareValue: homeTotalBoxscore.field_goal_percentage,
        favored: 'higher',
        showDifference: true,
      },
      {
        name: '2P',
        title: '2P',
        tooltip: '2 point field goals per game',
        away: awayTotalBoxscore.two_point_field_goal,
        home: homeTotalBoxscore.two_point_field_goal,
        awayCompareValue: awayTotalBoxscore.two_point_field_goal,
        homeCompareValue: homeTotalBoxscore.two_point_field_goal,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: '2PA',
        title: '2PA',
        tooltip: '2 point field goal attempts per game',
        away: awayTotalBoxscore.two_point_field_goal_attempts,
        home: homeTotalBoxscore.two_point_field_goal_attempts,
        awayCompareValue: awayTotalBoxscore.two_point_field_goal_attempts,
        homeCompareValue: homeTotalBoxscore.two_point_field_goal_attempts,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: '2P%',
        title: '2P%',
        tooltip: '2 point field goal percentage',
        away: `${awayTotalBoxscore.two_point_field_goal_percentage}%`,
        home: `${homeTotalBoxscore.two_point_field_goal_percentage}%`,
        awayCompareValue: awayTotalBoxscore.two_point_field_goal_percentage,
        homeCompareValue: homeTotalBoxscore.two_point_field_goal_percentage,
        favored: 'higher',
        showDifference: true,
      },
      {
        name: '3P',
        title: '3P',
        tooltip: '3 point field goals per game',
        away: awayTotalBoxscore.three_point_field_goal,
        home: homeTotalBoxscore.three_point_field_goal,
        awayCompareValue: awayTotalBoxscore.three_point_field_goal,
        homeCompareValue: homeTotalBoxscore.three_point_field_goal,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: '3PA',
        title: '3PA',
        tooltip: '3 point field goal attempts per game',
        away: awayTotalBoxscore.three_point_field_goal_attempts,
        home: homeTotalBoxscore.three_point_field_goal_attempts,
        awayCompareValue: awayTotalBoxscore.three_point_field_goal_attempts,
        homeCompareValue: homeTotalBoxscore.three_point_field_goal_attempts,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: '3P%',
        title: '3P%',
        tooltip: '3 point field goal percentage',
        away: `${awayTotalBoxscore.three_point_field_goal_percentage}%`,
        home: `${homeTotalBoxscore.three_point_field_goal_percentage}%`,
        awayCompareValue: awayTotalBoxscore.three_point_field_goal_percentage,
        homeCompareValue: homeTotalBoxscore.three_point_field_goal_percentage,
        favored: 'higher',
        showDifference: true,
      },
      {
        name: 'FT',
        title: 'FT',
        tooltip: 'Free throws per game',
        away: awayTotalBoxscore.free_throws,
        home: homeTotalBoxscore.free_throws,
        awayCompareValue: awayTotalBoxscore.free_throws,
        homeCompareValue: homeTotalBoxscore.free_throws,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'FTA',
        title: 'FTA',
        tooltip: 'Free throw attempts per game',
        away: awayTotalBoxscore.free_throw_attempts,
        home: homeTotalBoxscore.free_throw_attempts,
        awayCompareValue: awayTotalBoxscore.free_throw_attempts,
        homeCompareValue: homeTotalBoxscore.free_throw_attempts,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'FT%',
        title: 'FT%',
        tooltip: 'Free throw percentage',
        away: `${awayTotalBoxscore.free_throw_percentage}%`,
        home: `${homeTotalBoxscore.free_throw_percentage}%`,
        awayCompareValue: awayTotalBoxscore.free_throw_percentage,
        homeCompareValue: homeTotalBoxscore.free_throw_percentage,
        favored: 'higher',
        showDifference: true,
      },
      {
        name: 'ORB',
        title: 'ORB',
        tooltip: 'Offensive rebounds',
        away: awayTotalBoxscore.offensive_rebounds,
        home: homeTotalBoxscore.offensive_rebounds,
        awayCompareValue: awayTotalBoxscore.offensive_rebounds,
        homeCompareValue: homeTotalBoxscore.offensive_rebounds,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'DRB',
        title: 'DRB',
        tooltip: 'Defensive rebounds',
        away: awayTotalBoxscore.defensive_rebounds,
        home: homeTotalBoxscore.defensive_rebounds,
        awayCompareValue: awayTotalBoxscore.defensive_rebounds,
        homeCompareValue: homeTotalBoxscore.defensive_rebounds,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'AST',
        title: 'AST',
        tooltip: 'Assists',
        away: awayTotalBoxscore.assists,
        home: homeTotalBoxscore.assists,
        awayCompareValue: awayTotalBoxscore.assists,
        homeCompareValue: homeTotalBoxscore.assists,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'STL',
        title: 'STL',
        tooltip: 'Steals',
        away: awayTotalBoxscore.steals,
        home: homeTotalBoxscore.steals,
        awayCompareValue: awayTotalBoxscore.steals,
        homeCompareValue: homeTotalBoxscore.steals,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'BLK',
        title: 'BLK',
        tooltip: 'Blocks',
        away: awayTotalBoxscore.blocks,
        home: homeTotalBoxscore.blocks,
        awayCompareValue: awayTotalBoxscore.blocks,
        homeCompareValue: homeTotalBoxscore.blocks,
        favored: 'higher',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'TOV',
        title: 'TOV',
        tooltip: 'Turnovers',
        away: awayTotalBoxscore.turnovers,
        home: homeTotalBoxscore.turnovers,
        awayCompareValue: awayTotalBoxscore.turnovers,
        homeCompareValue: homeTotalBoxscore.turnovers,
        favored: 'lower',
        showDifference: true,
        precision: 0,
      },
      {
        name: 'PF',
        title: 'PF',
        tooltip: 'Fouls',
        away: awayTotalBoxscore.fouls,
        home: homeTotalBoxscore.fouls,
        awayCompareValue: awayTotalBoxscore.fouls,
        homeCompareValue: homeTotalBoxscore.fouls,
        favored: 'lower',
        showDifference: true,
        precision: 0,
      },
    ];
  };

  const compareRows = getBoxscoreRows();


  return (
    <Contents>
      <div>
        <div style = {{ padding: '10px 5px' }}>
          {hasBoxscoreData ? <CompareStatistic season = {game.season} max = {numberOfTeams} paper = {true} rows = {compareRows} /> : <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'h5'>No boxscore data yet...</Typography>}
        </div>
      </div>
      {
        game.organization_id === Organization.getCBBID() ?
        <div style = {{ padding: '0px 5px' }}>
          <Typography style = {{ margin: '10px 0px' }} variant = 'body1'>Player boxscore</Typography>
          <Chip sx = {{ margin: '0px 10px 10px 10px' }} variant = {boxscoreSide === 'away' ? 'filled' : 'outlined'} color = {boxscoreSide === 'away' ? 'success' : 'primary'} onClick= {() => { setBoxscoreSide('away'); }} label = {Game.getTeamName('away')} />
          <Chip sx = {{ margin: '0px 10px 10px 10px' }} variant = {boxscoreSide === 'home' ? 'filled' : 'outlined'} color = {boxscoreSide === 'home' ? 'success' : 'primary'} onClick= {() => { setBoxscoreSide('home'); }} label = {Game.getTeamName('home')} />
          <TableContainer component={Paper}>
            <Table size="small" aria-label="team boxscore table">
              <TableHead>
                <TableRow>
                  {headCells.map((headCell) => (
                    <TableCell
                    key={headCell.id}
                    align={'left'}
                    >
                    {headCell.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {boxscore.map((row) => {
                  if (!row.minutes_played) {
                    return null;
                  }

                  if (
                    !row.minutes_played
                  ) {
                    return null;
                  }

                  let player_name = (row.first_name ? `${row.first_name.charAt(0)}. ` : '') + row.last_name;

                  if (row.player_id && players && row.player_id in players) {
                    const player = players[row.player_id];
                    player_name = (player.first_name ? `${player.first_name.charAt(0)}. ` : '') + player.last_name;
                  }

                  const getCells = () => {
                    return (
                      <>
                        <TableCell>{player_name}</TableCell>
                        <TableCell>{row.minutes_played}</TableCell>
                        <TableCell>{row.points}</TableCell>

                        <TableCell>
                          <div style = {{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                              {row.field_goal}-{row.field_goal_attempts}
                            </div>
                            <div style = {{ color: theme.palette.grey[500] }}>
                              {row.field_goal_percentage}%
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div style = {{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                              {row.two_point_field_goal}-{row.two_point_field_goal_attempts}
                            </div>
                            <div style = {{ color: theme.palette.grey[500] }}>
                              {row.two_point_field_goal_percentage}%
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div style = {{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                              {row.three_point_field_goal}-{row.three_point_field_goal_attempts}
                            </div>
                            <div style = {{ color: theme.palette.grey[500] }}>
                              {row.three_point_field_goal_percentage}%
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div style = {{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                              {row.free_throws}-{row.free_throw_attempts}
                            </div>
                            <div style = {{ color: theme.palette.grey[500] }}>
                              {row.free_throw_percentage}%
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>{row.offensive_rebounds}</TableCell>
                        <TableCell>{row.defensive_rebounds}</TableCell>
                        <TableCell>{row.assists}</TableCell>
                        <TableCell>{row.steals}</TableCell>
                        <TableCell>{row.blocks}</TableCell>
                        <TableCell>{row.turnovers}</TableCell>
                        <TableCell>{row.fouls}</TableCell>
                      </>
                    );
                  };

                  if (!row.player_id) {
                    return <TableRow key={row.player_boxscore_id}>{getCells()}</TableRow>;
                  }
                  return <StyledTableRow key={row.player_boxscore_id} onClick={() => { handleClick(row.player_id); }}>{getCells()}</StyledTableRow>;
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{boxscoreTotal.points}</TableCell>
                  <TableCell>{boxscoreTotal.field_goal}-{boxscoreTotal.field_goal_attempts} {boxscoreTotal.field_goal_percentage}%</TableCell>
                  <TableCell>{boxscoreTotal.two_point_field_goal}-{boxscoreTotal.two_point_field_goal_attempts} {boxscoreTotal.two_point_field_goal_percentage}%</TableCell>
                  <TableCell>{boxscoreTotal.three_point_field_goal}-{boxscoreTotal.three_point_field_goal_attempts} {boxscoreTotal.three_point_field_goal_percentage}%</TableCell>
                  <TableCell>{boxscoreTotal.free_throws}-{boxscoreTotal.free_throw_attempts} {boxscoreTotal.free_throw_percentage}%</TableCell>
                  <TableCell>{boxscoreTotal.offensive_rebounds}</TableCell>
                  <TableCell>{boxscoreTotal.defensive_rebounds}</TableCell>
                  <TableCell>{boxscoreTotal.assists}</TableCell>
                  <TableCell>{boxscoreTotal.steals}</TableCell>
                  <TableCell>{boxscoreTotal.blocks}</TableCell>
                  <TableCell>{boxscoreTotal.turnovers}</TableCell>
                  <TableCell>{boxscoreTotal.fouls}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div>
          : ''
      }
    </Contents>
  );
};

export { Client, ClientSkeleton };
