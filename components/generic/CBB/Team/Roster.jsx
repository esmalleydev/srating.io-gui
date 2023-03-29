import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { styled, useTheme } from '@mui/material/styles';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import HelperCBB from '../../../helpers/CBB';


import Api from './../../../Api.jsx';
import utilsColor from  './../../../utils/Color.jsx';

const ColorUtil = new utilsColor();
const api = new Api();



const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // '&:nth-of-type(odd)': {
  //   backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[900],
  // },
  // '&:nth-of-type(even)': {
  //   backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  // },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  'backgroundColor': theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900],
}));


const Roster = (props) => {
  const self = this;

  const theme = useTheme();

  const team = props.team;
  const season = props.season;
  const players = props.players || {};

  const [requestedPlayerStats, setRequestedPlayerStats] = useState(false);
  const [playerStatsData, setPlayerStatsData] = useState(null);
  const [view, setView] = useState('offense');
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('minutes_played');
  const [isAverage, setIsAverage] = useState(true);


  useEffect(() => {
    setView(sessionStorage.getItem('CBB.TEAM.ROSTER.VIEW') ? sessionStorage.getItem('CBB.TEAM.ROSTER.VIEW') : 'offense');
    setOrder(sessionStorage.getItem('CBB.TEAM.ROSTER.ORDER') ? sessionStorage.getItem('CBB.TEAM.ROSTER.ORDER') : 'desc');
    setOrderBy(sessionStorage.getItem('CBB.TEAM.ROSTER.ORDERBY') ? sessionStorage.getItem('CBB.TEAM.ROSTER.ORDERBY') : 'minutes_played');
    setIsAverage(sessionStorage.getItem('CBB.TEAM.ROSTER.ISAVERAGE') ? +sessionStorage.getItem('CBB.TEAM.ROSTER.ISAVERAGE') : true);
  }, []);


  if (!requestedPlayerStats) {
    setRequestedPlayerStats(true);
    api.Request({
      'class': 'player_team_season',
      'function': 'getCBBStats',
      'arguments': {
        'team_id': team.team_id,
        'season': season,
      },
    }).then((response) => {
      setPlayerStatsData(response || {});
    }).catch((e) => {
      setPlayerStatsData({});
    });
  }

  const rows = [];

  if (playerStatsData) {
    for (let player_team_season_id in playerStatsData) {

      let row = playerStatsData[player_team_season_id];

      const player = (row.player_id in players && players[row.player_id]) || null;

      rows.push({
        'player_name': player ? player.first_name + ' ' + player.last_name : 'Unknown',
        'height':  player ? player.height : 'Unknown',
        'position':  player ? player.position : 'Unknown',
        'minutes_played': +(((row.stats && row.stats.minutes_played) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'field_goal': +(((row.stats && row.stats.field_goal) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'field_goal_attempts': +(((row.stats && row.stats.field_goal_attempts) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'field_goal_percentage': row.stats && row.stats.field_goal_percentage,
        'two_point_field_goal': +(((row.stats && row.stats.two_point_field_goal) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'two_point_field_goal_attempts': +(((row.stats && row.stats.two_point_field_goal_attempts) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'two_point_field_goal_percentage': row.stats && row.stats.two_point_field_goal_percentage,
        'three_point_field_goal': +(((row.stats && row.stats.three_point_field_goal) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'three_point_field_goal_attempts': +(((row.stats && row.stats.three_point_field_goal_attempts) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'three_point_field_goal_percentage': row.stats && row.stats.three_point_field_goal_percentage,
        'free_throws': +(((row.stats && row.stats.free_throws) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'free_throw_attempts': +(((row.stats && row.stats.free_throw_attempts) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'free_throw_percentage': row.stats && row.stats.free_throw_percentage,
        'offensive_rebounds': +(((row.stats && row.stats.offensive_rebounds) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'defensive_rebounds': +(((row.stats && row.stats.defensive_rebounds) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'total_rebounds': +(((row.stats && row.stats.total_rebounds) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'assists': +(((row.stats && row.stats.assists) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'steals': +(((row.stats && row.stats.steals) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'blocks': +(((row.stats && row.stats.blocks) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'turnovers': +(((row.stats && row.stats.turnovers) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'fouls': +(((row.stats && row.stats.fouls) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'points': +(((row.stats && row.stats.points) || 0) / (isAverage && row.stats.games > 0 ? row.stats.games : 1)).toFixed(2),
        'games': row.stats && row.stats.games,
      });
    }
  }

  const getColumns = () => {
    if (view === 'offense') {
      return ['player_name', 'points', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'offensive_rebounds', 'assists'];
    } else if (view === 'defense') {
      return ['player_name', 'defensive_rebounds', 'steals', 'blocks'];
    } else if (view === 'other') {
      return ['player_name', 'height', 'position', 'minutes_played', 'games', 'turnovers', 'fouls'];
    } else if (view === 'all') {
      return ['player_name', 'height', 'position', 'minutes_played', 'games', 'points', 'field_goal', 'field_goal_attempts', 'field_goal_percentage', 'two_point_field_goal', 'two_point_field_goal_attempts', 'two_point_field_goal_percentage', 'three_point_field_goal', 'three_point_field_goal_attempts', 'three_point_field_goal_percentage', 'free_throws', 'free_throw_attempts', 'free_throw_percentage', 'offensive_rebounds', 'defensive_rebounds', 'total_rebounds', 'steals', 'blocks', 'assists', 'turnovers', 'fouls'];
    }

    return [];
  };

  const headCells = {
    'player_name': {
      'id': 'player_name',
      'numeric': false,
      'label': 'Player',
      'tooltip': 'Player name',
      'sticky': true,
    },
    'height': {
      'id': 'height',
      'numeric': false,
      'label': 'Height',
      'tooltip': 'Height',
    },
    'position': {
      'id': 'position',
      'numeric': false,
      'label': 'Position',
      'tooltip': 'Position',
    },
    'games': {
      'id': 'games',
      'label': 'G',
      'title': 'Games',
    },
    'minutes_played': {
      'id': 'minutes_played',
      'numeric': false,
      'label': 'MP',
      'tooltip': 'Minutes played',
    },
    'points': {
      'id': 'points',
      'numeric': false,
      'label': 'PTS',
      'tooltip': 'Points',
    },
    'field_goal': {
      'id': 'field_goal',
      'label': 'FG',
      'tooltip': 'Field goals',
    },
    'field_goal_attempts': {
      'id': 'field_goal_attempts',
      'label': 'FGA',
      'tooltip': 'Field goal attempts',
    },
    'field_goal_percentage': {
      'id': 'field_goal_percentage',
      'label': 'FG%',
      'tooltip': 'Field goal percentage',
    },
    'two_point_field_goal': {
      'id': 'two_point_field_goal',
      'label': '2P',
      'tooltip': '2 point field goals',
    },
    'two_point_field_goal_attempts': {
      'id': 'two_point_field_goal_attempts',
      'label': '2PA',
      'tooltip': '2 point field goal attempts',
    },
    'two_point_field_goal_percentage': {
      'id': 'two_point_field_goal_percentage',
      'label': '2P%',
      'tooltip': '2 point field goal percentage',
    },
    'three_point_field_goal': {
      'id': 'three_point_field_goal',
      'label': '3P',
      'tooltip': '3 point field goals',
    },
    'three_point_field_goal_attempts': {
      'id': 'three_point_field_goal_attempts',
      'label': '3PA',
      'tooltip': '3 point field goal attempts',
    },
    'three_point_field_goal_percentage': {
      'id': 'three_point_field_goal_percentage',
      'label': '3P%',
      'tooltip': '3 point field goal percentage',
    },
    'free_throws': {
      'id': 'free_throws',
      'label': 'FT',
      'tooltip': 'Free throws',
    },
    'free_throw_attempts': {
      'id': 'free_throw_attempts',
      'label': 'FTA',
      'tooltip': 'Free throw attempts',
    },
    'free_throw_percentage': {
      'id': 'free_throw_percentage',
      'label': 'FT%',
      'tooltip': 'Free throw percentage',
    },
    'offensive_rebounds': {
      'id': 'offensive_rebounds',
      'label': 'ORB',
      'tooltip': 'Offensive rebounds',
    },
    'defensive_rebounds': {
      'id': 'defensive_rebounds',
      'label': 'DRB',
      'tooltip': 'Defensive rebounds',
    },
    'total_rebounds': {
      'id': 'total_rebounds',
      'label': 'TRB',
      'tooltip': 'Total rebounds',
    },
    'assists': {
      'id': 'assists',
      'label': 'AST',
      'tooltip': 'Assists',
    },
    'steals': {
      'id': 'steals',
      'label': 'STL',
      'tooltip': 'Steals',
    },
    'blocks': {
      'id': 'blocks',
      'label': 'BLK',
      'tooltip': 'Blocks',
    },
    'turnovers': {
      'id': 'turnovers',
      'label': 'TOV',
      'tooltip': 'Turnovers',
    },
    'fouls': {
      'id': 'fouls',
      'label': 'PF',
      'title': 'Personal fouls',
    },
  };

  const statDisplay = [
    {
      'label': 'All',
      'value': 'all',
    },
    {
      'label': 'Offense',
      'value': 'offense',
    },
    {
      'label': 'Defense',
      'value': 'defense',
    },
    {
      'label': 'Other',
      'value': 'other',
    },
  ];

  let statDisplayChips = [];

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

  const handleAvgToggle = (value) => {
    sessionStorage.setItem('CBB.TEAM.ROSTER.ISAVERAGE', !isAverage);
    setIsAverage(!isAverage);
  };

  const handleSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    sessionStorage.setItem('CBB.TEAM.ROSTER.ORDER', (isAsc ? 'desc' : 'asc'));
    sessionStorage.setItem('CBB.TEAM.ROSTER.ORDERBY', id);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const descendingComparator = (a, b, orderBy) => {
    if ((orderBy in a) && b[orderBy] === null) {
      return 1;
    }
    if (a[orderBy] === null && (orderBy in b)) {
      return -1;
    }

    let a_value = a[orderBy];
    let b_value = b[orderBy];
    if (orderBy === 'wins' || orderBy === 'conf_record') {
      a_value = +a[orderBy].split('-')[0];
      b_value = +b[orderBy].split('-')[0];
    }

    const direction = (headCells[orderBy] && headCells[orderBy].sort) || 'lower';

    if (b_value < a_value) {
      return direction === 'higher' ? 1 : -1;
    }
    if (b_value > a_value) {
      return direction === 'higher' ? -1 : 1;
    }
    return 0;
  }

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  let b = 0;

  const row_containers = rows.sort(getComparator(order, orderBy)).slice().map((row) => {
    let columns = getColumns();


    const tdStyle = {
      'padding': '4px 5px',
      'backgroundColor': theme.palette.mode === 'light' ? (b % 2 === 0 ? theme.palette.grey[200] : theme.palette.grey[300]) : (b % 2 === 0 ? theme.palette.grey[800] : theme.palette.grey[900]),
    };

    b++;


    const bestColor = theme.palette.mode === 'light' ? theme.palette.success.main : theme.palette.success.dark;
    const worstColor = theme.palette.mode === 'light' ? theme.palette.error.main : theme.palette.error.dark;

    const spanStyle = {
      'fontSize': '10px',
      'marginLeft': '5px',
      'padding': '3px',
      'borderRadius': '5px',
    };


    const tableCells = [];

    for (let i = 0; i < columns.length; i++) {
      if (columns[i] === 'player_name') {
        tableCells.push(<TableCell key = {i} sx = {Object.assign({}, tdStyle, {'textAlign': 'left', 'position': 'sticky', 'left': 0, 'maxWidth': 50})}>{row.player_name}</TableCell>);
      } else {
        // const colors = {};
        // const backgroundColor = ColorUtil.lerpColor(bestColor, worstColor, (+row[columns[i] + '_rank'] / 363));

        // if (backgroundColor !== '#') {
        //   colors.backgroundColor = backgroundColor;
        //   colors.color = theme.palette.getContrastText(backgroundColor);
        // }
        // {row[columns[i] + '_rank'] ? <span style = {Object.assign(colors, spanStyle)}>{row[columns[i] + '_rank']}</span> : ''}
        tableCells.push(<TableCell key = {i} sx = {tdStyle}>{row[columns[i]]}</TableCell>);
      }
    } 

    return (
      <StyledTableRow
        key={row.name}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        {tableCells}
      </StyledTableRow>
    );
  });


  return (
    <div>
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
      {playerStatsData !== null ? statDisplayChips : ''}
      {
        playerStatsData !== null ?    
          <div>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="player stats table">
                <TableHead>
                  <TableRow>
                    {getColumns().map((column) => {
                      const headCell = headCells[column];
                      const tdStyle = {
                        'padding': '4px 5px',
                      };

                      if (headCell.sticky) {
                        tdStyle.position = 'sticky';
                        tdStyle.left = (headCell.id === 'name' ? 50 : 0);
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
                          sortDirection={orderBy === headCell.id ? order : false}
                        >
                          <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
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
            <FormGroup>
              <FormControlLabel control={<Switch checked = {isAverage} onChange = {handleAvgToggle} />} label = 'Per game avg.' />
            </FormGroup>
          </div>
         : ''
      }
    </div>
  );
}

export default Roster;
