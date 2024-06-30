'use client';
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Box, SortDirection, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Paper, TableSortLabel, Tooltip, Typography, Chip } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';

import HelperTeam from '@/components/helpers/Team';
import { playerColumns } from '@/components/generic/CBB/columns';
import RankSpan from '@/components/generic/CBB/RankSpan';
import utilsSorter from  '@/components/utils/Sorter';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';

const Sorter = new utilsSorter();

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  // '&:last-child td, &:last-child th': {
  //   border: 0,
  // },
  '&:hover td': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
  },
  '&:hover': {
    cursor: 'pointer',
  }
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  'backgroundColor':  theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
}));

const Client = ({ teams }) => {
  const theme = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { width } = useWindowDimensions() as Dimensions;
  const breakPoint = 425;

  const [view, setView] = useState<string | null>('overview');
  const [order, setOrder] = useState<string>('asc');
  const [orderBy, setOrderBy] = useState<string>('minutes_per_game');

  const dispatch = useAppDispatch();
  const hideLowerBench = useAppSelector(state => state.compareReducer.hideLowerBench);
  const topPlayersOnly = useAppSelector(state => state.compareReducer.topPlayersOnly);

  const guards: string[] = [];
  const forwards: string[] = [];
  const centers: string[] = [];
  let topPlayers: string[] = [];
  const player_id_x_stats = {};
  const players = {};
  const team_id_x_stats = {};

  for (let team_id in teams) {
    const team = teams[team_id];

    if (!(team_id in team_id_x_stats)) {
      team_id_x_stats[team_id] = [];
    }

    if (team.playerStats && team.playerStats.players) {
      for (let player_id in  team.playerStats.players) {
        const player =  team.playerStats.players[player_id];

        if (player.position === 'F') {
          forwards.push(player_id);
        }
        if (player.position === 'C') {
          centers.push(player_id);
        }
        if (player.position === 'G') {
          guards.push(player_id);
        }

        players[player_id] = player;
      }
    }

    if (team.playerStats && team.playerStats.cbb_player_statistic_ranking) {
      for (let cbb_player_statistic_ranking_id in team.playerStats.cbb_player_statistic_ranking) {
        const row = team.playerStats.cbb_player_statistic_ranking[cbb_player_statistic_ranking_id];

        row.height = players[row.player_id].height;
        team_id_x_stats[team_id].push(row);
        player_id_x_stats[row.player_id] = row;
      }
    }
  }

  for (let team_id in team_id_x_stats) {
    team_id_x_stats[team_id].sort(function(a, b) {
      if (
        (!a.minutes_per_game && !b.minutes_per_game) ||
        (a.minutes_per_game === b.minutes_per_game)
      ) {
        return 0;
      }
      return a.minutes_per_game > b.minutes_per_game ? -1 : 1;
    });

    if (team_id_x_stats[team_id].length) {
      topPlayers = topPlayers.concat(team_id_x_stats[team_id].map((row) => row.player_id).slice(0, 6));
    }
  }

  const getColumns = () => {
    if (view === 'overview') {
      return ['player', 'team', 'height', 'minutes_per_game', 'points_per_game', 'player_efficiency_rating', 'efficiency_rating', 'offensive_rating', 'defensive_rating', 'effective_field_goal_percentage', 'true_shooting_percentage', 'usage_percentage'];
    } else if (view === 'offensive') {
      return ['player', 'team', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'assist_percentage', 'turnover_percentage'];
    } else if (view === 'defensive') {
      return ['player', 'team', 'offensive_rebound_percentage', 'defensive_rebound_percentage', 'steal_percentage', 'block_percentage'];
    }
    return [];
  };

  const handleClick = (player_id) => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push('/cbb/player/' + player_id);
    });
  };


  const headCells = playerColumns;

  
  const statDisplay = [
    {
      'label': 'Overview',
      'value': 'overview',
    },
    {
      'label': 'Offense',
      'value': 'offensive',
    },
    {
      'label': 'Defense',
      'value': 'defensive',
    },
  ];

  let statDisplayChips: React.JSX.Element[] = [];

  const handleView = (value) => {
    sessionStorage.setItem('CBB.COMPARE.PLAYER.VIEW', value);
    setView(value);
  }

  for (let i = 0; i < statDisplay.length; i++) {
    statDisplayChips.push(
      <Chip
        key = {statDisplay[i].value}
        sx = {{'margin': '5px 5px 10px 5px'}}
        variant = {view === statDisplay[i].value ? 'filled' : 'outlined'}
        color = {view === statDisplay[i].value ? 'success' : 'primary'}
        onClick = {() => {handleView(statDisplay[i].value);}}
        label = {statDisplay[i].label} 
      />
    );
  }


  const handleSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    sessionStorage.setItem('CBB.COMPARE.PLAYER.ORDER', (isAsc ? 'desc' : 'asc'));
    sessionStorage.setItem('CBB.COMPARE.PLAYER.ORDERBY', id);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };



  const getTable = (player_ids) => {
    let b = 0;

    // todo TS
    let rows: any = [];

    for (let i = 0; i < player_ids.length; i++) {
      if (player_ids[i] in player_id_x_stats) {
        const stats = player_id_x_stats[player_ids[i]]

        if (hideLowerBench && stats.minutes_per_game < 3) {
          continue;
        }

        rows.push(stats);
      }
    }

    const playerCellWidth = (width <= breakPoint) ? 85 : 100;
    const teamCellWidth = 50;

    const row_containers = rows.sort(Sorter.getComparator(order, orderBy, (headCells[orderBy] && headCells[orderBy].sort))).slice().map((row) => {
      let columns = getColumns();

      // const tdStyle = {
      //   'padding': '4px 5px',
      //   'backgroundColor': theme.palette.mode === 'light' ? (b % 2 === 0 ? theme.palette.grey[200] : theme.palette.grey[300]) : (b % 2 === 0 ? theme.palette.grey[800] : theme.palette.grey[900]),
      // };

      b++;

      const tdStyle: React.CSSProperties = {
        'padding': '4px 5px',
        'backgroundColor': theme.palette.mode === 'light' ? (b % 2 === 0 ? theme.palette.grey[200] : theme.palette.grey[300]) : (b % 2 === 0 ? theme.palette.grey[800] : theme.palette.grey[900]),
        border: 0,
        'borderTop': 0,
        'borderLeft': 0,
        'borderBottom': 0,
      };
  
      if (width <= breakPoint) {
        tdStyle.fontSize = '12px';
      }
  
  
      const playerCellStyle: React.CSSProperties = {
        position: 'sticky',
        left: 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        minWidth: playerCellWidth,
        maxWidth: playerCellWidth,
      };
  


      const teamCellStyle: React.CSSProperties = {
        position: 'sticky',
        'minWidth': teamCellWidth,
        'maxWidth': teamCellWidth,
        'left': playerCellWidth,
        'overflow': 'hidden',
        'whiteSpace': 'nowrap',
        'textOverflow': 'ellipsis',
        borderRight: '3px solid ' + (theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark),
      };

      const tableCells: React.JSX.Element[] = [];

      for (let i = 0; i < columns.length; i++) {
        if (columns[i] === 'player') {
          const player = (row.player_id in players && players[row.player_id]) || null;
          if (player) {
            tableCells.push(<TableCell key = {i} sx = {Object.assign({}, tdStyle, playerCellStyle)}>{player ? player.first_name.charAt(0) + '. ' + player.last_name : 'Unknown'}</TableCell>);
          }
        } else if (columns[i] === 'team') {
          const teamHelper = new HelperTeam({'team': teams[row.team_id]});
          tableCells.push(<TableCell key = {i} sx = {Object.assign({}, tdStyle, teamCellStyle)}>{teamHelper.getNameShort()}</TableCell>);
        } else {
          // There are usually about 5300 players each season, so instead of doing a custom call to grab the bounds, just estimate the color, wont matter much
          tableCells.push(<TableCell key = {i} sx = {tdStyle}>{row[columns[i]] || 0}{row[columns[i] + '_rank'] ? <RankSpan key = {i} rank = {row[columns[i] + '_rank']} max = {5300} useOrdinal = {true} /> : ''}</TableCell>);
        }
      } 

      return (
        <StyledTableRow
          key={row.player_id}
          // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          onClick={() => {handleClick(row.player_id)}}
        >
          {tableCells}
        </StyledTableRow>
      );
    });
    return (
      <TableContainer component={Paper}>
        <Table size="small" aria-label="player stats table" style={{ borderCollapse: 'separate' }}>
          <TableHead>
            <TableRow>
              {getColumns().map((column) => {
                const headCell = headCells[column];
                const tdStyle: React.CSSProperties = {
                  'padding': '4px 5px',
                  'border': 0,
                };
      
                if (width <= breakPoint) {
                  tdStyle.fontSize = '13px';
                }
      
                if (headCell.sticky) {
                  tdStyle.position = 'sticky';
                  tdStyle.zIndex = 3;
                } else {
                  tdStyle.whiteSpace = 'nowrap';
                }

                if (headCell.id === 'player') {
                  tdStyle.left = 0;
                }
      
                if (headCell.id === 'team') {
                  tdStyle.borderRight = '3px solid ' + (theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark);
                  tdStyle.minWidth = teamCellWidth;
                  tdStyle.maxWidth = teamCellWidth;
                  tdStyle.left = playerCellWidth;
                }

                return (
                  <Tooltip key={headCell.id} disableFocusListener placement = 'top' title={headCell.tooltip}>
                    <StyledTableHeadCell
                      sx = {tdStyle}
                      key={headCell.id}
                      align={'left'}
                      sortDirection={orderBy === headCell.id ? (order as SortDirection) : false}
                    >
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ?  (order as 'asc' | 'desc') : 'asc'}
                        onClick={() => {handleSort(headCell.id)}}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </StyledTableHeadCell>
                  </Tooltip>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {row_containers}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div style = {{'padding': '0px 5px 20px 5px', 'textAlign': 'center'}}>
      <div style = {{'display': 'flex', 'justifyContent': 'center'}}>
        {statDisplayChips}
      </div>
      {
        topPlayersOnly ?
          <>
            <Typography variant='h6'>Each team top 6 MPG</Typography>
            {getTable(topPlayers)}
          </> :
          <>
            {
            guards.length ?
              <>
              <Typography variant='h6'>Guards</Typography>
              {getTable(guards)}
              </>
              : ''
            }
            {
            forwards.length ?
              <>
              <Typography variant='h6'>Forwards</Typography>
              {getTable(forwards)}
              </>
              : ''
            }
            {
            centers.length ?
              <>
              <Typography variant='h6'>Centers</Typography>
              {getTable(centers)}
              </>
              : ''
            }
          </>
      }
    </div>
  );
}

export default Client;
