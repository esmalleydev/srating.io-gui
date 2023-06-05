import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { styled, useTheme } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';

import moment from 'moment';

import HelperCBB from '../../../helpers/CBB';

import Api from './../../../Api.jsx';
const api = new Api();

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover td': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
  },
  '&:hover': {
    cursor: 'pointer',
  }
}));


const GameLog = (props) => {
  const self = this;

  const theme = useTheme();
  const router = useRouter();

  const season = props.season;
  const player = props.player;
  const player_team_season = props.player_team_season;
  const team = props.team;


  const [requestedLog, setRequestedLog] = useState(false);
  const [data, setData] = useState(null);


  if (!requestedLog) {
    setRequestedLog(true);
    api.Request({
      'class': 'cbb_player_boxscore',
      'function': 'getGameLogs',
      'arguments': {
        'player_id': player_team_season.player_id,
        'season': player_team_season.season,
      },
    }).then((response) => {
      setData(response || {});
    }).catch((e) => {
      setData({});
    });
  }


  const handleClick = (cbb_game_id) => {
    router.push('/cbb/games/' + cbb_game_id);
  };


  const headCells = [
    {
      'id': 'game',
      'numeric': false,
      'label': 'Game',
      'tooltip': 'Date / Game',
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

  const rows = Object.values(data || {}).sort(function(a, b) {
    return a.cbb_game.start_datetime > b.cbb_game.start_datetime ? -1 : 1;
  });

  return (
    <div style = {{'padding': 20}}>
      {
      data === null ?
        <Paper elevation = {3} style = {{'padding': 10}}>
            <div>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
            </div>
          </Paper>
        : ''
      }
      {
        data !== null ?
        <TableContainer component={Paper}>
          <Table size="small" aria-label="game log table">
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                  key={headCell.id}
                  align={'center'}
                  >
                  {headCell.label}     
                  </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const won = (row.cbb_game.home_score > row.cbb_game.away_score && row.cbb_game.home_team_id === player_team_season.team_id) || (row.cbb_game.home_score < row.cbb_game.away_score && row.cbb_game.away_team_id === player_team_season.team_id);

                const CBB = new HelperCBB({
                  'cbb_game': row.cbb_game,
                });

                let opponent = null;
                if (row.cbb_game.home_team_id !== player_team_season.team_id) {
                  opponent = CBB.getTeamNameShort('home');
                } else {
                  opponent = CBB.getTeamNameShort('away');
                }

                const spanStyle = {
                  'color': theme.palette.mode === 'light' ? theme.palette.error.main : theme.palette.error.dark,
                };

                if (won) {
                  spanStyle.color = theme.palette.mode === 'light' ? theme.palette.success.main : theme.palette.success.dark;
                }


                return (
                  <StyledTableRow key={row.cbb_player_boxscore_id} onClick={() => {handleClick(row.cbb_game_id)}}>
                    <TableCell sx = {{'textAlign': 'center'}}>
                      <div style = {{'display': 'flex', 'flexDirection': 'column'}}>
                        <div>
                          {moment(row.cbb_game.start_date.split('T')[0] + ' 12:00:00').format('MMM Do')}
                        </div>
                        <div style = {{'color': theme.palette.grey[500]}}>
                          {row.cbb_game.home_team_id !== player_team_season.team_id ? '@ ' : ''}{opponent} <span style = {spanStyle}>{CBB.isFinal() ? (won ? 'W' : 'L') : CBB.getTime()}</span> {row.cbb_game.home_score + '-' + row.cbb_game.away_score}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx = {{'textAlign': 'center'}}>{row.minutes_played}</TableCell>
                    <TableCell sx = {{'textAlign': 'center'}}>{row.points}</TableCell>

                    <TableCell sx = {{'textAlign': 'center'}}>
                      <div style = {{'display': 'flex', 'flexDirection': 'column'}}>
                        <div>
                          {row.field_goal}-{row.field_goal_attempts}
                        </div>
                        <div style = {{'color': theme.palette.grey[500]}}>
                          {row.field_goal_percentage}%
                        </div>
                      </div>
                    </TableCell>

                    <TableCell sx = {{'textAlign': 'center'}}>
                      <div style = {{'display': 'flex', 'flexDirection': 'column'}}>
                        <div>
                          {row.two_point_field_goal}-{row.two_point_field_goal_attempts}
                        </div>
                        <div style = {{'color': theme.palette.grey[500]}}>
                          {row.two_point_field_goal_percentage}%
                        </div>
                      </div>
                    </TableCell>

                    <TableCell sx = {{'textAlign': 'center'}}>
                      <div style = {{'display': 'flex', 'flexDirection': 'column'}}>
                        <div>
                          {row.three_point_field_goal}-{row.three_point_field_goal_attempts}
                        </div>
                        <div style = {{'color': theme.palette.grey[500]}}>
                          {row.three_point_field_goal_percentage}%
                        </div>
                      </div>
                    </TableCell>

                    <TableCell sx = {{'textAlign': 'center'}}>
                      <div style = {{'display': 'flex', 'flexDirection': 'column'}}>
                        <div>
                          {row.free_throws}-{row.free_throw_attempts}
                        </div>
                        <div style = {{'color': theme.palette.grey[500]}}>
                          {row.free_throw_percentage}%
                        </div>
                      </div>
                    </TableCell>

                    <TableCell sx = {{'textAlign': 'center'}}>{row.offensive_rebounds}</TableCell>
                    <TableCell sx = {{'textAlign': 'center'}}>{row.defensive_rebounds}</TableCell>
                    <TableCell sx = {{'textAlign': 'center'}}>{row.assists}</TableCell>
                    <TableCell sx = {{'textAlign': 'center'}}>{row.steals}</TableCell>
                    <TableCell sx = {{'textAlign': 'center'}}>{row.blocks}</TableCell>
                    <TableCell sx = {{'textAlign': 'center'}}>{row.turnovers}</TableCell>
                    <TableCell sx = {{'textAlign': 'center'}}>{row.fouls}</TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        : ''
      }
    </div>
  );
}

export default GameLog;
