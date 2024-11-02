'use client';
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
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

import HelperGame from '../../../helpers/Game';

import { useClientAPI } from '@/components/clientAPI';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover td': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
  },
  '&:hover': {
    cursor: 'pointer',
  }
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  'backgroundColor': theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900],
}));


const GameLog = (props) => {
  const self = this;

  const theme = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();

  // const season = props.season;
  // const player = props.player;
  const player_team_season = props.player_team_season;
  // const team = props.team;


  const [requestedLog, setRequestedLog] = useState(false);
  const [data, setData] = useState(null);


  if (!requestedLog) {
    setRequestedLog(true);
    useClientAPI({
      'class': 'player_boxscore',
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


  const handleClick = (game_id) => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push('/cbb/games/' + game_id);
    });
  };


  const headCells = [
    {
      'id': 'game',
      'numeric': false,
      'label': 'Game',
      'tooltip': 'Date / Game',
      'sticky': true,
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
    return a.game.start_datetime > b.game.start_datetime ? -1 : 1;
  });

  let b = 0;

  return (
    <div style = {{'paddingTop': 20}}>
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
                {headCells.map((headCell) => {
                    const tdStyle = {
                      'padding': '4px 5px',
                    };

                    let align = 'center';

                    if (headCell.sticky) {
                      align = 'left';
                      tdStyle.position = 'sticky';
                      tdStyle.left = 0;
                      tdStyle.zIndex = 3;
                    } else {
                      tdStyle.whiteSpace = 'nowrap';
                    }


                  return (<StyledTableHeadCell key={headCell.id} align={align} sx = {tdStyle}>{headCell.label}</StyledTableHeadCell>);
                  })}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                b++;
                const won = (row.game.home_score > row.game.away_score && row.game.home_team_id === player_team_season.team_id) || (row.game.home_score < row.game.away_score && row.game.away_team_id === player_team_season.team_id);

                const Game = new HelperGame({
                  'game': row.game,
                });

                let opponent = null;
                if (row.game.home_team_id !== player_team_season.team_id) {
                  opponent = Game.getTeamNameShort('home');
                } else {
                  opponent = Game.getTeamNameShort('away');
                }

                const spanStyle = {
                  'color': theme.palette.mode === 'light' ? theme.palette.error.main : theme.palette.error.dark,
                };

                if (won) {
                  spanStyle.color = theme.palette.mode === 'light' ? theme.palette.success.main : theme.palette.success.dark;
                }

                const tdStyle = {
                  'padding': '4px 7px',
                  'backgroundColor': theme.palette.mode === 'light' ? (b % 2 === 0 ? theme.palette.grey[200] : theme.palette.grey[300]) : (b % 2 === 0 ? theme.palette.grey[800] : theme.palette.grey[900]),
                  'textAlign': 'center',
                };

                // todo add tool tips?
                return (
                  <StyledTableRow key={row.player_boxscore_id} onClick={() => {handleClick(row.game_id)}}>
                    <TableCell sx = {Object.assign({}, tdStyle, {'textAlign': 'left', 'position': 'sticky', 'left': 0, 'minWidth': 125, 'maxWidth': 125})}>
                      <div style = {{'display': 'flex', 'flexDirection': 'column'}}>
                        <div>
                          {moment(row.game.start_date.split('T')[0] + ' 12:00:00').format('MMM Do')}
                        </div>
                        <div style = {{'color': theme.palette.grey[500]}}>
                          {row.game.home_team_id !== player_team_season.team_id ? '@ ' : ''}{opponent} <span style = {spanStyle}>{Game.isFinal() ? (won ? 'W' : 'L') : Game.getTime()}</span> {row.game.home_score + '-' + row.game.away_score}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx = {tdStyle}>{row.minutes_played}</TableCell>
                    <TableCell sx = {tdStyle}>{row.points}</TableCell>

                    <TableCell sx = {tdStyle}>
                      <div style = {{'display': 'flex', 'flexDirection': 'column'}}>
                        <div>
                          {row.field_goal}-{row.field_goal_attempts}
                        </div>
                        <div style = {{'color': theme.palette.grey[500]}}>
                          {row.field_goal_percentage}%
                        </div>
                      </div>
                    </TableCell>

                    <TableCell sx = {tdStyle}>
                      <div style = {{'display': 'flex', 'flexDirection': 'column'}}>
                        <div>
                          {row.two_point_field_goal}-{row.two_point_field_goal_attempts}
                        </div>
                        <div style = {{'color': theme.palette.grey[500]}}>
                          {row.two_point_field_goal_percentage}%
                        </div>
                      </div>
                    </TableCell>

                    <TableCell sx = {tdStyle}>
                      <div style = {{'display': 'flex', 'flexDirection': 'column'}}>
                        <div>
                          {row.three_point_field_goal}-{row.three_point_field_goal_attempts}
                        </div>
                        <div style = {{'color': theme.palette.grey[500]}}>
                          {row.three_point_field_goal_percentage}%
                        </div>
                      </div>
                    </TableCell>

                    <TableCell sx = {tdStyle}>
                      <div style = {{'display': 'flex', 'flexDirection': 'column'}}>
                        <div>
                          {row.free_throws}-{row.free_throw_attempts}
                        </div>
                        <div style = {{'color': theme.palette.grey[500]}}>
                          {row.free_throw_percentage}%
                        </div>
                      </div>
                    </TableCell>

                    <TableCell sx = {tdStyle}>{row.offensive_rebounds}</TableCell>
                    <TableCell sx = {tdStyle}>{row.defensive_rebounds}</TableCell>
                    <TableCell sx = {tdStyle}>{row.assists}</TableCell>
                    <TableCell sx = {tdStyle}>{row.steals}</TableCell>
                    <TableCell sx = {tdStyle}>{row.blocks}</TableCell>
                    <TableCell sx = {tdStyle}>{row.turnovers}</TableCell>
                    <TableCell sx = {tdStyle}>{row.fouls}</TableCell>
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
