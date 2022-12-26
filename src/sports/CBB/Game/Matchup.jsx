import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import HelperCBB from '../../../helpers/CBB';

const Matchup = (props) => {
  const self = this;
  
  // console.log(props);

  const awayTeam = props.awayTeam;
  const homeTeam = props.homeTeam;

  const awayStats = props.awayStats || {};
  const homeStats = props.homeStats || {};

  const theme = useTheme();

  const game = props.game;

  const CBB = new HelperCBB({
    'cbb_game': game,
  });

  const overviewRows = [
    {
      'name': 'Record',
      'away': awayStats.wins + '-' + awayStats.losses,
      'home': homeStats.wins + '-' + homeStats.losses,
    },
    {
      'name': 'Composite rank',
      'away': (awayTeam.ranking && awayTeam.ranking.composite_rank) || '-',
      'home': (homeTeam.ranking && homeTeam.ranking.composite_rank) || '-',
      'favored': 'lower',
    },
    {
      'name': 'Elo',
      'away': awayStats.elo,
      'home': homeStats.elo,
      'favored': 'higher',
    },
    {
      'name': 'AP',
      'away': (awayTeam.ranking && awayTeam.ranking.ap_rank) || '-',
      'home': (homeTeam.ranking && homeTeam.ranking.ap_rank) || '-',
      'favored': 'lower',
    },
    {
      'name': 'KP',
      'away': (awayTeam.ranking && awayTeam.ranking.kenpom_rank) || '-',
      'home': (homeTeam.ranking && homeTeam.ranking.kenpom_rank) || '-',
      'favored': 'lower',
    },
    {
      'name': 'SRS',
      'away': (awayTeam.ranking && awayTeam.ranking.srs_rank) || '-',
      'home': (homeTeam.ranking && homeTeam.ranking.srs_rank) || '-',
      'favored': 'lower',
    },
    {
      'name': 'Avg. PTS Offense',
      'away': awayStats.points,
      'home': homeStats.points,
      'favored': 'higher',
    },
    {
      'name': 'Avg. PTS Defense',
      'away': awayStats.opponent_points,
      'home': homeStats.opponent_points,
      'favored': 'lower',
    },
  ];

  const offenseRows = [
    {
      'name': 'FG',
      'title': 'Field goals per game',
      'away': awayStats.field_goal,
      'home': homeStats.field_goal,
      'favored': 'higher',
    },
    {
      'name': 'FGA',
      'title': 'Field goal attempts per game',
      'away': awayStats.field_goal_attempts,
      'home': homeStats.field_goal_attempts,
      'favored': 'higher',
    },
    {
      'name': 'FG%',
      'title': 'Field goal percentage',
      'away': awayStats.field_goal_percentage + '%',
      'home': homeStats.field_goal_percentage + '%',
      'favored': 'higher',
    },
    {
      'name': '2P',
      'title': '2 point field goals per game',
      'away': awayStats.two_point_field_goal,
      'home': homeStats.two_point_field_goal,
      'favored': 'higher',
    },
    {
      'name': '2PA',
      'title': '2 point field goal attempts per game',
      'away': awayStats.two_point_field_goal_attempts,
      'home': homeStats.two_point_field_goal_attempts,
      'favored': 'higher',
    },
    {
      'name': '2P%',
      'title': '2 point field goal percentage',
      'away': awayStats.two_point_field_goal_percentage + '%',
      'home': homeStats.two_point_field_goal_percentage + '%',
      'favored': 'higher',
    },
    {
      'name': '3P',
      'title': '3 point field goals per game',
      'away': awayStats.three_point_field_goal,
      'home': homeStats.three_point_field_goal,
      'favored': 'higher',
    },
    {
      'name': '3PA',
      'title': '3 point field goal attempts per game',
      'away': awayStats.three_point_field_goal_attempts,
      'home': homeStats.three_point_field_goal_attempts,
      'favored': 'higher',
    },
    {
      'name': '3P%',
      'title': '3 point field goal percentage',
      'away': awayStats.three_point_field_goal_percentage + '%',
      'home': homeStats.three_point_field_goal_percentage + '%',
      'favored': 'higher',
    },
    {
      'name': 'FT',
      'title': 'Free throws per game',
      'away': awayStats.free_throws,
      'home': homeStats.free_throws,
      'favored': 'higher',
    },
    {
      'name': 'FTA',
      'title': 'Free throw attempts per game',
      'away': awayStats.free_throw_attempts,
      'home': homeStats.free_throw_attempts,
      'favored': 'higher',
    },
    {
      'name': 'FT%',
      'title': 'Free throw percentage',
      'away': awayStats.free_throw_percentage + '%',
      'home': homeStats.free_throw_percentage + '%',
      'favored': 'higher',
    },
  ];

  const specialRows = [
    {
      'name': 'ORB',
      'title': 'Offensive rebounds per game',
      'away': awayStats.offensive_rebounds,
      'home': homeStats.offensive_rebounds,
      'favored': 'higher',
    },
    {
      'name': 'DRB',
      'title': 'Defensive rebounds per game',
      'away': awayStats.defensive_rebounds,
      'home': homeStats.defensive_rebounds,
      'favored': 'higher',
    },
    {
      'name': 'AST',
      'title': 'Assists per game',
      'away': awayStats.assists,
      'home': homeStats.assists,
      'favored': 'higher',
    },
    {
      'name': 'STL',
      'title': 'Steals per game',
      'away': awayStats.steals,
      'home': homeStats.steals,
      'favored': 'higher',
    },
    {
      'name': 'BLK',
      'title': 'Blocks per game',
      'away': awayStats.blocks,
      'home': homeStats.blocks,
      'favored': 'higher',
    },
    {
      'name': 'TOV',
      'title': 'Turnovers per game',
      'away': awayStats.turnovers,
      'home': homeStats.turnovers,
      'favored': 'lower',
    },
    {
      'name': 'PF',
      'title': 'Turnovers per game',
      'away': awayStats.fouls,
      'home': homeStats.fouls,
      'favored': 'lower',
    },
  ];

  const opponentRows = [
    {
      'name': 'Opp. FG',
      'title': 'Oppenent field goals per game',
      'away': awayStats.opponent_field_goal,
      'home': homeStats.opponent_field_goal,
      // 'favored': 'higher',
    },
    {
      'name': 'Opp. FGA',
      'title': 'Oppenent field goal attempts per game',
      'away': awayStats.opponent_field_goal_attempts,
      'home': homeStats.opponent_field_goal_attempts,
      // 'favored': 'higher',
    },
    {
      'name': 'Opp. FG%',
      'title': 'Oppenent field goal percentage',
      'away': awayStats.opponent_field_goal_percentage + '%',
      'home': homeStats.opponent_field_goal_percentage + '%',
      // 'favored': 'higher',
    },
  ];


  const getTextColor = (row, base) => {
    if (row.favored === 'lower') {
      if (+row.away <= +row.home) {
        return base === 'away' ? theme.palette.success.main : theme.palette.error.main;
      }
      if (+row.away > +row.home) {
        return base === 'home' ? theme.palette.success.main : theme.palette.error.main;
      }
    }

    if (row.favored === 'higher') {
      if (+row.away >= +row.home) {
        return base === 'away' ? theme.palette.success.main : theme.palette.error.main;
      }
      if (+row.away < +row.home) {
        return base === 'home' ? theme.palette.success.main : theme.palette.error.main;
      }
    }

    return 'inherit';
  };

  return (
    <div style = {{'padding': 20}}>
      <Typography variant = 'h5'>Stats Matchup</Typography>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="overview table">
          <TableHead>
            <TableRow>
              <TableCell>Overview</TableCell>
              <TableCell>{CBB.getTeamName('away')}</TableCell>
              <TableCell>{CBB.getTeamName('home')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {overviewRows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.name}</TableCell>
                <TableCell sx = {{'color': getTextColor(row, 'away')}}>{row.away}</TableCell>
                <TableCell sx = {{'color': getTextColor(row, 'home')}}>{row.home}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableHead>
            <TableRow>
              <TableCell>Offense</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offenseRows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.name}</TableCell>
                <TableCell sx = {{'color': getTextColor(row, 'away')}}>{row.away}</TableCell>
                <TableCell sx = {{'color': getTextColor(row, 'home')}}>{row.home}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableHead>
            <TableRow>
              <TableCell>Special</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specialRows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.name}</TableCell>
                <TableCell sx = {{'color': getTextColor(row, 'away')}}>{row.away}</TableCell>
                <TableCell sx = {{'color': getTextColor(row, 'home')}}>{row.home}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableHead>
            <TableRow>
              <TableCell>Opponent</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {opponentRows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.name}</TableCell>
                <TableCell sx = {{'color': getTextColor(row, 'away')}}>{row.away}</TableCell>
                <TableCell sx = {{'color': getTextColor(row, 'home')}}>{row.home}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Matchup;