import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import useWindowDimensions from '../../hooks/useWindowDimensions';

import moment from 'moment';

import CircularProgress from '@mui/material/CircularProgress';

import Typography from '@mui/material/Typography';

import Chip from '@mui/material/Chip';
import { styled, useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';

import ConferencePicker from './../../component/CBB/ConferencePicker';

import Api from './../../Api.jsx';
const api = new Api();



const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  'backgroundColor': theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900],
}));


// TODO ADD A BUTTON FOR PEOPLE TO CUSTOMIZE THEIR COLUMNS


const Ranking = (props) => {
  const self = this;

  const navigate = useNavigate();
  const theme = useTheme();

  const { height, width } = useWindowDimensions();

  let sessionData = sessionStorage.getItem('CBB.RANKING.DATA') ? JSON.parse(sessionStorage.getItem('CBB.RANKING.DATA')) : {};

  if (
    (
      sessionData.expire_session &&
      sessionData.expire_session < new Date().getTime()
    ) ||
    (
      sessionData &&
      !sessionData.teams
    )
  ) {
    sessionData = {};
  }



  const [season, setSeason] = useState(2023);
  const [request, setRequest] = useState(sessionData.request || false);
  const [teams, setTeams] = useState(sessionData.teams || {});

  const defaultConferences = localStorage.getItem('CBB.CONFERENCEPICKER.DEFAULT') ? JSON.parse(localStorage.getItem('CBB.CONFERENCEPICKER.DEFAULT')) : [];
  const [conferences, setConferences] = useState(defaultConferences);


  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('composite_rank');

  const [view, setView] = useState(localStorage.getItem('CBB.RANKING.VIEW') ? localStorage.getItem('CBB.RANKING.VIEW') : 'composite');


  const compositeColumns = ['name', 'composite_rank', 'ap_rank', 'wins', 'conf_record', 'elo_rank', 'kenpom_rank', 'srs_rank', 'net_rank', 'elo', 'coaches_rank', 'conf'];
  const statisticColumns = ['name', 'composite_rank', 'offensive_rating', 'defensive_rating', 'points', 'possessions', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'offensive_rebounds', 'defensive_rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'fouls'];

  useEffect(() => {
    sessionStorage.setItem('CBB.RANKING.DATA', JSON.stringify({
      'request': request,
      'teams': teams,
      // 'spin': false,
      'expire_session': new Date().getTime() + (30 * 60 * 1000), // 30 mins from now
    }));
  });

  const getTeams = () => {
    api.Request({
      'class': 'team',
      'function': 'getCBBTeams',
      'arguments': {
        'season': season,
      }
    }).then(teams => {
      setTeams(teams);
      setRequest(true);
    }).catch((err) => {
      // console.log(err);
      setRequest(true);
    });
  };

  if (!request) {
    getTeams();
  }

  if (!teams || !Object.keys(teams).length) {
    return (<div style = {{'display': 'flex', 'justifyContent': 'center'}}><CircularProgress /></div>);
  }

  const handleConferences = (conference) => {
    let currentConferences = [...conferences];


    if (conference && conference !== 'all') {
      const conf_index = currentConferences.indexOf(conference);

      if (conf_index > -1) {
        currentConferences.splice(conf_index, 1);
      } else {
        currentConferences.push(conference);
      }
    } else {
      currentConferences = [];
    }

    localStorage.setItem('CBB.CONFERENCEPICKER.DEFAULT', JSON.stringify(currentConferences));
    setConferences(currentConferences);
  }


  let confChips = [];
  for (let i = 0; i < conferences.length; i++) {
    confChips.push(<Chip sx = {{'margin': '5px'}} label={conferences[i]} onDelete={() => {handleConferences(conferences[i])}} />);
  }

  function handleTeam(team_id) {
    navigate('/CBB/Team/' + team_id);
  }

  const getColumns = () => {
    if (view === 'composite') {
      return compositeColumns;
    } else if (view === 'statistic') {
      return statisticColumns;
    } else if (view === 'custom') {
      return []; // todo
    }

    return [];
  };


  const headCells = {
    'name': {
      id: 'name',
      numeric: false,
      label: 'Team',
      tooltip: 'Team',
    },
    'composite_rank': {
      id: 'composite_rank',
      numeric: true,
      label: 'Rank',
      tooltip: 'Composite rank',
    },
    'ap_rank': {
      id: 'ap_rank',
      numeric: true,
      label: 'AP',
      tooltip: 'Associated Press rank',
    },
    'wins': {
      id: 'wins',
      numeric: false,
      label: 'W/L',
      tooltip: 'Win/Loss',
    },
    'conf_record': {
      id: 'conf_record',
      numeric: false,
      label: 'Conf W/L',
      tooltip: 'Conference Win/Loss',
    },
    'elo_rank': {
      id: 'elo_rank',
      numeric: true,
      label: 'ELO',
      tooltip: '>sportranking.io ELO rank',
    },
    'kenpom_rank': {
      id: 'kenpom_rank',
      numeric: true,
      label: 'KP',
      tooltip: 'kenpom.com rank',
    },
    'srs_rank': {
      id: 'srs_rank',
      numeric: true,
      label: 'SRS',
      tooltip: 'Simple rating system rank',
    },
    'net_rank': {
      id: 'net_rank',
      numeric: true,
      label: 'NET',
      tooltip: 'NET rank',
    },
    'elo': {
      id: 'elo',
      numeric: true,
      label: 'Rating',
      tooltip: '>sportranking.io ELO rating',
    },
    'coaches_rank': {
      id: 'coaches_rank',
      numeric: true,
      label: 'Coaches',
      tooltip: 'Coaches poll rank',
    },
    'conf': {
      id: 'conf',
      numeric: false,
      label: 'Conf.',
      tooltip: 'Conference',
    },
    'field_goal': {
      id: 'field_goal',
      numeric: true,
      label: 'FG',
      tooltip: 'Average field goals per game',
    },
    'field_goal_attempts': {
      id: 'field_goal_attempts',
      numeric: true,
      label: 'FGA',
      tooltip: 'Average field goals attempts per game',
    },
    'field_goal_percentage': {
      id: 'field_goal_percentage',
      numeric: true,
      label: 'FG%',
      tooltip: 'Average field goals percentage per game',
    },
    'two_point_field_goal': {
      id: 'two_point_field_goal',
      numeric: true,
      label: '2FG',
      tooltip: 'Average two field goals per game',
    },
    'two_point_field_goal_attempts': {
      id: 'two_point_field_goal_attempts',
      numeric: true,
      label: '2FGA',
      tooltip: 'Average two field goals attempts per game',
    },
    'two_point_field_goal_percentage': {
      id: 'two_point_field_goal_percentage',
      numeric: true,
      label: '2FG%',
      tooltip: 'Average two field goals percentage per game',
    },
    'three_point_field_goal': {
      id: 'three_point_field_goal',
      numeric: true,
      label: '3FG',
      tooltip: 'Average three field goals per game',
    },
    'three_point_field_goal_attempts': {
      id: 'three_point_field_goal_attempts',
      numeric: true,
      label: '3FGA',
      tooltip: 'Average three field goals attempts per game',
    },
    'three_point_field_goal_percentage': {
      id: 'three_point_field_goal_percentage',
      numeric: true,
      label: '3FG%',
      tooltip: 'Average three field goals percentage per game',
    },
    'free_throws': {
      id: 'free_throws',
      numeric: true,
      label: 'FT',
      tooltip: 'Average free throws per game',
    },
    'free_throw_attempts': {
      id: 'free_throw_attempts',
      numeric: true,
      label: 'FTA',
      tooltip: 'Average free throws attempts per game',
    },
    'free_throw_percentage': {
      id: 'free_throw_percentage',
      numeric: true,
      label: 'FT%',
      tooltip: 'Average free throws percentage per game',
    },
    'offensive_rebounds': {
      id: 'offensive_rebounds',
      numeric: true,
      label: 'ORB',
      tooltip: 'Average offensive rebounds per game',
    },
    'defensive_rebounds': {
      id: 'defensive_rebounds',
      numeric: true,
      label: 'DRB',
      tooltip: 'Average defensive rebounds per game',
    },
    'total_rebounds': {
      id: 'total_rebounds',
      numeric: true,
      label: 'TRB',
      tooltip: 'Average total rebounds per game',
    },
    'assists': {
      id: 'assists',
      numeric: true,
      label: 'AST',
      tooltip: 'Average assists per game',
    },
    'steals': {
      id: 'steals',
      numeric: true,
      label: 'STL',
      tooltip: 'Average steals per game',
    },
    'blocks': {
      id: 'blocks',
      numeric: true,
      label: 'BLK',
      tooltip: 'Average blocks per game',
    },
    'turnovers': {
      id: 'turnovers',
      numeric: true,
      label: 'TOV',
      tooltip: 'Average turnovers per game',
    },
    'fouls': {
      id: 'fouls',
      numeric: true,
      label: 'PF',
      tooltip: 'Average fouls per game',
    },
    'points': {
      id: 'points',
      numeric: true,
      label: 'PTS',
      tooltip: 'Average points per game',
    },
    'possessions': {
      id: 'possessions',
      numeric: true,
      label: 'Pace',
      tooltip: 'Average possessions per game',
    },
    'offensive_rating': {
      id: 'offensive_rating',
      numeric: true,
      label: 'ORT',
      tooltip: 'Offensive rating ((PTS / Pace) * 100)',
    },
    'defensive_rating': {
      id: 'defensive_rating',
      numeric: true,
      label: 'DRT',
      tooltip: 'Defensive rating ((Opp. PTS / Opp. Pace) * 100)',
    },
  };


  let rows = [];

  let lastUpdated = null;

  for (let team_id in teams) {
    let team = teams[team_id];
    if (!team.stats) {
    // if (!team.last_ranking || !team.stats) {
      // console.log('missing ranking or stats');
      // console.log(team);
      continue;
    }

    if (
      conferences.length &&
      conferences.indexOf(team.cbb_conference) === -1
    ) {
      continue;
    }

    if (
      team.last_ranking &&
      (
        !lastUpdated ||
        lastUpdated < team.last_ranking.date_of_rank
      )
    ) {
      lastUpdated = team.last_ranking.date_of_rank;
    }

    rows.push({
      'team_id': team.team_id,
      'composite_rank': team.last_ranking && team.last_ranking.composite_rank,
      'ap_rank': team.last_ranking && team.last_ranking.ap_rank,
      'name': team.kenpom,
      'wins': team.stats.wins + '-' + team.stats.losses,
      'conf_record': team.stats.confwins + '-' + team.stats.conflosses,
      'conf': team.cbb_conference,
      'elo_rank': team.last_ranking && team.last_ranking.elo_rank,
      'elo': team.elo,
      'kenpom_rank': team.last_ranking && team.last_ranking.kenpom_rank,
      'srs_rank': team.last_ranking && team.last_ranking.srs_rank,
      'net_rank': team.last_ranking && team.last_ranking.net_rank,
      'coaches_rank': team.last_ranking && team.last_ranking.coaches_rank,
      'field_goal': team.cbb_statistic_ranking && team.cbb_statistic_ranking.field_goal,
      'field_goal_attempts': team.cbb_statistic_ranking && team.cbb_statistic_ranking.field_goal_attempts,
      'field_goal_percentage': team.cbb_statistic_ranking && team.cbb_statistic_ranking.field_goal_percentage,
      'two_point_field_goal': team.cbb_statistic_ranking && team.cbb_statistic_ranking.two_point_field_goal,
      'two_point_field_goal_attempts': team.cbb_statistic_ranking && team.cbb_statistic_ranking.two_point_field_goal_attempts,
      'two_point_field_goal_percentage': team.cbb_statistic_ranking && team.cbb_statistic_ranking.two_point_field_goal_percentage,
      'three_point_field_goal': team.cbb_statistic_ranking && team.cbb_statistic_ranking.three_point_field_goal,
      'three_point_field_goal_attempts': team.cbb_statistic_ranking && team.cbb_statistic_ranking.three_point_field_goal_attempts,
      'three_point_field_goal_percentage': team.cbb_statistic_ranking && team.cbb_statistic_ranking.three_point_field_goal_percentage,
      'free_throws': team.cbb_statistic_ranking && team.cbb_statistic_ranking.free_throws,
      'free_throw_attempts': team.cbb_statistic_ranking && team.cbb_statistic_ranking.free_throw_attempts,
      'free_throw_percentage': team.cbb_statistic_ranking && team.cbb_statistic_ranking.free_throw_percentage,
      'offensive_rebounds': team.cbb_statistic_ranking && team.cbb_statistic_ranking.offensive_rebounds,
      'defensive_rebounds': team.cbb_statistic_ranking && team.cbb_statistic_ranking.defensive_rebounds,
      'total_rebounds': team.cbb_statistic_ranking && team.cbb_statistic_ranking.total_rebounds,
      'assists': team.cbb_statistic_ranking && team.cbb_statistic_ranking.assists,
      'steals': team.cbb_statistic_ranking && team.cbb_statistic_ranking.steals,
      'blocks': team.cbb_statistic_ranking && team.cbb_statistic_ranking.blocks,
      'turnovers': team.cbb_statistic_ranking && team.cbb_statistic_ranking.turnovers,
      'fouls': team.cbb_statistic_ranking && team.cbb_statistic_ranking.fouls,
      'points': team.cbb_statistic_ranking && team.cbb_statistic_ranking.points,
      'possessions': team.cbb_statistic_ranking && team.cbb_statistic_ranking.possessions,
      'offensive_rating': team.cbb_statistic_ranking && team.cbb_statistic_ranking.offensive_rating,
      'defensive_rating': team.cbb_statistic_ranking && team.cbb_statistic_ranking.defensive_rating,
      'opponent_field_goal': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_field_goal,
      'opponent_field_goal_attempts': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_field_goal_attempts,
      'opponent_field_goal_percentage': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_field_goal_percentage,
      'opponent_two_point_field_goal': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_two_point_field_goal,
      'opponent_two_point_field_goal_attempts': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_two_point_field_goal_attempts,
      'opponent_two_point_field_goal_percentage': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_two_point_field_goal_percentage,
      'opponent_three_point_field_goal': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_three_point_field_goal,
      'opponent_three_point_field_goal_attempts': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_three_point_field_goal_attempts,
      'opponent_three_point_field_goal_percentage': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_three_point_field_goal_percentage,
      'opponent_free_throws': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_free_throws,
      'opponent_free_throw_attempts': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_free_throw_attempts,
      'opponent_free_throw_percentage': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_free_throw_percentage,
      'opponent_offensive_rebounds': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_offensive_rebounds,
      'opponent_defensive_rebounds': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_defensive_rebounds,
      'opponent_total_rebounds': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_total_rebounds,
      'opponent_assists': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_assists,
      'opponent_steals': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_steals,
      'opponent_blocks': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_blocks,
      'opponent_turnovers': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_turnovers,
      'opponent_fouls': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_fouls,
      'opponent_points': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_points,
      'opponent_possessions': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_possessions,
    });
  }

  const handleSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (a[orderBy] && !b[orderBy]) {
      return 1;
    }
    if (!a[orderBy] && b[orderBy]) {
      return -1;
    }

    let a_value = a[orderBy];
    let b_value = b[orderBy];
    if (orderBy === 'wins' || orderBy === 'conf_record') {
      a_value = +a[orderBy].split('-')[0];
      b_value = +b[orderBy].split('-')[0];
    }

    if (b_value < a_value) {
      return -1;
    }
    if (b_value > a_value) {
      return 1;
    }
    return 0;
  }

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleRankingView = (value) => {
    localStorage.setItem('CBB.RANKING.VIEW', value);
    setView(value);
  };

  const row_containers = rows.sort(getComparator(order, orderBy)).slice().map((row) => {
    let columns = getColumns();

    let teamCellStyle = {
      'cursor': 'pointer',
    };

    // if (width < 900) {
      teamCellStyle.position = 'sticky';
      teamCellStyle.left = 0;
      teamCellStyle.backgroundColor = (theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]);
    // }

    const tableCells = [];

    for (let i = 0; i < columns.length; i++) {
      if (columns[i] === 'name') {
        tableCells.push(<TableCell sx = {teamCellStyle} onClick={() => {handleTeam(row.team_id)}}>{row.name}</TableCell>);
      } else {
        tableCells.push(<TableCell>{row[columns[i]]}</TableCell>);
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
    <div style = {{'padding': '20px'}}>
      <Typography variant = 'h5'>NCAAM college basketball rankings.</Typography>
      {lastUpdated ? <Typography color="text.secondary" variant = 'body1' style = {{'fontStyle': 'italic'}}>Last updated: {moment(lastUpdated.split('T')[0]).format('MMMM Do YYYY')}</Typography> : ''}
      <div style = {{'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'marginTop': '10px'}}><ConferencePicker selected = {conferences} actionHandler = {handleConferences} /></div>
      <Chip sx = {{'margin': '5px'}} label='Composite rankings' variant={view !== 'composite' ? 'outlined' : ''} color={view !== 'composite' ? 'primary' : 'success'} onClick={() => handleRankingView('composite')} />
      <Chip sx = {{'margin': '5px'}} label='Statistic rankings' variant={view !== 'statistic' ? 'outlined' : ''} color={view !== 'statistic' ? 'primary' : 'success'} onClick={() => handleRankingView('statistic')} />
      {confChips}
      <TableContainer component={Paper} sx = {{'maxHeight': height - 290}}>
        <Table size = 'small' stickyHeader>
          <TableHead>
            <TableRow>
              {getColumns().map((column) => {
                const headCell = headCells[column];
                return (
                <Tooltip key={headCell.id} disableFocusListener placement = 'top' title={headCell.tooltip}>
                  <StyledTableHeadCell
                    sx = {headCell.id === 'name' ? {'position': 'sticky', 'left': 0, 'z-index': 3} : {'whiteSpace': 'nowrap'}}
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
    </div>
  );
}


export default Ranking;
