'use client';
import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { styled, useTheme } from '@mui/material/styles';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { SortDirection } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';


import RankSpan from '@/components/generic/CBB/RankSpan';
import BackdropLoader from '@/components/generic/BackdropLoader';
import utilsSorter from  '@/components/utils/Sorter';


const Sorter = new utilsSorter();

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
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


const Roster = ({ rosterStats }) => {

  const theme = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [view, setView] = useState<string | null>('overview');
  const [order, setOrder] = useState<string>('asc');
  const [orderBy, setOrderBy] = useState<string>('minutes_per_game');
  const [spin, setSpin] = useState(false);

  const players = rosterStats.players;
  const playerStatsData = rosterStats.cbb_player_statistic_ranking;


  useEffect(() => {
    const sessionOrderby = sessionStorage.getItem('CBB.TEAM.ROSTER.ORDERBY') || null;
    setView(sessionStorage.getItem('CBB.TEAM.ROSTER.VIEW') ? sessionStorage.getItem('CBB.TEAM.ROSTER.VIEW') : 'overview');
    setOrder(sessionStorage.getItem('CBB.TEAM.ROSTER.ORDER') ? sessionStorage.getItem('CBB.TEAM.ROSTER.ORDER') as string : 'asc');
    setOrderBy(sessionOrderby ? sessionOrderby : 'minutes_per_game');
  }, []);


  const getColumns = () => {
    if (view === 'overview') {
      return ['player', 'games', 'minutes_per_game', 'points_per_game', 'player_efficiency_rating', 'efficiency_rating', 'offensive_rating', 'defensive_rating', 'effective_field_goal_percentage', 'true_shooting_percentage', 'usage_percentage'];
    } else if (view === 'per_game') {
      return ['player', 'games', 'minutes_per_game', 'points_per_game', 'offensive_rebounds_per_game', 'defensive_rebounds_per_game', 'assists_per_game', 'steals_per_game', 'blocks_per_game', 'turnovers_per_game', 'fouls_per_game'];
    } else if (view === 'offensive') {
      return ['player', 'games', 'minutes_per_game', 'points_per_game', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'assist_percentage', 'turnover_percentage'];
    } else if (view === 'defensive') {
      return ['player', 'games', 'minutes_per_game', 'offensive_rebound_percentage', 'defensive_rebound_percentage', 'steal_percentage', 'block_percentage'];
    }
    return [];
  };

  const handleClick = (player_id) => {
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/player/' + player_id);
      setSpin(false);
    });
  };


  const headCells = {
    'player': {
      id: 'player',
      numeric: true,
      label: 'Player',
      tooltip: 'Player',
      'sticky': true,
    },
    'field_goal_percentage': {
      id: 'field_goal_percentage',
      numeric: true,
      label: 'FG%',
      tooltip: 'Average field goals percentage per game',
      'sort': 'higher',
    },
    'two_point_field_goal_percentage': {
      id: 'two_point_field_goal_percentage',
      numeric: true,
      label: '2FG%',
      tooltip: 'Average two field goals percentage per game',
      'sort': 'higher',
    },
    'three_point_field_goal_percentage': {
      id: 'three_point_field_goal_percentage',
      numeric: true,
      label: '3FG%',
      tooltip: 'Average three field goals percentage per game',
      'sort': 'higher',
    },
    'free_throw_percentage': {
      id: 'free_throw_percentage',
      numeric: true,
      label: 'FT%',
      tooltip: 'Average free throws percentage per game',
      'sort': 'higher',
    },
    'offensive_rating': {
      id: 'offensive_rating',
      numeric: true,
      label: 'ORT',
      tooltip: 'Offensive rating',
      'sort': 'higher',
    },
    'defensive_rating': {
      id: 'defensive_rating',
      numeric: true,
      label: 'DRT',
      tooltip: 'Defensive rating',
      'sort': 'lower',
    },
    'player_efficiency_rating': {
      id: 'player_efficiency_rating',
      numeric: true,
      label: 'PER',
      tooltip: 'Player efficiency rating',
      'sort': 'higher',
    },
    'efficiency_rating': {
      id: 'efficiency_rating',
      numeric: true,
      label: 'ERT',
      tooltip: 'Efficiency rating',
      'sort': 'higher',
    },
    'games': {
      id: 'games',
      numeric: false,
      label: 'G',
      tooltip: 'Games played',
    },
    'minutes_per_game': {
      id: 'minutes_per_game',
      numeric: true,
      label: 'MPG',
      tooltip: 'Minutes played per game',
      'sort': 'higher',
    },
    'points_per_game': {
      id: 'points_per_game',
      numeric: true,
      label: 'PPG',
      tooltip: 'Points per game',
      'sort': 'higher',
    },
    'offensive_rebounds_per_game': {
      id: 'offensive_rebounds_per_game',
      numeric: true,
      label: 'ORB-G',
      tooltip: 'Offensive rebounds per game',
      'sort': 'higher',
    },
    'defensive_rebounds_per_game': {
      id: 'defensive_rebounds_per_game',
      numeric: true,
      label: 'DRB-G',
      tooltip: 'Defensive rebounds per game',
      'sort': 'higher',
    },
    'total_rebounds_per_game': {
      id: 'total_rebounds_per_game',
      numeric: true,
      label: 'TRB-G',
      tooltip: 'Total rebounds per game',
      'sort': 'higher',
    },
    'assists_per_game': {
      id: 'assists_per_game',
      numeric: true,
      label: 'AST-G',
      tooltip: 'Assists per game',
      'sort': 'higher',
    },
    'steals_per_game': {
      id: 'steals_per_game',
      numeric: true,
      label: 'STL-G',
      tooltip: 'Steals per game',
      'sort': 'higher',
    },
    'blocks_per_game': {
      id: 'blocks_per_game',
      numeric: true,
      label: 'BLK-G',
      tooltip: 'Blocks per game',
      'sort': 'higher',
    },
    'turnovers_per_game': {
      id: 'turnovers_per_game',
      numeric: true,
      label: 'TO-G',
      tooltip: 'Blocks per game',
      'sort': 'higher',
    },
    'fouls_per_game': {
      id: 'fouls_per_game',
      numeric: true,
      label: 'PF-G',
      tooltip: 'Fouls per game',
      'sort': 'higher',
    },
    'true_shooting_percentage': {
      id: 'true_shooting_percentage',
      numeric: true,
      label: 'TS%',
      tooltip: 'True shooting percentage, takes into account all field goals and free throws.',
      'sort': 'higher',
    },
    'effective_field_goal_percentage': {
      id: 'effective_field_goal_percentage',
      numeric: true,
      label: 'eFG%',
      tooltip: 'Effective field goal percentage, adjusted field goal % since 3 points greater than 2.',
      'sort': 'higher',
    },
    'offensive_rebound_percentage': {
      id: 'offensive_rebound_percentage',
      numeric: true,
      label: 'ORB%',
      tooltip: 'Offensive rebound percentage, estimate of % of offensive rebounds player had while on floor.',
      'sort': 'higher',
    },
    'defensive_rebound_percentage': {
      id: 'defensive_rebound_percentage',
      numeric: true,
      label: 'DRB%',
      tooltip: 'Defensive rebound percentage, estimate of % of defensive rebounds player had while on floor.',
      'sort': 'higher',
    },
    'total_rebound_percentage': {
      id: 'total_rebound_percentage',
      numeric: true,
      label: 'TRB%',
      tooltip: 'Total rebound percentage, estimate of % of total rebounds player had while on floor.',
      'sort': 'higher',
    },
    'assist_percentage': {
      id: 'assist_percentage',
      numeric: true,
      label: 'AST%',
      tooltip: 'Assist percentage, estimate of % of assists player had while on floor.',
      'sort': 'higher',
    },
    'steal_percentage': {
      id: 'steal_percentage',
      numeric: true,
      label: 'STL%',
      tooltip: 'Steal percentage, estimate of % of steals player had while on floor.',
      'sort': 'higher',
    },
    'block_percentage': {
      id: 'block_percentage',
      numeric: true,
      label: 'BLK%',
      tooltip: 'Block percentage, estimate of % of blocks player had while on floor.',
      'sort': 'higher',
    },
    'turnover_percentage': {
      id: 'turnover_percentage',
      numeric: true,
      label: 'TOV%',
      tooltip: 'Turnover percentage, estimate of % of turnovers player had while on floor.',
      'sort': 'higher',
    },
    'usage_percentage': {
      id: 'usage_percentage',
      numeric: true,
      label: 'USG%',
      tooltip: 'Usage percentage, estimate of % of plays ran through player while on floor.',
      'sort': 'higher',
    },
  };

  // todo make a cbb_player_statistic TS interface
  let rows: any = Object.values(playerStatsData || {});

  if (!rows.length && players && Object.keys(players).length) {
    for (let player_id in players) {
      rows.push({
        'player_id': player_id,
      });
    }
  }

  const statDisplay = [
    {
      'label': 'Overview',
      'value': 'overview',
    },
    {
      'label': 'Per game',
      'value': 'per_game',
    },
    {
      'label': 'Offensive',
      'value': 'offensive',
    },
    {
      'label': 'Defensive',
      'value': 'defensive',
    },
  ];

  let statDisplayChips: React.JSX.Element[] = [];

  const handleView = (value) => {
    sessionStorage.setItem('CBB.TEAM.ROSTER.VIEW', value);
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
    sessionStorage.setItem('CBB.TEAM.ROSTER.ORDER', (isAsc ? 'desc' : 'asc'));
    sessionStorage.setItem('CBB.TEAM.ROSTER.ORDERBY', id);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };


  let b = 0;

  const row_containers = rows.sort(Sorter.getComparator(order, orderBy, (headCells[orderBy] && headCells[orderBy].sort))).slice().map((row) => {
    let columns = getColumns();


    const tdStyle = {
      'padding': '4px 5px',
      'backgroundColor': theme.palette.mode === 'light' ? (b % 2 === 0 ? theme.palette.grey[200] : theme.palette.grey[300]) : (b % 2 === 0 ? theme.palette.grey[800] : theme.palette.grey[900]),
    };

    b++;

    const tableCells: React.JSX.Element[] = [];

    for (let i = 0; i < columns.length; i++) {
      if (columns[i] === 'player') {
        const player = (row.player_id in players && players[row.player_id]) || null;
        if (player) {
          tableCells.push(<TableCell key = {i} sx = {Object.assign({}, tdStyle, {'textAlign': 'left', 'position': 'sticky', 'left': 0, 'maxWidth': 50})}>{player ? player.first_name + ' ' + player.last_name : 'Unknown'}</TableCell>);
        }
      } else {
        // There are usually about 5300 players each season, so instead of doing a custom call to grab the bounds, just estimate the color, wont matter much
        tableCells.push(<TableCell key = {i} sx = {tdStyle}>{row[columns[i]] || 0}{row[columns[i] + '_rank'] ? <RankSpan key = {i} rank = {row[columns[i] + '_rank']} max = {5300} useOrdinal = {false} /> : ''}</TableCell>);
      }
    } 

    return (
      <StyledTableRow
        key={row.name}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        onClick={() => {handleClick(row.player_id)}}
      >
        {tableCells}
      </StyledTableRow>
    );
  });


  return (
    <div style = {{'paddingTop': 10}}>
      <BackdropLoader open = {(spin === true)} />
    {
      playerStatsData === null ?
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
      {playerStatsData !== null ? <div style = {{'textAlign': 'center'}}>{statDisplayChips}</div> : ''}
      {
        playerStatsData !== null ?    
          <div>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="player stats table">
                <TableHead>
                  <TableRow>
                    {getColumns().map((column) => {
                      const headCell = headCells[column];
                      const tdStyle: React.CSSProperties = {
                        'padding': '4px 5px',
                      };

                      if (headCell.sticky) {
                        tdStyle.position = 'sticky';
                        tdStyle.left = 0;
                        tdStyle.zIndex = 3;
                      } else {
                        tdStyle.whiteSpace = 'nowrap';
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
          </div>
         : ''
      }
    </div>
  );
}


export default Roster;
