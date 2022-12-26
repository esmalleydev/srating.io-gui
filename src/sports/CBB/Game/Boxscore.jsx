import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import HelperCBB from '../../../helpers/CBB';

const Boxscore = (props) => {
  const self = this;
  
  // console.log(props);


  const theme = useTheme();

  const game = props.game;

  const awayBoxscores = (game.player_boxscore && game.player_boxscore[game.away_team_id]) || [];
  const homeBoxscores = (game.player_boxscore && game.player_boxscore[game.home_team_id]) || [];

  const awayTotalBoxscore = (game.boxscores && game.boxscores[game.away_team_id]) || {};
  const homeTotalBoxscore = (game.boxscores && game.boxscores[game.home_team_id]) || {};

  const CBB = new HelperCBB({
    'cbb_game': game,
  });


  const headCells = [
    {
      'id': 'player_name',
      'numeric': false,
      'label': 'Player',
      'tooltip': 'Player name',
    },
    {
      'id': 'MP',
      'numeric': false,
      'label': 'MP',
      'tooltip': 'Minutes played',
    },
    {
      'id': 'FG',
      'label': 'FG',
      'tooltip': 'Field goals',
    },
    {
      'id': '2P',
      'label': '2P',
      'tooltip': '2 point field goals',
    },
    {
      'id': '3P',
      'label': '3P',
      'tooltip': '3 point field goals',
    },
    {
      'id': 'FT',
      'label': 'FT',
      'tooltip': 'Free throws',
    },
    {
      'id': 'ORB',
      'label': 'ORB',
      'tooltip': 'Offensive rebounds',
    },
    {
      'id': 'DRB',
      'label': 'DRB',
      'tooltip': 'Defensive rebounds',
    },
    {
      'id': 'AST',
      'label': 'AST',
      'tooltip': 'Assists',
    },
    {
      'id': 'STL',
      'label': 'STL',
      'tooltip': 'Steals',
    },
    {
      'id': 'BLK',
      'label': 'BLK',
      'tooltip': 'Blocks',
    },
    {
      'id': 'TOV',
      'label': 'TOV',
      'tooltip': 'Turnovers',
    },
    {
      'id': 'PF',
      'label': 'PF',
      'title': 'Personal fouls',
    },
  ];



  return (
    <div style = {{'padding': 20}}>
      <Typography variant = 'h5' style = {{'margin': '10px 0px'}}>{CBB.getTeamName('away')}</Typography>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="away team boxscore table">
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
            {awayBoxscores.map((row) => (
              <TableRow
                key={row.cbb_player_boxscore_id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.first_name} {row.last_name}</TableCell>
                <TableCell>{row.minutes_played}</TableCell>
                <TableCell>{row.field_goal}-{row.field_goal_attempts} {row.field_goal_percentage}%</TableCell>
                <TableCell>{row.two_point_field_goal}-{row.two_point_field_goal_attempts} {row.two_point_field_goal_percentage}%</TableCell>
                <TableCell>{row.three_point_field_goal}-{row.three_point_field_goal_attempts} {row.three_point_field_goal_percentage}%</TableCell>
                <TableCell>{row.free_throws}-{row.free_throw_attempts} {row.free_throw_percentage}%</TableCell>
                <TableCell>{row.offensive_rebounds}</TableCell>
                <TableCell>{row.defensive_rebounds}</TableCell>
                <TableCell>{row.assists}</TableCell>
                <TableCell>{row.steals}</TableCell>
                <TableCell>{row.blocks}</TableCell>
                <TableCell>{row.turnovers}</TableCell>
                <TableCell>{row.fouls}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{awayTotalBoxscore.field_goal}-{awayTotalBoxscore.field_goal_attempts} {awayTotalBoxscore.field_goal_percentage}%</TableCell>
              <TableCell>{awayTotalBoxscore.two_point_field_goal}-{awayTotalBoxscore.two_point_field_goal_attempts} {awayTotalBoxscore.two_point_field_goal_percentage}%</TableCell>
              <TableCell>{awayTotalBoxscore.three_point_field_goal}-{awayTotalBoxscore.three_point_field_goal_attempts} {awayTotalBoxscore.three_point_field_goal_percentage}%</TableCell>
              <TableCell>{awayTotalBoxscore.free_throws}-{awayTotalBoxscore.free_throw_attempts} {awayTotalBoxscore.free_throw_percentage}%</TableCell>
              <TableCell>{awayTotalBoxscore.offensive_rebounds}</TableCell>
              <TableCell>{awayTotalBoxscore.defensive_rebounds}</TableCell>
              <TableCell>{awayTotalBoxscore.assists}</TableCell>
              <TableCell>{awayTotalBoxscore.steals}</TableCell>
              <TableCell>{awayTotalBoxscore.blocks}</TableCell>
              <TableCell>{awayTotalBoxscore.turnovers}</TableCell>
              <TableCell>{awayTotalBoxscore.fouls}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Typography variant = 'h5' style = {{'margin': '10px 0px'}}>{CBB.getTeamName('home')}</Typography>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="home team boxscore table">
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
            {homeBoxscores.map((row) => (
              <TableRow
                key={row.cbb_player_boxscore_id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.first_name} {row.last_name}</TableCell>
                <TableCell>{row.minutes_played}</TableCell>
                <TableCell>{row.field_goal}-{row.field_goal_attempts} {row.field_goal_percentage}%</TableCell>
                <TableCell>{row.two_point_field_goal}-{row.two_point_field_goal_attempts} {row.two_point_field_goal_percentage}%</TableCell>
                <TableCell>{row.three_point_field_goal}-{row.three_point_field_goal_attempts} {row.three_point_field_goal_percentage}%</TableCell>
                <TableCell>{row.free_throws}-{row.free_throw_attempts} {row.free_throw_percentage}%</TableCell>
                <TableCell>{row.offensive_rebounds}</TableCell>
                <TableCell>{row.defensive_rebounds}</TableCell>
                <TableCell>{row.assists}</TableCell>
                <TableCell>{row.steals}</TableCell>
                <TableCell>{row.blocks}</TableCell>
                <TableCell>{row.turnovers}</TableCell>
                <TableCell>{row.fouls}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{homeTotalBoxscore.field_goal}-{homeTotalBoxscore.field_goal_attempts} {homeTotalBoxscore.field_goal_percentage}%</TableCell>
              <TableCell>{homeTotalBoxscore.two_point_field_goal}-{homeTotalBoxscore.two_point_field_goal_attempts} {homeTotalBoxscore.two_point_field_goal_percentage}%</TableCell>
              <TableCell>{homeTotalBoxscore.three_point_field_goal}-{homeTotalBoxscore.three_point_field_goal_attempts} {homeTotalBoxscore.three_point_field_goal_percentage}%</TableCell>
              <TableCell>{homeTotalBoxscore.free_throws}-{homeTotalBoxscore.free_throw_attempts} {homeTotalBoxscore.free_throw_percentage}%</TableCell>
              <TableCell>{homeTotalBoxscore.offensive_rebounds}</TableCell>
              <TableCell>{homeTotalBoxscore.defensive_rebounds}</TableCell>
              <TableCell>{homeTotalBoxscore.assists}</TableCell>
              <TableCell>{homeTotalBoxscore.steals}</TableCell>
              <TableCell>{homeTotalBoxscore.blocks}</TableCell>
              <TableCell>{homeTotalBoxscore.turnovers}</TableCell>
              <TableCell>{homeTotalBoxscore.fouls}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Boxscore;