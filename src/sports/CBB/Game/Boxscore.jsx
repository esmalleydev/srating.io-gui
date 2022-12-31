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
import Chip from '@mui/material/Chip';

import HelperCBB from '../../../helpers/CBB';

const Boxscore = (props) => {
  const self = this;
  
  // console.log(props);


  const theme = useTheme();
  const [boxscoreSide, setBoxscoreSide] = useState('home');

  const game = props.game;

  const awayBoxscores = (game.player_boxscore && game.player_boxscore[game.away_team_id]) || [];
  const homeBoxscores = (game.player_boxscore && game.player_boxscore[game.home_team_id]) || [];

  const awayTotalBoxscore = (game.boxscores && game.boxscores[game.away_team_id]) || {};
  const homeTotalBoxscore = (game.boxscores && game.boxscores[game.home_team_id]) || {};

  const boxscore = boxscoreSide === 'home' ? homeBoxscores : awayBoxscores;
  const boxscoreTotal = boxscoreSide === 'home' ? homeTotalBoxscore : awayTotalBoxscore;

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
      'id': 'PTS',
      'numeric': false,
      'label': 'PTS',
      'tooltip': 'Points',
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
      <Chip sx = {{'margin': '0px 10px 5px 10px'}} variant = {boxscoreSide === 'home' ? 'filled' : 'outlined'} color = {boxscoreSide === 'home' ? 'success' : 'primary'} onClick= {() => {setBoxscoreSide('home');}} label = {CBB.getTeamName('home')} />
      <Chip sx = {{'margin': '0px 10px 5px 10px'}} variant = {boxscoreSide === 'away' ? 'filled' : 'outlined'} color = {boxscoreSide === 'away' ? 'success' : 'primary'} onClick= {() => {setBoxscoreSide('away');}} label = {CBB.getTeamName('away')} />
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
            {boxscore.map((row) => (
              <TableRow
                key={row.cbb_player_boxscore_id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.first_name} {row.last_name}</TableCell>
                <TableCell>{row.minutes_played}</TableCell>
                <TableCell>{row.points}</TableCell>
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
  );
}

export default Boxscore;