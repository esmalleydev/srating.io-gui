import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useWindowDimensions from '../../components/hooks/useWindowDimensions';

import cacheData from 'memory-cache';

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
import Backdrop from '@mui/material/Backdrop';
import { visuallyHidden } from '@mui/utils';

import ConferencePicker from '../../components/generic/CBB/ConferencePicker';
import ColumnPicker from '../../components/generic/CBB/ColumnPicker';


import Api from '../../components/Api.jsx';
import utilsColor from  '../../components/utils/Color.jsx';

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


const Ranking = (props) => {
  const self = this;

  const router = useRouter();
  const theme = useTheme();

  const { height, width } = useWindowDimensions();

  const teams = props.data;
  const [spin, setSpin] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [conferences, setConferences] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('composite_rank');
  const [view, setView] = useState('composite');
  const [customColumns, setCustomColumns] = useState(['composite_rank', 'name']);
  const [customColumnsOpen, setCustomColumnsOpen] = useState(false);


  useEffect(() => {
    setFirstRender(false);
    setConferences(localStorage.getItem('CBB.CONFERENCEPICKER.DEFAULT') ? JSON.parse(localStorage.getItem('CBB.CONFERENCEPICKER.DEFAULT')) : []);
    setView(localStorage.getItem('CBB.RANKING.VIEW') ? localStorage.getItem('CBB.RANKING.VIEW') : 'composite');
    setCustomColumns(localStorage.getItem('CBB.RANKING.COLUMNS') ?  JSON.parse(localStorage.getItem('CBB.RANKING.COLUMNS')) : ['composite_rank', 'name']);
  }, []);

  if (firstRender) {
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
    setSpin(true);
    router.push('/CBB/Team/' + team_id).then(() => {
      setSpin(false);
    });
  }

  const getColumns = () => {
    if (view === 'composite') {
      return ['composite_rank', 'name', 'wins', 'conf_record', 'elo', 'adjusted_efficiency_rating', 'opponent_efficiency_rating', 'kenpom_rank', 'srs_rank', 'net_rank', 'ap_rank', 'coaches_rank', 'conf'];
    } else if (view === 'offense') {
      return ['composite_rank', 'name', 'offensive_rating', 'points', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'offensive_rebounds', 'assists'];
    } else if (view === 'defense') {
      return ['composite_rank', 'name', 'defensive_rating', 'defensive_rebounds', 'steals', 'blocks', 'opponent_points', 'opponent_field_goal_percentage', 'opponent_two_point_field_goal_percentage', 'opponent_three_point_field_goal_percentage'];
    } else if (view === 'special') {
      return ['composite_rank', 'name', 'opponent_efficiency_rating', 'possessions', 'turnovers', 'fouls'];
    } else if (view === 'custom') {
      return customColumns;
    }

    return [];
  };


  const headCells = {
    'composite_rank': {
      id: 'composite_rank',
      numeric: true,
      label: 'Rk',
      tooltip: 'Composite rank',
      'sticky': true,
      'disabled': true,
      'sort': 'lower',
    },
    'name': {
      id: 'name',
      numeric: false,
      label: 'Team',
      tooltip: 'Team name',
      'sticky': true,
      'disabled': true,
    },
    'ap_rank': {
      id: 'ap_rank',
      numeric: true,
      label: 'AP',
      tooltip: 'Associated Press rank',
      'sort': 'lower',
    },
    'wins': {
      id: 'wins',
      numeric: false,
      label: 'W/L',
      tooltip: 'Win/Loss',
      'sort': 'higher',
    },
    'conf_record': {
      id: 'conf_record',
      numeric: false,
      label: 'C W/L',
      tooltip: 'Conference Win/Loss',
      'sort': 'higher',
    },
    'elo_rank': {
      id: 'elo_rank',
      numeric: true,
      label: 'ELO',
      tooltip: 'srating.io ELO rank',
      'sort': 'lower',
    },
    'kenpom_rank': {
      id: 'kenpom_rank',
      numeric: true,
      label: 'KP',
      tooltip: 'kenpom.com rank',
      'sort': 'lower',
    },
    'srs_rank': {
      id: 'srs_rank',
      numeric: true,
      label: 'SRS',
      tooltip: 'Simple rating system rank',
      'sort': 'lower',
    },
    'net_rank': {
      id: 'net_rank',
      numeric: true,
      label: 'NET',
      tooltip: 'NET rank',
      'sort': 'lower',
    },
    'elo': {
      id: 'elo',
      numeric: true,
      label: 'sRating',
      tooltip: 'srating.io ELO rating',
      'sort': 'higher',
    },
    'coaches_rank': {
      id: 'coaches_rank',
      numeric: true,
      label: 'Coaches',
      tooltip: 'Coaches poll rank',
      'sort': 'lower',
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
      'sort': 'higher',
    },
    'field_goal_attempts': {
      id: 'field_goal_attempts',
      numeric: true,
      label: 'FGA',
      tooltip: 'Average field goals attempts per game',
      'sort': 'higher',
    },
    'field_goal_percentage': {
      id: 'field_goal_percentage',
      numeric: true,
      label: 'FG%',
      tooltip: 'Average field goals percentage per game',
      'sort': 'higher',
    },
    'two_point_field_goal': {
      id: 'two_point_field_goal',
      numeric: true,
      label: '2FG',
      tooltip: 'Average two field goals per game',
      'sort': 'higher',
    },
    'two_point_field_goal_attempts': {
      id: 'two_point_field_goal_attempts',
      numeric: true,
      label: '2FGA',
      tooltip: 'Average two field goals attempts per game',
      'sort': 'higher',
    },
    'two_point_field_goal_percentage': {
      id: 'two_point_field_goal_percentage',
      numeric: true,
      label: '2FG%',
      tooltip: 'Average two field goals percentage per game',
      'sort': 'higher',
    },
    'three_point_field_goal': {
      id: 'three_point_field_goal',
      numeric: true,
      label: '3FG',
      tooltip: 'Average three field goals per game',
      'sort': 'higher',
    },
    'three_point_field_goal_attempts': {
      id: 'three_point_field_goal_attempts',
      numeric: true,
      label: '3FGA',
      tooltip: 'Average three field goals attempts per game',
      'sort': 'higher',
    },
    'three_point_field_goal_percentage': {
      id: 'three_point_field_goal_percentage',
      numeric: true,
      label: '3FG%',
      tooltip: 'Average three field goals percentage per game',
      'sort': 'higher',
    },
    'free_throws': {
      id: 'free_throws',
      numeric: true,
      label: 'FT',
      tooltip: 'Average free throws per game',
      'sort': 'higher',
    },
    'free_throw_attempts': {
      id: 'free_throw_attempts',
      numeric: true,
      label: 'FTA',
      tooltip: 'Average free throws attempts per game',
      'sort': 'higher',
    },
    'free_throw_percentage': {
      id: 'free_throw_percentage',
      numeric: true,
      label: 'FT%',
      tooltip: 'Average free throws percentage per game',
      'sort': 'higher',
    },
    'offensive_rebounds': {
      id: 'offensive_rebounds',
      numeric: true,
      label: 'ORB',
      tooltip: 'Average offensive rebounds per game',
      'sort': 'higher',
    },
    'defensive_rebounds': {
      id: 'defensive_rebounds',
      numeric: true,
      label: 'DRB',
      tooltip: 'Average defensive rebounds per game',
      'sort': 'higher',
    },
    'total_rebounds': {
      id: 'total_rebounds',
      numeric: true,
      label: 'TRB',
      tooltip: 'Average total rebounds per game',
      'sort': 'higher',
    },
    'assists': {
      id: 'assists',
      numeric: true,
      label: 'AST',
      tooltip: 'Average assists per game',
      'sort': 'higher',
    },
    'steals': {
      id: 'steals',
      numeric: true,
      label: 'STL',
      tooltip: 'Average steals per game',
      'sort': 'higher',
    },
    'blocks': {
      id: 'blocks',
      numeric: true,
      label: 'BLK',
      tooltip: 'Average blocks per game',
      'sort': 'higher',
    },
    'turnovers': {
      id: 'turnovers',
      numeric: true,
      label: 'TOV',
      tooltip: 'Average turnovers per game',
      'sort': 'lower',
    },
    'fouls': {
      id: 'fouls',
      numeric: true,
      label: 'PF',
      tooltip: 'Average fouls per game',
      'sort': 'lower',
    },
    'points': {
      id: 'points',
      numeric: true,
      label: 'PTS',
      tooltip: 'Average points per game',
      'sort': 'higher',
    },
    'possessions': {
      id: 'possessions',
      numeric: true,
      label: 'Pace',
      tooltip: 'Average possessions per game',
      'sort': 'higher',
    },
    'offensive_rating': {
      id: 'offensive_rating',
      numeric: true,
      label: 'ORT',
      tooltip: 'Offensive rating ((PTS / Pace) * 100)',
      'sort': 'higher',
    },
    'defensive_rating': {
      id: 'defensive_rating',
      numeric: true,
      label: 'DRT',
      tooltip: 'Defensive rating ((Opp. PTS / Opp. Pace) * 100)',
      'sort': 'lower',
    },
    'efficiency_rating': {
      id: 'efficiency_rating',
      numeric: true,
      label: 'EM',
      tooltip: 'Efficiency margin (Offensive rating - Defensive rating)',
      'sort': 'higher',
    },
    'adjusted_efficiency_rating': {
      id: 'adjusted_efficiency_rating',
      numeric: true,
      label: 'aEM',
      tooltip: 'Adjusted Efficiency margin (Offensive rating - Defensive rating) + SOS',
      'sort': 'higher',
    },
    'opponent_offensive_rating': {
      id: 'opponent_offensive_rating',
      numeric: true,
      label: 'oORT',
      tooltip: 'Opponent average Offensive rating',
      'sort': 'higher',
    },
    'opponent_defensive_rating': {
      id: 'opponent_defensive_rating',
      numeric: true,
      label: 'oDRT',
      tooltip: 'Opponent average Defensive rating ',
      'sort': 'lower',
    },
    'opponent_efficiency_rating': {
      id: 'opponent_efficiency_rating',
      numeric: true,
      label: 'SOS',
      tooltip: 'Strength of schedule (Opponent Efficiency margin (oORT - oDRT))',
      'sort': 'higher',
    },
    'opponent_field_goal': {
      id: 'opponent_field_goal',
      numeric: true,
      label: 'Opp. FG',
      tooltip: 'Opponent average field goals per game',
      'sort': 'lower',
    },
    'opponent_field_goal_attempts': {
      id: 'opponent_field_goal_attempts',
      numeric: true,
      label: 'Opp. FGA',
      tooltip: 'Opponent average field goals attempts per game',
      'sort': 'lower',
    },
    'opponent_field_goal_percentage': {
      id: 'opponent_field_goal_percentage',
      numeric: true,
      label: 'Opp. FG%',
      tooltip: 'Opponent average field goals percentage per game',
      'sort': 'lower',
    },
    'opponent_two_point_field_goal': {
      id: 'opponent_two_point_field_goal',
      numeric: true,
      label: 'Opp. 2FG',
      tooltip: 'Opponent average two field goals per game',
      'sort': 'lower',
    },
    'opponent_two_point_field_goal_attempts': {
      id: 'opponent_two_point_field_goal_attempts',
      numeric: true,
      label: 'Opp. 2FGA',
      tooltip: 'Opponent average two field goals attempts per game',
      'sort': 'lower',
    },
    'opponent_two_point_field_goal_percentage': {
      id: 'opponent_two_point_field_goal_percentage',
      numeric: true,
      label: 'Opp. 2FG%',
      tooltip: 'Opponent average two field goals percentage per game',
      'sort': 'lower',
    },
    'opponent_three_point_field_goal': {
      id: 'opponent_three_point_field_goal',
      numeric: true,
      label: 'Opp. 3FG',
      tooltip: 'Opponent average three field goals per game',
      'sort': 'lower',
    },
    'opponent_three_point_field_goal_attempts': {
      id: 'opponent_three_point_field_goal_attempts',
      numeric: true,
      label: 'Opp. 3FGA',
      tooltip: 'Opponent average three field goals attempts per game',
      'sort': 'lower',
    },
    'opponent_three_point_field_goal_percentage': {
      id: 'opponent_three_point_field_goal_percentage',
      numeric: true,
      label: 'Opp. 3FG%',
      tooltip: 'Opponent average three field goals percentage per game',
      'sort': 'lower',
    },
    'opponent_free_throws': {
      id: 'opponent_free_throws',
      numeric: true,
      label: 'Opp. FT',
      tooltip: 'Opponent average free throws per game',
      'sort': 'lower',
    },
    'opponent_free_throw_attempts': {
      id: 'opponent_free_throw_attempts',
      numeric: true,
      label: 'Opp. FTA',
      tooltip: 'Opponent average free throws attempts per game',
      'sort': 'lower',
    },
    'opponent_free_throw_percentage': {
      id: 'opponent_free_throw_percentage',
      numeric: true,
      label: 'Opp. FT%',
      tooltip: 'Opponent average free throws percentage per game',
      'sort': 'lower',
    },
    'opponent_offensive_rebounds': {
      id: 'opponent_offensive_rebounds',
      numeric: true,
      label: 'Opp. ORB',
      tooltip: 'Opponent average offensive rebounds per game',
      'sort': 'lower',
    },
    'opponent_defensive_rebounds': {
      id: 'opponent_defensive_rebounds',
      numeric: true,
      label: 'Opp. DRB',
      tooltip: 'Opponent average defensive rebounds per game',
      'sort': 'lower',
    },
    'opponent_total_rebounds': {
      id: 'opponent_total_rebounds',
      numeric: true,
      label: 'Opp. TRB',
      tooltip: 'Opponent average total rebounds per game',
      'sort': 'lower',
    },
    'opponent_assists': {
      id: 'opponent_assists',
      numeric: true,
      label: 'Opp. AST',
      tooltip: 'Opponent average assists per game',
      'sort': 'lower',
    },
    'opponent_steals': {
      id: 'opponent_steals',
      numeric: true,
      label: 'Opp. STL',
      tooltip: 'Opponent average steals per game',
      'sort': 'lower',
    },
    'opponent_blocks': {
      id: 'opponent_blocks',
      numeric: true,
      label: 'Opp. BLK',
      tooltip: 'Opponent average blocks per game',
      'sort': 'lower',
    },
    'opponent_turnovers': {
      id: 'opponent_turnovers',
      numeric: true,
      label: 'Opp. TOV',
      tooltip: 'Opponent average turnovers per game',
      'sort': 'higher',
    },
    'opponent_fouls': {
      id: 'opponent_fouls',
      numeric: true,
      label: 'Opp. PF',
      tooltip: 'Opponent average fouls per game',
      'sort': 'higher',
    },
    'opponent_points': {
      id: 'opponent_points',
      numeric: true,
      label: 'Opp. PTS',
      tooltip: 'Opponent average points per game',
      'sort': 'lower',
    },
    'opponent_possessions': {
      id: 'opponent_possessions',
      numeric: true,
      label: 'Opp. Pace',
      tooltip: 'Opponent average possessions per game',
      'sort': 'lower',
    },
  };


  let rows = [];

  let lastUpdated = null;

  for (let team_id in teams) {
    let team = teams[team_id];

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

    const wins = (team.cbb_statistic_ranking && team.cbb_statistic_ranking.wins) || 0;
    const losses = (team.cbb_statistic_ranking && team.cbb_statistic_ranking.losses) || 0;
    const confwins = (team.cbb_statistic_ranking && team.cbb_statistic_ranking.confwins) || 0;
    const conflosses = (team.cbb_statistic_ranking && team.cbb_statistic_ranking.conflosses) || 0;

    rows.push({
      'team_id': team.team_id,
      'composite_rank': team.last_ranking && team.last_ranking.composite_rank,
      'ap_rank': team.last_ranking && team.last_ranking.ap_rank,
      'name': team.alt_name,
      'wins': wins + '-' + losses,
      'conf_record': confwins + '-' + conflosses,
      'conf': team.cbb_conference,
      'elo_rank': team.last_ranking && team.last_ranking.elo_rank,
      'elo': team.elo,
      'kenpom_rank': team.last_ranking && team.last_ranking.kenpom_rank,
      'srs_rank': team.last_ranking && team.last_ranking.srs_rank,
      'net_rank': team.last_ranking && team.last_ranking.net_rank,
      'coaches_rank': team.last_ranking && team.last_ranking.coaches_rank,
      // 'sos': team.cbb_statistic_ranking && team.cbb_statistic_ranking.sos,
      // 'sos_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.sos_rank,
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
      'efficiency_rating': team.cbb_statistic_ranking && team.cbb_statistic_ranking.efficiency_rating,
      'adjusted_efficiency_rating': team.cbb_statistic_ranking && team.cbb_statistic_ranking.adjusted_efficiency_rating,
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
      'opponent_offensive_rating': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_offensive_rating,
      'opponent_defensive_rating': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_defensive_rating,
      'opponent_efficiency_rating': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_efficiency_rating,
      'field_goal_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.field_goal_rank,
      'field_goal_attempts_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.field_goal_attempts_rank,
      'field_goal_percentage_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.field_goal_percentage_rank,
      'two_point_field_goal_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.two_point_field_goal_rank,
      'two_point_field_goal_attempts_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.two_point_field_goal_attempts_rank,
      'two_point_field_goal_percentage_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.two_point_field_goal_percentage_rank,
      'three_point_field_goal_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.three_point_field_goal_rank,
      'three_point_field_goal_attempts_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.three_point_field_goal_attempts_rank,
      'three_point_field_goal_percentage_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.three_point_field_goal_percentage_rank,
      'free_throws_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.free_throws_rank,
      'free_throw_attempts_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.free_throw_attempts_rank,
      'free_throw_percentage_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.free_throw_percentage_rank,
      'offensive_rebounds_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.offensive_rebounds_rank,
      'defensive_rebounds_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.defensive_rebounds_rank,
      'total_rebounds_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.total_rebounds_rank,
      'assists_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.assists_rank,
      'steals_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.steals_rank,
      'blocks_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.blocks_rank,
      'turnovers_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.turnovers_rank,
      'fouls_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.fouls_rank,
      'points_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.points_rank,
      'possessions_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.possessions_rank,
      'offensive_rating_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.offensive_rating_rank,
      'defensive_rating_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.defensive_rating_rank,
      'efficiency_rating_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.efficiency_rating_rank,
      'adjusted_efficiency_rating_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.adjusted_efficiency_rating_rank,
      'opponent_field_goal_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_field_goal_rank,
      'opponent_field_goal_attempts_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_field_goal_attempts_rank,
      'opponent_field_goal_percentage_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_field_goal_percentage_rank,
      'opponent_two_point_field_goal_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_two_point_field_goal_rank,
      'opponent_two_point_field_goal_attempts_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_two_point_field_goal_attempts_rank,
      'opponent_two_point_field_goal_percentage_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_two_point_field_goal_percentage_rank,
      'opponent_three_point_field_goal_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_three_point_field_goal_rank,
      'opponent_three_point_field_goal_attempts_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_three_point_field_goal_attempts_rank,
      'opponent_three_point_field_goal_percentage_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_three_point_field_goal_percentage_rank,
      'opponent_free_throws_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_free_throws_rank,
      'opponent_free_throw_attempts_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_free_throw_attempts_rank,
      'opponent_free_throw_percentage_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_free_throw_percentage_rank,
      'opponent_offensive_rebounds_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_offensive_rebounds_rank,
      'opponent_defensive_rebounds_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_defensive_rebounds_rank,
      'opponent_total_rebounds_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_total_rebounds_rank,
      'opponent_assists_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_assists_rank,
      'opponent_steals_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_steals_rank,
      'opponent_blocks_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_blocks_rank,
      'opponent_turnovers_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_turnovers_rank,
      'opponent_fouls_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_fouls_rank,
      'opponent_points_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_points_rank,
      'opponent_possessions_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_possessions_rank,
      'opponent_offensive_rating_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_offensive_rating_rank,
      'opponent_defensive_rating_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_defensive_rating_rank,
      'opponent_efficiency_rating_rank': team.cbb_statistic_ranking && team.cbb_statistic_ranking.opponent_efficiency_rating_rank,
    });
  }

  const handleSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
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

  const handleRankingView = (value) => {
    localStorage.setItem('CBB.RANKING.VIEW', value);
    setView(value);
  };

  let b = 0;

  const row_containers = rows.sort(getComparator(order, orderBy)).slice().map((row) => {
    let columns = getColumns();

    const tdStyle = {
      'padding': '4px 5px',
      'backgroundColor': theme.palette.mode === 'light' ? (b % 2 === 0 ? theme.palette.grey[200] : theme.palette.grey[300]) : (b % 2 === 0 ? theme.palette.grey[800] : theme.palette.grey[900]),
    };

    b++;

    let teamCellStyle = {
      'cursor': 'pointer',
    };

    const bestColor = theme.palette.mode === 'light' ? theme.palette.success.main : theme.palette.success.dark;
    const worstColor = theme.palette.mode === 'light' ? theme.palette.error.main : theme.palette.error.dark;

    const spanStyle = {
      'fontSize': '10px',
      'marginLeft': '5px',
      'padding': '3px',
      'borderRadius': '5px',
    };

    teamCellStyle.position = 'sticky';
    teamCellStyle.left = 50;
    teamCellStyle.maxWidth = 100;

    const tableCells = [];

    for (let i = 0; i < columns.length; i++) {
      if (columns[i] === 'name') {
        tableCells.push(<TableCell key = {i} sx = {Object.assign({}, tdStyle, teamCellStyle)} onClick={() => {handleTeam(row.team_id)}}>{row.name}</TableCell>);
      } else if (columns[i] === 'composite_rank') {
        tableCells.push(<TableCell key = {i} sx = {Object.assign({}, tdStyle, {'textAlign': 'center', 'position': 'sticky', 'left': 0, 'maxWidth': 50})}>{row[columns[i]]}</TableCell>);
      } else {
        const colors = {};
        const backgroundColor = ColorUtil.lerpColor(bestColor, worstColor, (+row[columns[i] + '_rank'] / 363));

        if (backgroundColor !== '#') {
          colors.backgroundColor = backgroundColor;
          colors.color = theme.palette.getContrastText(backgroundColor);
        }
        tableCells.push(<TableCell key = {i} sx = {tdStyle}>{row[columns[i]]}{row[columns[i] + '_rank'] ? <span style = {Object.assign(colors, spanStyle)}>{row[columns[i] + '_rank']}</span> : ''}</TableCell>);
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

  const handlCustomColumnsSave = (columns) => {
    setCustomColumnsOpen(false);
    localStorage.setItem('CBB.RANKING.COLUMNS', JSON.stringify(columns));
    setCustomColumns(columns);
    handleRankingView('custom');
  };

  const handlCustomColumnsExit = () => {
    setCustomColumnsOpen(false);
  };

  const tableStyle = {
    'maxHeight': height - 290 - (width < 470 ? 40 : 0) - (confChips.length ? 40 : 0),
  };


  return (
    <div>
      <Head>
        <title>sRating | College basketball ranking</title>
        <meta name = 'description' content = 'View statistic ranking for all 363 teams' key = 'desc'/>
        <meta property="og:title" content=">sRating.io college basketball rankings" />
        <meta property="og:description" content="View statistic ranking for all 363 teams" />
      </Head>
      {spin ?
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
      : ''}
      <div style = {{'padding': '20px 20px 0px 20px'}}>
        <Typography variant = 'h5'>College basketball rankings.</Typography>
        {lastUpdated ? <Typography color="text.secondary" variant = 'body1' style = {{'fontStyle': 'italic'}}>Last updated: {moment(lastUpdated.split('T')[0]).format('MMMM Do YYYY')}</Typography> : ''}
        <div style = {{'display': 'flex', 'justifyContent': 'center', 'flexWrap': 'wrap'}}>
          <Chip sx = {{'margin': '5px'}} label='Composite' variant={view !== 'composite' ? 'outlined' : ''} color={view !== 'composite' ? 'primary' : 'success'} onClick={() => handleRankingView('composite')} />
          <Chip sx = {{'margin': '5px'}} label='Offense' variant={view !== 'offense' ? 'outlined' : ''} color={view !== 'offense' ? 'primary' : 'success'} onClick={() => handleRankingView('offense')} />
          <Chip sx = {{'margin': '5px'}} label='Defense' variant={view !== 'defense' ? 'outlined' : ''} color={view !== 'defense' ? 'primary' : 'success'} onClick={() => handleRankingView('defense')} />
          <Chip sx = {{'margin': '5px'}} label='Special' variant={view !== 'special' ? 'outlined' : ''} color={view !== 'special' ? 'primary' : 'success'} onClick={() => handleRankingView('special')} />
          <Chip sx = {{'margin': '5px'}} label='Custom' variant={view !== 'custom' ? 'outlined' : ''} color={view !== 'custom' ? 'primary' : 'success'} onClick={() => {setCustomColumnsOpen(true)}} />
          <ColumnPicker options = {headCells} open = {customColumnsOpen} selected = {customColumns} saveHandler = {handlCustomColumnsSave} closeHandler = {handlCustomColumnsExit} />
        </div>
        <div style = {{'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'marginTop': '10px'}}><ConferencePicker selected = {conferences} actionHandler = {handleConferences} /></div>
        {confChips}
      </div>
      <div style = {{'padding': width < 600 ? '0px 10px' : '0px 20px'}}>
        <TableContainer component={Paper} sx = {tableStyle}>
          <Table size = 'small' stickyHeader>
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
      </div>
    </div>
  );
}


export async function getServerSideProps(context) {
  const seconds = 60 * 10; // cache for 10 mins
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage='+seconds+', stale-while-revalidate=59'
  );

  let teams = {};

  const cached = cacheData.get('CBB.RANKING.LOAD');

  if (!cached) {
    await api.Request({
      'class': 'team',
      'function': 'getCBBTeams',
      'arguments': {
        'season': 2023, // todo?
      }
    }).then((response) => {
      teams = response;
      cacheData.put('CBB.RANKING.LOAD', teams, 1000 * 60 * 10);
    }).catch((e) => {

    });
  } else {
    teams = cached;
  }

  return {
    'props': {
      'data': teams,
      'generated': new Date().getTime(),
    },
  }
}


// export async function getStaticProps() {
//   let teams = {};

//   await api.Request({
//     'class': 'team',
//     'function': 'getCBBTeams',
//     'arguments': {
//       'season': 2023, // todo?
//     }
//   }).then((response) => {
//     teams = response;
//   }).catch((e) => {

//   });

//   return {
//     'props': {
//       'data': teams,
//       'generated': new Date().getTime(),
//     },
//     'revalidate': 60 * 10, // 10 mins
//   };
// }


export default Ranking;
