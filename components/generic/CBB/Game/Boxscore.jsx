import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { styled, useTheme } from '@mui/material/styles';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from "@mui/material/Box";

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
import CompareStatistic from '../../CompareStatistic';
import TeamSubHeader from './TeamSubHeader';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover td': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
  },
  '&:hover': {
    cursor: 'pointer',
  }
}));


const Boxscore = (props) => {
  const self = this;

  const theme = useTheme();
  const router = useRouter();

  const [boxscoreSide, setBoxscoreSide] = useState('home');

  const game = props.game;

  const awayBoxscores = (game.player_boxscore && game.player_boxscore[game.away_team_id]) || [];
  const homeBoxscores = (game.player_boxscore && game.player_boxscore[game.home_team_id]) || [];

  const awayTotalBoxscore = (game.boxscores && game.boxscores[game.away_team_id]) || {};
  const homeTotalBoxscore = (game.boxscores && game.boxscores[game.home_team_id]) || {};

  const hasBoxscoreData = ('points' in awayTotalBoxscore) && ('points' in homeTotalBoxscore);

  const boxscore = boxscoreSide === 'home' ? homeBoxscores : awayBoxscores;
  const boxscoreTotal = boxscoreSide === 'home' ? homeTotalBoxscore : awayTotalBoxscore;

  const handleClick = (player_id) => {
    router.push('/cbb/player/' + player_id);
  };

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


  const compareRows = [
    {
      'name': 'PTS',
      'title': 'PTS',
      'tooltip': 'Points',
      'away': awayTotalBoxscore.points,
      'home': homeTotalBoxscore.points,
      'awayCompareValue': awayTotalBoxscore.points,
      'homeCompareValue': homeTotalBoxscore.points,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FG',
      'title': 'FG',
      'tooltip': 'Field goals per game',
      'away': awayTotalBoxscore.field_goal,
      'home': homeTotalBoxscore.field_goal,
      'awayCompareValue': awayTotalBoxscore.field_goal,
      'homeCompareValue': homeTotalBoxscore.field_goal,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FGA',
      'title': 'FGA',
      'tooltip': 'Field goal attempts per game',
      'away': awayTotalBoxscore.field_goal_attempts,
      'home': homeTotalBoxscore.field_goal_attempts,
      'awayCompareValue': awayTotalBoxscore.field_goal_attempts,
      'homeCompareValue': homeTotalBoxscore.field_goal_attempts,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FG%',
      'title': 'FG%',
      'tooltip': 'Field goal percentage',
      'away': awayTotalBoxscore.field_goal_percentage + '%',
      'home': homeTotalBoxscore.field_goal_percentage + '%',
      'awayCompareValue': awayTotalBoxscore.field_goal_percentage,
      'homeCompareValue': homeTotalBoxscore.field_goal_percentage,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '2P',
      'title': '2P',
      'tooltip': '2 point field goals per game',
      'away': awayTotalBoxscore.two_point_field_goal,
      'home': homeTotalBoxscore.two_point_field_goal,
      'awayCompareValue': awayTotalBoxscore.two_point_field_goal,
      'homeCompareValue': homeTotalBoxscore.two_point_field_goal,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '2PA',
      'title': '2PA',
      'tooltip': '2 point field goal attempts per game',
      'away': awayTotalBoxscore.two_point_field_goal_attempts,
      'home': homeTotalBoxscore.two_point_field_goal_attempts,
      'awayCompareValue': awayTotalBoxscore.two_point_field_goal_attempts,
      'homeCompareValue': homeTotalBoxscore.two_point_field_goal_attempts,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '2P%',
      'title': '2P%',
      'tooltip': '2 point field goal percentage',
      'away': awayTotalBoxscore.two_point_field_goal_percentage + '%',
      'home': homeTotalBoxscore.two_point_field_goal_percentage + '%',
      'awayCompareValue': awayTotalBoxscore.two_point_field_goal_percentage,
      'homeCompareValue': homeTotalBoxscore.two_point_field_goal_percentage,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '3P',
      'title': '3P',
      'tooltip': '3 point field goals per game',
      'away': awayTotalBoxscore.three_point_field_goal,
      'home': homeTotalBoxscore.three_point_field_goal,
      'awayCompareValue': awayTotalBoxscore.three_point_field_goal,
      'homeCompareValue': homeTotalBoxscore.three_point_field_goal,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '3PA',
      'title': '3PA',
      'tooltip': '3 point field goal attempts per game',
      'away': awayTotalBoxscore.three_point_field_goal_attempts,
      'home': homeTotalBoxscore.three_point_field_goal_attempts,
      'awayCompareValue': awayTotalBoxscore.three_point_field_goal_attempts,
      'homeCompareValue': homeTotalBoxscore.three_point_field_goal_attempts,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '3P%',
      'title': '3P%',
      'tooltip': '3 point field goal percentage',
      'away': awayTotalBoxscore.three_point_field_goal_percentage + '%',
      'home': homeTotalBoxscore.three_point_field_goal_percentage + '%',
      'awayCompareValue': awayTotalBoxscore.three_point_field_goal_percentage,
      'homeCompareValue': homeTotalBoxscore.three_point_field_goal_percentage,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FT',
      'title': 'FT',
      'tooltip': 'Free throws per game',
      'away': awayTotalBoxscore.free_throws,
      'home': homeTotalBoxscore.free_throws,
      'awayCompareValue': awayTotalBoxscore.free_throws,
      'homeCompareValue': homeTotalBoxscore.free_throws,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FTA',
      'title': 'FTA',
      'tooltip': 'Free throw attempts per game',
      'away': awayTotalBoxscore.free_throw_attempts,
      'home': homeTotalBoxscore.free_throw_attempts,
      'awayCompareValue': awayTotalBoxscore.free_throw_attempts,
      'homeCompareValue': homeTotalBoxscore.free_throw_attempts,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FT%',
      'title': 'FT%',
      'tooltip': 'Free throw percentage',
      'away': awayTotalBoxscore.free_throw_percentage + '%',
      'home': homeTotalBoxscore.free_throw_percentage + '%',
      'awayCompareValue': awayTotalBoxscore.free_throw_percentage,
      'homeCompareValue': homeTotalBoxscore.free_throw_percentage,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'ORB',
      'title': 'ORB',
      'tooltip': 'Offensive rebounds',
      'away': awayTotalBoxscore.offensive_rebounds,
      'home': homeTotalBoxscore.offensive_rebounds,
      'awayCompareValue': awayTotalBoxscore.offensive_rebounds,
      'homeCompareValue': homeTotalBoxscore.offensive_rebounds,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'DRB',
      'title': 'DRB',
      'tooltip': 'Defensive rebounds',
      'away': awayTotalBoxscore.defensive_rebounds,
      'home': homeTotalBoxscore.defensive_rebounds,
      'awayCompareValue': awayTotalBoxscore.defensive_rebounds,
      'homeCompareValue': homeTotalBoxscore.defensive_rebounds,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'AST',
      'title': 'AST',
      'tooltip': 'Assists',
      'away': awayTotalBoxscore.assists,
      'home': homeTotalBoxscore.assists,
      'awayCompareValue': awayTotalBoxscore.assists,
      'homeCompareValue': homeTotalBoxscore.assists,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'STL',
      'title': 'STL',
      'tooltip': 'Steals',
      'away': awayTotalBoxscore.steals,
      'home': homeTotalBoxscore.steals,
      'awayCompareValue': awayTotalBoxscore.steals,
      'homeCompareValue': homeTotalBoxscore.steals,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'BLK',
      'title': 'BLK',
      'tooltip': 'Blocks',
      'away': awayTotalBoxscore.blocks,
      'home': homeTotalBoxscore.blocks,
      'awayCompareValue': awayTotalBoxscore.blocks,
      'homeCompareValue': homeTotalBoxscore.blocks,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'TOV',
      'title': 'TOV',
      'tooltip': 'Turnovers',
      'away': awayTotalBoxscore.turnovers,
      'home': homeTotalBoxscore.turnovers,
      'awayCompareValue': awayTotalBoxscore.turnovers,
      'homeCompareValue': homeTotalBoxscore.turnovers,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'PF',
      'title': 'PF',
      'tooltip': 'Fouls',
      'away': awayTotalBoxscore.fouls,
      'home': homeTotalBoxscore.fouls,
      'awayCompareValue': awayTotalBoxscore.fouls,
      'homeCompareValue': homeTotalBoxscore.fouls,
      'favored': 'lower',
      'showDifference': true,
    },
  ];


  return (
    <div>
      <div>
        <TeamSubHeader game = {game} />
        <div style = {{'padding': 20}}>
          {hasBoxscoreData ? <CompareStatistic paper = {true} rows = {compareRows} /> : <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'h5'>No boxscore data yet...</Typography>}
        </div>
      </div>
      <div style = {{'padding': 20}}>
        <Typography style = {{'margin': '10px 0px'}} variant = 'body1'>Player boxscore</Typography>
        <Chip sx = {{'margin': '0px 10px 10px 10px'}} variant = {boxscoreSide === 'home' ? 'filled' : 'outlined'} color = {boxscoreSide === 'home' ? 'success' : 'primary'} onClick= {() => {setBoxscoreSide('home');}} label = {CBB.getTeamName('home')} />
        <Chip sx = {{'margin': '0px 10px 10px 10px'}} variant = {boxscoreSide === 'away' ? 'filled' : 'outlined'} color = {boxscoreSide === 'away' ? 'success' : 'primary'} onClick= {() => {setBoxscoreSide('away');}} label = {CBB.getTeamName('away')} />
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
                // Only have minutes played from post game boxscore
                if (!row.minutes_played && +row.final === 1) {
                  return;
                }

                if (
                  !row.field_goal_attempts &&
                  !row.free_throw_attempts &&
                  !row.total_rebounds &&
                  !row.assists &&
                  !row.steals &&
                  !row.blocks &&
                  !row.turnovers &&
                  !row.fouls &&
                  !row.points
                ) {
                  return;
                }

                let player_name = row.first_name + ' ' + row.last_name;

                if (row.player_id && game.players && row.player_id in game.players) {
                  const player = game.players[row.player_id];
                  player_name = player.first_name + ' ' + player.last_name;
                }


                return (
                  <StyledTableRow key={row.cbb_player_boxscore_id} onClick={() => {handleClick(row.player_id)}}>
                    <TableCell>{player_name}</TableCell>
                    <TableCell>{row.minutes_played}</TableCell>
                    <TableCell>{row.points}</TableCell>

                    <TableCell>
                      <div style = {{'display': 'flex', 'flexDirection': 'column'}}>
                        <div>
                          {row.field_goal}-{row.field_goal_attempts}
                        </div>
                        <div style = {{'color': theme.palette.grey[500]}}>
                          {row.field_goal_percentage}%
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div style = {{'display': 'flex', 'flexDirection': 'column'}}>
                        <div>
                          {row.two_point_field_goal}-{row.two_point_field_goal_attempts}
                        </div>
                        <div style = {{'color': theme.palette.grey[500]}}>
                          {row.two_point_field_goal_percentage}%
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div style = {{'display': 'flex', 'flexDirection': 'column'}}>
                        <div>
                          {row.three_point_field_goal}-{row.three_point_field_goal_attempts}
                        </div>
                        <div style = {{'color': theme.palette.grey[500]}}>
                          {row.three_point_field_goal_percentage}%
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div style = {{'display': 'flex', 'flexDirection': 'column'}}>
                        <div>
                          {row.free_throws}-{row.free_throw_attempts}
                        </div>
                        <div style = {{'color': theme.palette.grey[500]}}>
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
                  </StyledTableRow>
                );
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
    </div>
  );
}

export default Boxscore;