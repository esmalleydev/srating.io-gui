import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import useWindowDimensions from '../../hooks/useWindowDimensions';

import CircularProgress from '@mui/material/CircularProgress';
import { styled, alpha, useTheme } from '@mui/material/styles';

import Typography from '@mui/material/Typography';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import IconButton from '@mui/material/IconButton';
import CalendarIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelCircleIcon from '@mui/icons-material/Cancel';

import moment from 'moment';

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


const Picks = (props) => {
  const self = this;
  let params = useParams();

  const navigate = useNavigate();
  const theme = useTheme();
  const { height, width } = useWindowDimensions();

  const date_ = new Date();
  const defaultRankDisplay = localStorage.getItem('default_cbb_rank_display') ? JSON.parse(localStorage.getItem('default_cbb_rank_display')) : 'composite_rank';

  const [request, setRequest] = useState(false);
  const [spin, setSpin] = useState(true);
  const [date, setDate] = useState();
  const [now, setNow] = useState(date_.getFullYear() + '-' + (date_.getMonth() + 1) + '-' + (date_.getDate() < 10 ? '0' + date_.getDate() : date_.getDate()));
  const [games, setGames] = useState({});
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('start_timestamp');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calAncor, setCalAncor] = useState(null);
  const [rankDisplay, setRankDisplay] = useState(defaultRankDisplay);
  const [inputBet, setBet] = useState(10);
  const [inputOddsMin, setOddsMin] = useState(-1500);
  const [inputOddsMax, setOddsMax] = useState(-150);
  const [inputRoundRobin, setRoundRobin] = useState(0);


  const bet = inputBet ? +inputBet : 0;
  const oddsMin = inputOddsMin ? +inputOddsMin : 0;
  const oddsMax = inputOddsMax ? +inputOddsMax : 0;
  const roundRobinLength = inputRoundRobin ? +inputRoundRobin : 0;


  const shuffle = (array) => {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  };

  const convertAmericanToDecimal = (odds) => {
    if (odds > 0) {
      return 1 + (odds / 100);
    }
    return 1 - (100 / odds);
  };

  const Combination = (arr, n, r, index, data, i, results) => {
    if (index == r) {
      let result = [];
      for (let j=0; j<r; j++){
        result.push(data[j]);
      }
      results.push(result);
      return results;
    }

    if (i >= n) {
      return results;
    }

    data[index] = arr[i];
    Combination(arr, n, r, index+1, data, i+1, results);
    Combination(arr, n, r, index, data, i+1, results);

    return results;
  };

  const getCombinations = (arr, n, r,) => {
    let data = new Array(r);

    let results = [];
    results = Combination(arr, n, r, 0, data, 0, results);
    return results;
  };


  const getGames = (value) => {;
    if (date !== value) {
      setSpin(true);
    }

    setRequest(true);
    api.Request({
      'class': 'cbb_game',
      'function': 'getGames',
      'arguments': {
        'start_date': value,
      }
    }).then(cbb_games => {
      setGames(cbb_games);
      setDate(value);
      setSpin(false);
    }).catch((err) => {
      // nothing for now
    });
  }


  if (!request) {
    getGames(now);
  }



  const handleGame = (cbb_game_id) => {
    navigate('/CBB/Games/' + cbb_game_id);
  }

  const getSelectedDate = () => {
    return date || now;
  }

  const getTeamName = (game, side) => {
    let name = 'Unknown';
    if (
      game &&
      game[side + '_team_id'] &&
      game.teams &&
      game[side + '_team_id'] in game.teams
    ) {
      if (game.teams[game[side + '_team_id']].code) {
        name = game.teams[game[side + '_team_id']].code;
      } else if (game.teams[game[side + '_team_id']].kenpom) {
        name = game.teams[game[side + '_team_id']].kenpom;
      } else if (game.teams[game[side + '_team_id']].name) {
        name = game.teams[game[side + '_team_id']].name;
      }
    }

    return name;
  }

  const getTeamRank = (game, side) => {
    if (
      rankDisplay &&
      game &&
      game[side + '_team_id'] &&
      game.teams &&
      game[side + '_team_id'] in game.teams &&
      game.teams[game[side + '_team_id']].ranking &&
      game.teams[game[side + '_team_id']].ranking[rankDisplay]
    ) {
      return game.teams[game[side + '_team_id']].ranking[rankDisplay];
    }
    return null;
  }

  const getPreOdds = (game, side) => {
    if (
      game.odds &&
      game.odds['pre_game_money_line_' + side]
    ) {
      return game.odds['pre_game_money_line_' + side];
    }

    return '-';
  }

  const getGameStartText = (game) => {
    let date = new Date(game.start_timestamp * 1000);
    let startTime = ((date.getHours() % 12) || 12) + (date.getMinutes() ? ':' + date.getMinutes() : '') + ' ' + (date.getHours() < 12 ? 'am' : 'pm') + ' ';
    if (date.getHours() >= 0 && date.getHours() <= 6) {
      startTime = 'TBA';
    }

    return startTime;
  }

  const headCells = [
    {
      id: 'pick',
      numeric: false,
      label: 'Pick',
    },
    {
      id: 'pick_ml',
      numeric: false,
      label: 'Pick ML',
    },
    {
      id: 'start_timestamp',
      numeric: false,
      padding: '6px 0px 6px 6px',
      label: 'Start',
    },
    {
      id: 'vs',
      numeric: false,
      label: 'VS',
    },
    {
      id: 'vs_ml',
      numeric: false,
      label: 'VS ML',
    },
    {
      id: 'chance',
      numeric: false,
      label: '%',
    },
    {
      id: 'result',
      numeric: false,
      label: 'Result',
    },
  ];

  let rows = [];

  let correct = 0;
  let total_final = 0;

  let total_bet = 0;
  let wins = 0;
  let games_bet = 0;
  let winnings = 0;

  let future_total_bet = 0;
  let future_games_bet = 0;
  let future_winnings_100 = 0;
  let future_games_won_75 = 0;
  let future_winnings_75 = 0;
  let future_winnings_75_array = [];
  let future_games_won_60 = 0;
  let future_winnings_60 = 0;
  let future_winnings_60_array = [];


  let cbb_game_id_x_parlay_odds = {};
  let future_cbb_game_id_x_parlay_odds = {};
  let rows_picked = [];
  let rows_other = [];
  let rows_parlay = [];

  for (let cbb_game_id in games) {
    let game = games[cbb_game_id];

    const row = {
      'cbb_game_id': game.cbb_game_id,
      'game': game,
      'start_timestamp': game.start_timestamp,
      'pick': game.home_team_rating >= game.away_team_rating ? 'home' : 'away',
      'pick_ml': game.home_team_rating >= game.away_team_rating ? getPreOdds(game, 'home') : getPreOdds(game, 'away'),
      'vs': game.home_team_rating >= game.away_team_rating ? 'away' : 'home', // the opposite of the pick :)
      'vs_ml': game.home_team_rating >= game.away_team_rating ? getPreOdds(game, 'away') : getPreOdds(game, 'home'),
      'chance': parseFloat((game.home_team_rating >= game.away_team_rating ? game.home_team_rating : game.away_team_rating) * 100).toFixed(0),
      'result': (game.home_team_rating >= game.away_team_rating && game.home_score > game.away_score) || (game.away_team_rating >= game.home_team_rating && game.home_score < game.away_score),
      'status': game.status,
    };

    if (game.status === 'final') {
      total_final++;

      let was_correct = false;

      if (
        (
          game.home_score > game.away_score &&
          game.home_team_rating > game.away_team_rating
        ) ||
        (
          game.home_score < game.away_score &&
          game.home_team_rating < game.away_team_rating
        )
      ) {
        was_correct = true;
        correct++;
      }

      if (
        game.odds &&
        game.odds.pre_game_money_line_away &&
        game.odds.pre_game_money_line_home
      ) {
        let pick = game.home_team_rating >= game.away_team_rating ? 'home' : 'away';
        let odds = game.odds['pre_game_money_line_' + pick];

        if (
          odds >= oddsMin &&
          odds <= oddsMax
        ) {
          games_bet++;
          total_bet += bet;


          cbb_game_id_x_parlay_odds[cbb_game_id] = {
            'odds': convertAmericanToDecimal(+odds),
            'cbb_game_id': cbb_game_id,
          };

          if (was_correct) {
            wins++;
            winnings += bet + ((100 / Math.abs(odds)) * bet);
          }
        }
      }
    }

    if (
      game.odds &&
      game.odds.pre_game_money_line_away &&
      game.odds.pre_game_money_line_home
    ) {
      let pick = game.home_team_rating >= game.away_team_rating ? 'home' : 'away';
      let odds = game.odds['pre_game_money_line_' + pick];

      if (
        odds >= oddsMin &&
        odds <= oddsMax
      ) {
        rows_picked.push(row);
        future_games_bet++;
        future_total_bet += bet;


        future_cbb_game_id_x_parlay_odds[cbb_game_id] = {
          'odds': convertAmericanToDecimal(+odds),
          'cbb_game_id': cbb_game_id,
        };

        future_winnings_100 += bet + ((100 / Math.abs(odds)) * bet);

        future_winnings_75_array.push(((100 / Math.abs(odds)) * bet));
        future_winnings_60_array.push(((100 / Math.abs(odds)) * bet));
      } else {
        rows_other.push(row);
      }
    }
  }


  // Fanduel only allows 20 parley picks for round robin, so pick the 20 with "best" odds.
  // Fanduel seems to be the sportsbook with the highest round robin limit

  // todo in the future attempt to pick the best mix of 20 games, or splits into multiples of 20?
  

  // let parlay_cbb_game_ids = Object.keys(cbb_game_id_x_parlay_odds);
  let parlay_cbb_game_ids = [];

  if (Object.keys(cbb_game_id_x_parlay_odds).length <= 20) {
    parlay_cbb_game_ids = Object.keys(cbb_game_id_x_parlay_odds);
  } else {
    let sorted_parlay = Object.values(cbb_game_id_x_parlay_odds).sort(function(a,b) {

      if (a.odds < b.odds) {
        return -1;
      }

      if (a.odds > b.odds) {
        return 1;
      }

      return 0;
    });

    for (let i = 0; i < sorted_parlay.length; i++) {
      if (i > 19) {
        break;
      }
      parlay_cbb_game_ids.push(sorted_parlay[i].cbb_game_id);
    }
  }


  let roundRobinWonTotal = 0;
  let roundRobinBetTotal = 0;
  let roundRobinBetCombos = 0;
  let roundRobinWins = 0;
  if (parlay_cbb_game_ids.length > 2 && roundRobinLength) {
    const combinations = getCombinations(parlay_cbb_game_ids, parlay_cbb_game_ids.length, roundRobinLength);

    roundRobinBetCombos = combinations.length;
    roundRobinBetTotal = combinations.length * bet;

    for (let i = 0; i < combinations.length; i++) {
      let parlay_won = true;
      let parlay_odds = null;
      for (let j = 0; j < combinations[i].length; j++) {
        let game = games[combinations[i][j]];
        if (
          (
            game.home_score < game.away_score &&
            game.home_team_rating > game.away_team_rating
          ) ||
          (
            game.home_score > game.away_score &&
            game.home_team_rating < game.away_team_rating
          )
        ) {
          // parlay lost, this team did not win
          parlay_won = false;
          break;
        }

        let odds = cbb_game_id_x_parlay_odds[combinations[i][j]].odds;

        if (parlay_odds === null) {
          parlay_odds = odds;
        } else {
          parlay_odds = parlay_odds * odds;
        }
      }

      if (parlay_won) {
        roundRobinWins++;
        roundRobinWonTotal += (parlay_odds * bet);
      }
    }
  }

  let future_parlay_cbb_game_ids = [];

  if (Object.keys(future_cbb_game_id_x_parlay_odds).length <= 20) {
    future_parlay_cbb_game_ids = Object.keys(future_cbb_game_id_x_parlay_odds);
  } else {
    let sorted_parlay = Object.values(future_cbb_game_id_x_parlay_odds).sort(function(a,b) {

      if (a.odds < b.odds) {
        return -1;
      }

      if (a.odds > b.odds) {
        return 1;
      }

      return 0;
    });

    for (let i = 0; i < sorted_parlay.length; i++) {
      if (i > 19) {
        break;
      }
      future_parlay_cbb_game_ids.push(sorted_parlay[i].cbb_game_id);
    }
  }

  let randomized_60 = shuffle(future_parlay_cbb_game_ids);

  let future_cbb_game_id_x_loss_60 = {};

  for (let i = 0; i < randomized_60.length; i++) {
    if (
      Object.keys(future_cbb_game_id_x_loss_60).length &&
      Object.keys(future_cbb_game_id_x_loss_60).length / randomized_60.length > 0.4
    ) {
      break;
    }

    future_cbb_game_id_x_loss_60[randomized_60[i]] = true;
  }

  let randomized_75 = shuffle(future_parlay_cbb_game_ids);
  let future_cbb_game_id_x_loss_75 = {};

  for (let i = 0; i < randomized_75.length; i++) {
    if (
      Object.keys(future_cbb_game_id_x_loss_75).length &&
      Object.keys(future_cbb_game_id_x_loss_75).length / randomized_75.length > 0.25
    ) {
      break;
    }

    future_cbb_game_id_x_loss_75[randomized_75[i]] = true;
  }

  let future_roundRobinBetTotal = 0;
  let future_roundRobinBetCombos = 0;
  let future_roundRobinWonTotal_100 = 0;
  let future_roundRobinWonTotal_75 = 0;
  let future_roundRobinWonTotal_60 = 0;
  let future_roundRobinWins_100 = 0;
  let future_roundRobinWins_75 = 0;
  let future_roundRobinWins_60 = 0;
  if (future_parlay_cbb_game_ids.length > 2 && roundRobinLength) {
    const combinations = getCombinations(future_parlay_cbb_game_ids, future_parlay_cbb_game_ids.length, roundRobinLength);

    future_roundRobinBetCombos = combinations.length;
    future_roundRobinBetTotal = combinations.length * bet;

    for (let i = 0; i < combinations.length; i++) {
      let parlay_won_75 = true;
      let parlay_won_60 = true;
      let parlay_odds = null;
      for (let j = 0; j < combinations[i].length; j++) {
        let game = games[combinations[i][j]];
        if (game.cbb_game_id in future_cbb_game_id_x_loss_75) {
          // parlay lost, this team did not win
          parlay_won_75 = false;
        }

        if (game.cbb_game_id in future_cbb_game_id_x_loss_60) {
          // parlay lost, this team did not win
          parlay_won_60 = false;
        }

        let odds = future_cbb_game_id_x_parlay_odds[combinations[i][j]].odds;

        if (parlay_odds === null) {
          parlay_odds = odds;
        } else {
          parlay_odds = parlay_odds * odds;
        }
      }

      if (parlay_won_75) {
        future_roundRobinWins_75++;
        future_roundRobinWonTotal_75 += (parlay_odds * bet);
      }

      if (parlay_won_60) {
        future_roundRobinWins_60++;
        future_roundRobinWonTotal_60 += (parlay_odds * bet);
      }

      
      future_roundRobinWins_100++;
      future_roundRobinWonTotal_100 += (parlay_odds * bet);
    }
  }


  if (future_winnings_75_array.length) {
    let randomized = shuffle(future_winnings_75_array);

    for (let i = 0; i < randomized.length; i++) {
      if ((future_games_won_75 / future_games_bet) < 0.7) {
        future_games_won_75++;
        future_winnings_75 += bet + randomized[i];
      }
    }
  }

  if (future_winnings_60_array.length) {
    let randomized = shuffle(future_winnings_60_array);

    for (let i = 0; i < randomized.length; i++) {
      if ((future_games_won_60 / future_games_bet) < 0.6) {
        future_games_won_60++;
        future_winnings_60 += bet + randomized[i];
      }
    }
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
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const toggleCalendar = (e) => {
    if (calendarOpen) {
      setCalAncor(null)
    } else {
      setCalAncor(e.currentTarget);
    }
    setCalendarOpen(!calendarOpen);
  }

  const getTabDates = () => {
    const currentDate = moment(getSelectedDate());

    let dates = [];

    if (width > 550) {
      dates.push(currentDate.subtract(2, 'day').format('YYYY-MM-DD'));
      dates.push(currentDate.add(1, 'day').format('YYYY-MM-DD'));
      dates.push(currentDate.add(1, 'day').format('YYYY-MM-DD'));
      dates.push(currentDate.add(1, 'day').format('YYYY-MM-DD'));
      dates.push(currentDate.add(1, 'day').format('YYYY-MM-DD'));
    } else {
      dates.push(currentDate.subtract(1, 'day').format('YYYY-MM-DD'));
      dates.push(currentDate.add(1, 'day').format('YYYY-MM-DD'));
      dates.push(currentDate.add(1, 'day').format('YYYY-MM-DD'));
    }

    return dates;
  }


  const updateDate = (e, value) => {
    const tabDates = getTabDates();
    getGames(tabDates[value]);
  }


  const tabDates = getTabDates();
  let tabComponents = [];
  for (let i = 0; i < tabDates.length; i++) {
    let label = tabDates[i] === moment().format('YYYY-MM-DD') ? 'Today' : moment(tabDates[i]).format('MMM Do');
    tabComponents.push(<Tab label = {label} />);
  }

  const tabIndex = tabDates.indexOf(getSelectedDate());

  let row_index = 0;

  const pickedRowsConatiner = rows_picked.sort(getComparator(order, orderBy)).slice().map((row) => {
    let teamCellStyle = {
      'cursor': 'pointer',
      'whiteSpace': 'nowrap',
    };

    if (width < 800) {
      teamCellStyle.position = 'sticky';
      teamCellStyle.left = 0;
      teamCellStyle.backgroundColor = (theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]);
    }

    return (
      <StyledTableRow
        key={row.cbb_game_id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell sx = {teamCellStyle} onClick={() => {handleGame(row.cbb_game_id)}}><div>{getTeamRank(row.game, row.pick) ? <sup style = {{'marginRight': '5px'}}>{getTeamRank(row.game, row.pick)}</sup> : ''}{getTeamName(row.game, row.pick)}</div></TableCell>
        <TableCell>{row.pick_ml}</TableCell>
        <TableCell>{getGameStartText(row)}</TableCell>
        <TableCell sx = {{'cursor': 'pointer', 'whiteSpace': 'nowrap'}} onClick={() => {handleGame(row.cbb_game_id)}}>
          <div>{getTeamRank(row.game, row.vs) ? <sup style = {{'marginRight': '5px'}}>{getTeamRank(row.game, row.vs)}</sup> : ''}{getTeamName(row.game, row.vs)}</div>
        </TableCell>
        <TableCell>{row.vs_ml}</TableCell>
        <TableCell>{row.chance}</TableCell>
        <TableCell>{row.status === 'final' ? (row.result ? <CheckCircleIcon color = 'success' /> : <CancelCircleIcon sx = {{'color': 'red'}} />) : '-'}</TableCell>
      </StyledTableRow>
    );
  });

  const otherRowsConatiner = rows_other.sort(getComparator(order, orderBy)).slice().map((row) => {
    let teamCellStyle = {
      'cursor': 'pointer',
      'whiteSpace': 'nowrap',
    };

    if (width < 800) {
      teamCellStyle.position = 'sticky';
      teamCellStyle.left = 0;
      teamCellStyle.backgroundColor = (theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]);
    }

    return (
      <StyledTableRow
        key={row.cbb_game_id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell sx = {teamCellStyle} onClick={() => {handleGame(row.cbb_game_id)}}><div>{getTeamRank(row.game, row.pick) ? <sup style = {{'marginRight': '5px'}}>{getTeamRank(row.game, row.pick)}</sup> : ''}{getTeamName(row.game, row.pick)}</div></TableCell>
        <TableCell>{row.pick_ml}</TableCell>
        <TableCell>{getGameStartText(row)}</TableCell>
        <TableCell sx = {{'cursor': 'pointer', 'whiteSpace': 'nowrap'}} onClick={() => {handleGame(row.cbb_game_id)}}>
          <div>{getTeamRank(row.game, row.vs) ? <sup style = {{'marginRight': '5px'}}>{getTeamRank(row.game, row.vs)}</sup> : ''}{getTeamName(row.game, row.vs)}</div>
        </TableCell>
        <TableCell>{row.vs_ml}</TableCell>
        <TableCell>{row.chance}</TableCell>
        <TableCell>{row.status === 'final' ? (row.result ? <CheckCircleIcon color = 'success' /> : <CancelCircleIcon sx = {{'color': 'red'}} />) : '-'}</TableCell>
      </StyledTableRow>
    );
  });


  if (date < now && games_bet > 2 && roundRobinLength) {
    for (let i = 0; i < parlay_cbb_game_ids.length; i++) {
      let game = games[parlay_cbb_game_ids[i]];

      const row = {
        'cbb_game_id': game.cbb_game_id,
        'game': game,
        'start_timestamp': game.start_timestamp,
        'pick': game.home_team_rating >= game.away_team_rating ? 'home' : 'away',
        'pick_ml': game.home_team_rating >= game.away_team_rating ? getPreOdds(game, 'home') : getPreOdds(game, 'away'),
        'vs': game.home_team_rating >= game.away_team_rating ? 'away' : 'home', // the opposite of the pick :)
        'vs_ml': game.home_team_rating >= game.away_team_rating ? getPreOdds(game, 'away') : getPreOdds(game, 'home'),
        'chance': parseFloat((game.home_team_rating >= game.away_team_rating ? game.home_team_rating : game.away_team_rating) * 100).toFixed(0),
        'result': (game.home_team_rating >= game.away_team_rating && game.home_score > game.away_score) || (game.away_team_rating >= game.home_team_rating && game.home_score < game.away_score),
        'status': game.status,
      };

      rows_parlay.push(row);
    }
  } else if (date === now && future_games_bet > 2 && roundRobinLength) {
    for (let i = 0; i < future_parlay_cbb_game_ids.length; i++) {
      let game = games[future_parlay_cbb_game_ids[i]];

      const row = {
        'cbb_game_id': game.cbb_game_id,
        'game': game,
        'start_timestamp': game.start_timestamp,
        'pick': game.home_team_rating >= game.away_team_rating ? 'home' : 'away',
        'pick_ml': game.home_team_rating >= game.away_team_rating ? getPreOdds(game, 'home') : getPreOdds(game, 'away'),
        'vs': game.home_team_rating >= game.away_team_rating ? 'away' : 'home', // the opposite of the pick :)
        'vs_ml': game.home_team_rating >= game.away_team_rating ? getPreOdds(game, 'away') : getPreOdds(game, 'home'),
        'chance': parseFloat((game.home_team_rating >= game.away_team_rating ? game.home_team_rating : game.away_team_rating) * 100).toFixed(0),
        'result': (game.home_team_rating >= game.away_team_rating && game.home_score > game.away_score) || (game.away_team_rating >= game.home_team_rating && game.home_score < game.away_score),
        'status': game.status,
      };

      rows_parlay.push(row);
    }
  }

  const parleyRowsConatiner = rows_parlay.sort(getComparator(order, orderBy)).slice().map((row) => {
    let teamCellStyle = {
      'cursor': 'pointer',
      'whiteSpace': 'nowrap',
    };

    if (width < 800) {
      teamCellStyle.position = 'sticky';
      teamCellStyle.left = 0;
      teamCellStyle.backgroundColor = (theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]);
    }

    return (
      <StyledTableRow
        key={row.cbb_game_id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell sx = {teamCellStyle} onClick={() => {handleGame(row.cbb_game_id)}}><div>{getTeamRank(row.game, row.pick) ? <sup style = {{'marginRight': '5px'}}>{getTeamRank(row.game, row.pick)}</sup> : ''}{getTeamName(row.game, row.pick)}</div></TableCell>
        <TableCell>{row.pick_ml}</TableCell>
        <TableCell>{getGameStartText(row)}</TableCell>
        <TableCell sx = {{'cursor': 'pointer', 'whiteSpace': 'nowrap'}} onClick={() => {handleGame(row.cbb_game_id)}}>
          <div>{getTeamRank(row.game, row.vs) ? <sup style = {{'marginRight': '5px'}}>{getTeamRank(row.game, row.vs)}</sup> : ''}{getTeamName(row.game, row.vs)}</div>
        </TableCell>
        <TableCell>{row.vs_ml}</TableCell>
        <TableCell>{row.chance}</TableCell>
        <TableCell>{row.status === 'final' ? (row.result ? <CheckCircleIcon color = 'success' /> : <CancelCircleIcon sx = {{'color': 'red'}} />) : '-'}</TableCell>
      </StyledTableRow>
    );
  });


  const getTable = (rowContainers) => {
    return (
      <TableContainer component={Paper}>
        <Table size = 'small'>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <StyledTableHeadCell
                  sx = {headCell.id == 'pick' ? {'position': 'sticky', 'left': 0, 'z-index': 3} : {}}
                  key={headCell.id}
                  align={'left'}
                  padding={headCell.padding}
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
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowContainers}
          </TableBody>
        </Table>
    </TableContainer>
    );
  };

  


  let marginTop = '64px';

  if (width < 600) {
    marginTop = '56px';
  }

  let betting_contents = [];

  const bettingInput = <TextField style = {{'margin': 10}} id="bet" label="Bet" variant="standard" value={inputBet} onChange = {(e) => {setBet(e.target.value)}} />;
  const oddsMinInput = <TextField style = {{'margin': 10}} id="oddsMin" label="Odd Min" variant="standard" value={inputOddsMin} onChange = {(e) => {setOddsMin(e.target.value)}} />;
  const oddsMaxInput = <TextField style = {{'margin': 10}} id="oddsmax" label="Odds Max" variant="standard" value={inputOddsMax} onChange = {(e) => {setOddsMax(e.target.value)}} />;
  const roundRobinInput = <TextField style = {{'margin': 10}} id="roundRobin" label="Round robin parlay" variant="standard" value={inputRoundRobin} onChange = {(e) => {setRoundRobin(e.target.value)}} />;

  if (total_bet || date < now) {
    betting_contents.push(bettingInput);
    betting_contents.push(oddsMinInput);
    betting_contents.push(oddsMaxInput);
    betting_contents.push(<Typography variant = 'subtitle1' color = 'text.secondary'>Hypothetical pre-game ML betting ${bet} on each pick with odds greater than {oddsMin} and less than {oddsMax}</Typography>);

    if (total_bet) {
      betting_contents.push(<Typography variant = 'body1'>Total bet: ${total_bet} ({games_bet} games)</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Won: ${parseFloat(winnings).toFixed(2)} ({wins}  ({((wins / games_bet) * 100).toFixed(2)}%))</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Net: ${parseFloat(winnings - total_bet).toFixed(2)} ({total_bet > 0 ? parseFloat(((winnings - total_bet) / total_bet) * 100).toFixed(2) : 0}%)</Typography>);
    }

    betting_contents.push(<Typography variant = 'subtitle1' color = 'text.secondary'>A round robin bet creates a parlay for every possible combination of games based on the input below. It will use the inputs above as a base for games to select. Must have at least 2 eligible games. Ex: if there are 10 games total and you select 9 games, it would create 10 parlays of 9 games each.</Typography>);
    betting_contents.push(roundRobinInput);
    if (games_bet > 2 && roundRobinLength) {
      betting_contents.push(<Typography variant = 'body1'>Total bet: ${roundRobinBetTotal} ({roundRobinBetCombos} parlays)</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Won: ${parseFloat(roundRobinWonTotal).toFixed(2)} ({roundRobinWins}  ({((roundRobinWins / roundRobinBetCombos) * 100).toFixed(2)}%))</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Net: ${parseFloat(roundRobinWonTotal - roundRobinBetTotal).toFixed(2)} ({roundRobinBetTotal > 0 ? parseFloat(((roundRobinWonTotal - roundRobinBetTotal) / roundRobinBetTotal) * 100).toFixed(2) : 0}%)</Typography>);
    }
  } else if (date == now) {
    betting_contents.push(bettingInput);
    betting_contents.push(oddsMinInput);
    betting_contents.push(oddsMaxInput);
    betting_contents.push(<Typography variant = 'subtitle1' color = 'text.secondary'>Future pre-game ML betting ${bet} on each pick with odds greater than {oddsMin} and less than {oddsMax}</Typography>);

    if (future_total_bet) {
      betting_contents.push(<Typography variant = 'body1'>Total bet: ${future_total_bet} ({future_games_bet} games)</Typography>);
      betting_contents.push(<Typography variant = 'subtitle2' color = 'text.secondary' style = {{'marginTop': '10px'}}>100% win rate</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Won: ${parseFloat(future_winnings_100).toFixed(2)} ({future_games_bet} games) (100%)</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Net: ${parseFloat(future_winnings_100 - future_total_bet).toFixed(2)} ({future_total_bet > 0 ? parseFloat(((future_winnings_100 - future_total_bet) / future_total_bet) * 100).toFixed(2) : 0}%)</Typography>);
      betting_contents.push(<Typography variant = 'subtitle2' color = 'text.secondary' style = {{'marginTop': '10px'}}>Random ~75% win rate</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Won: ${parseFloat(future_winnings_75).toFixed(2)} ({future_games_won_75} games) ({((future_games_won_75 / future_games_bet) * 100).toFixed(2)}%)</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Net: ${parseFloat(future_winnings_75 - future_total_bet).toFixed(2)} ({future_total_bet > 0 ? parseFloat(((future_winnings_75 - future_total_bet) / future_total_bet) * 100).toFixed(2) : 0}%)</Typography>);
      betting_contents.push(<Typography variant = 'subtitle2' color = 'text.secondary' style = {{'marginTop': '10px'}}>Random ~60% win rate</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Won: ${parseFloat(future_winnings_60).toFixed(2)} ({future_games_won_60} games) ({((future_games_won_60 / future_games_bet) * 100).toFixed(2)}%)</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Net: ${parseFloat(future_winnings_60 - future_total_bet).toFixed(2)} ({future_total_bet > 0 ? parseFloat(((future_winnings_60 - future_total_bet) / future_total_bet) * 100).toFixed(2) : 0}%)</Typography>);
    }

    betting_contents.push(<Typography variant = 'subtitle1' color = 'text.secondary'>A round robin bet creates a parlay for every possible combination of games based on the input below. It will use the inputs above as a base for games to select. Must have at least 2 eligible games. Ex: if there are 10 games total and you select 9 games, it would create 10 parlays of 9 games each.</Typography>);
    betting_contents.push(roundRobinInput);

    if (future_games_bet > 2 && roundRobinLength) {
      betting_contents.push(<Typography variant = 'subtitle2' color = 'text.secondary' style = {{'marginTop': '10px'}}>100% win rate</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Total bet: ${future_roundRobinBetTotal} ({future_roundRobinBetCombos} parlays)</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Won: ${parseFloat(future_roundRobinWonTotal_100).toFixed(2)} ({future_roundRobinWins_100}  ({((future_roundRobinWins_100 / future_roundRobinBetCombos) * 100).toFixed(2)}%))</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Net: ${parseFloat(future_roundRobinWonTotal_100 - future_roundRobinBetTotal).toFixed(2)} ({future_roundRobinBetTotal > 0 ? parseFloat(((future_roundRobinWonTotal_100 - future_roundRobinBetTotal) / future_roundRobinBetTotal) * 100).toFixed(2) : 0}%)</Typography>);

      betting_contents.push(<Typography variant = 'subtitle2' color = 'text.secondary' style = {{'marginTop': '10px'}}>75% win rate</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Total bet: ${future_roundRobinBetTotal} ({future_roundRobinBetCombos} parlays)</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Won: ${parseFloat(future_roundRobinWonTotal_75).toFixed(2)} ({future_roundRobinWins_75}  ({((future_roundRobinWins_75 / future_roundRobinBetCombos) * 100).toFixed(2)}%))</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Net: ${parseFloat(future_roundRobinWonTotal_75 - future_roundRobinBetTotal).toFixed(2)} ({future_roundRobinBetTotal > 0 ? parseFloat(((future_roundRobinWonTotal_75 - future_roundRobinBetTotal) / future_roundRobinBetTotal) * 100).toFixed(2) : 0}%)</Typography>);

      betting_contents.push(<Typography variant = 'subtitle2' color = 'text.secondary' style = {{'marginTop': '10px'}}>60% win rate</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Total bet: ${future_roundRobinBetTotal} ({future_roundRobinBetCombos} parlays)</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Won: ${parseFloat(future_roundRobinWonTotal_60).toFixed(2)} ({future_roundRobinWins_60}  ({((future_roundRobinWins_60 / future_roundRobinBetCombos) * 100).toFixed(2)}%))</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Net: ${parseFloat(future_roundRobinWonTotal_60 - future_roundRobinBetTotal).toFixed(2)} ({future_roundRobinBetTotal > 0 ? parseFloat(((future_roundRobinWonTotal_60 - future_roundRobinBetTotal) / future_roundRobinBetTotal) * 100).toFixed(2) : 0}%)</Typography>);
    }
  } else {
    betting_contents.push(<Typography variant = 'subtitle1' style = {{'textAlign': 'center'}} color = 'text.secondary'>No betting info available yet... come back soon!</Typography>);
    // if (date > now) {
    //   betting_contents.push(<Typography variant = 'caption' style = {{'textAlign': 'center'}} color = 'text.secondary'>Picks for games greater than today may change</Typography>);
    // }
  }

  return (
    <div style = {{'padding': '56px 20px 0px 20px'}}>
      <div>
        <AppBar position="fixed" style = {{'marginTop': marginTop, 'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light}}>
          <Tabs value={tabIndex} onChange={updateDate} centered indicatorColor="secondary" textColor="inherit">
            {tabComponents}
            <IconButton  onClick={toggleCalendar} color="inherit">
              <CalendarIcon />
            </IconButton>
            <Popover
              open={calendarOpen}
              anchorEl={calAncor}
              onClose={toggleCalendar}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  openTo="day"
                  value={getSelectedDate}
                  onChange={(momentObj) => {
                    getGames(momentObj.format('YYYY-MM-DD'));
                    toggleCalendar();
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Popover>
          </Tabs>
        </AppBar>
      </div>
      {
        spin ? <div style = {{'display': 'flex', 'justifyContent': 'center'}}><CircularProgress /></div> :
        <div>
          <Typography variant="h5">Betting calculator</Typography>
          <Paper elevation={3} style = {{'padding': '10px', 'margin': '0px 0px 10px 0px'}}>
            {betting_contents}
          </Paper>
          {total_final ? <div>Total win rate: {Math.round((correct / total_final) * 100)}% {correct} / {total_final}</div> : ''}
          {rows_parlay.length ? <Typography style = {{'margin': '10px 0px'}} variant="h5">Parley games</Typography> : ''}
          {rows_parlay.length ? getTable(parleyRowsConatiner) : ''}
          {rows_picked.length ? <Typography style = {{'margin': '10px 0px'}} variant="h5">Games bet</Typography> : ''}
          {rows_picked.length ? getTable(pickedRowsConatiner) : ''}
          {rows_other.length ? <Typography style = {{'margin': '10px 0px'}} variant="h5">Other games</Typography> : ''}
          {rows_other.length ? getTable(otherRowsConatiner) : ''}
        </div>
      }
    </div>
  );
}


export default Picks;
