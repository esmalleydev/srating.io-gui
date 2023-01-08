import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
// import '../../css/table.css';

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

// TODO Have a Chip to toggle between team totals and player totals;

const Stats = (props) => {
  const self = this;
  

  const team = props.team;

  const stats = props.stats || {};

  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef(null);

  const game = props.game;

  const CBB = new HelperCBB({
    'cbb_game': game,
  });

  const overviewRows = [
    // {
    //   'name': 'Record',
    //   'value': stats.wins + '-' + stats.losses,
    // },
    // {
    //   'name': 'Composite rank',
    //   'value': (team.ranking && team.ranking.composite_rank) || '-',
    // },
    // {
    //   'name': 'Elo',
    //   'value': stats.elo,
    // },
    // {
    //   'name': 'AP',
    //   'value': (team.ranking && team.ranking.ap_rank) || '-',
    // },
    // {
    //   'name': 'KP',
    //   'value': (team.ranking && team.ranking.kenpom_rank) || '-',
    // },
    // {
    //   'name': 'SRS',
    //   'value': (team.ranking && team.ranking.srs_rank) || '-',
    // },
    {
      'name': 'Streak',
      'value': (stats.streak < 0 ? 'L' : 'W') + Math.abs(stats.streak),
    },
    {
      'name': 'Avg. PTS Offense',
      'value': stats.points,
    },
    {
      'name': 'Avg. PTS Defense',
      'value': stats.opponent_points,
    },
  ];

  const offenseRows = [
    {
      'name': 'FG',
      'title': 'Field goals per game',
      'value': stats.field_goal,
    },
    {
      'name': 'FGA',
      'title': 'Field goal attempts per game',
      'value': stats.field_goal_attempts,
    },
    {
      'name': 'FG%',
      'title': 'Field goal percentage',
      'value': stats.field_goal_percentage + '%',
    },
    {
      'name': '2P',
      'title': '2 point field goals per game',
      'value': stats.two_point_field_goal,
    },
    {
      'name': '2PA',
      'title': '2 point field goal attempts per game',
      'value': stats.two_point_field_goal_attempts,
    },
    {
      'name': '2P%',
      'title': '2 point field goal percentage',
      'value': stats.two_point_field_goal_percentage + '%',
    },
    {
      'name': '3P',
      'title': '3 point field goals per game',
      'value': stats.three_point_field_goal,
    },
    {
      'name': '3PA',
      'title': '3 point field goal attempts per game',
      'value': stats.three_point_field_goal_attempts,
    },
    {
      'name': '3P%',
      'title': '3 point field goal percentage',
      'value': stats.three_point_field_goal_percentage + '%',
    },
    {
      'name': 'FT',
      'title': 'Free throws per game',
      'value': stats.free_throws,
    },
    {
      'name': 'FTA',
      'title': 'Free throw attempts per game',
      'value': stats.free_throw_attempts,
    },
    {
      'name': 'FT%',
      'title': 'Free throw percentage',
      'value': stats.free_throw_percentage + '%',
    },
  ];

  const specialRows = [
    {
      'name': 'ORB',
      'title': 'Offensive rebounds per game',
      'value': stats.offensive_rebounds,
    },
    {
      'name': 'DRB',
      'title': 'Defensive rebounds per game',
      'value': stats.defensive_rebounds,
    },
    {
      'name': 'AST',
      'title': 'Assists per game',
      'value': stats.assists,
    },
    {
      'name': 'STL',
      'title': 'Steals per game',
      'value': stats.steals,
    },
    {
      'name': 'BLK',
      'title': 'Blocks per game',
      'value': stats.blocks,
    },
    {
      'name': 'TOV',
      'title': 'Turnovers per game',
      'value': stats.turnovers,
    },
    {
      'name': 'PF',
      'title': 'Turnovers per game',
      'value': stats.fouls,
    },
  ];

  const opponentRows = [
    {
      'name': 'Opp. FG',
      'title': 'Oppenent field goals per game',
      'value': stats.opponent_field_goal,
    },
    {
      'name': 'Opp. FGA',
      'title': 'Oppenent field goal attempts per game',
      'value': stats.opponent_field_goal_attempts,
    },
    {
      'name': 'Opp. FG%',
      'title': 'Oppenent field goal percentage',
      'value': stats.opponent_field_goal_percentage + '%',
    },
  ];


  return (
    <div>
      <Typography ref = {scrollRef} variant = 'h5'>Team statistics</Typography>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="overview table">
          <TableBody>
            {overviewRows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableHead>
            <TableRow>
              <TableCell>Offense</TableCell>
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
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableHead>
            <TableRow>
              <TableCell>Special</TableCell>
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
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableHead>
            <TableRow>
              <TableCell>Opponent</TableCell>
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
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Stats;