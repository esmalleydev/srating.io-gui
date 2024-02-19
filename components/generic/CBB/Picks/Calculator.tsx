'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { styled, useTheme } from '@mui/material/styles';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import moment from 'moment';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { SortDirection } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import { visuallyHidden } from '@mui/utils';


import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelCircleIcon from '@mui/icons-material/Cancel';

// import CompareStatistic from '../../CompareStatistic';
import HelperCBB from '@/components/helpers/CBB';
import utilsArrayifer from  '@/components/utils/Arrayifer.js';
import utilsSorter from  '@/components/utils/Sorter.js';


import { useAppSelector } from '@/redux/hooks';
import { Game } from '@/components/generic/types';
import { CircularProgress } from '@mui/material';
const Arrayifer = new utilsArrayifer();
const Sorter = new utilsSorter();

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

// todo this somestimes triggers a double load in PicksLoader.... something with having const picksLoading = useAppSelector(state => state.picksReducer.picksLoading);, makes it double render
  
const Calculator = ({ cbb_games, date}) => {
  const router = useRouter();
  const theme = useTheme();
  const { width } = useWindowDimensions() as Dimensions;

  const picksData = useAppSelector(state => state.picksReducer.picks);
  const picksLoading = useAppSelector(state => state.picksReducer.picksLoading);
  const displayRank = useAppSelector(state => state.displayReducer.rank);
  
  const [now, setNow] = useState(moment().format('YYYY-MM-DD'));
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('start_timestamp');
  const [inputBet, setBet] = useState<string | number>(10);
  const [inputOddsMin, setOddsMin] = useState<string | number>(-2000);
  const [inputOddsMax, setOddsMax] = useState<string | number>(500);
  const [inputRoundRobin, setRoundRobin] = useState<string | number>(0);
  const [inputPercentage, setPercentage] = useState<string | number>(75);

  if (picksLoading) {
    return (<div style={{'textAlign': 'center'}}><CircularProgress /></div>);
  }

  for (let cbb_game_id in picksData) {
    if (cbb_game_id in cbb_games) {
      cbb_games[cbb_game_id].home_team_rating = picksData[cbb_game_id].home_team_rating;
      cbb_games[cbb_game_id].away_team_rating = picksData[cbb_game_id].away_team_rating;
    }
  }
  

  const bet = inputBet ? +inputBet : 0;
  const oddsMin = inputOddsMin ? +inputOddsMin : 0;
  const oddsMax = inputOddsMax ? +inputOddsMax : 0;
  const roundRobinLength = inputRoundRobin ? +inputRoundRobin : 0;
  const winChance = inputPercentage ? +inputPercentage : 0;



  const convertAmericanToDecimal = (odds) => {
    if (odds > 0) {
      return 1 + (odds / 100);
    }
    return 1 - (100 / odds);
  };


  const handleGame = (cbb_game_id) => {
    router.push('/cbb/games/' + cbb_game_id);
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
  let future_winnings_75_array: number[] = [];
  let future_games_won_60 = 0;
  let future_winnings_60 = 0;
  let future_winnings_60_array: number[] = [];

  type parlayOdds = {
    [cbb_game_id: string] : {
      odds: number;
      cbb_game_id: string;
    };
  }
  let cbb_game_id_x_parlay_odds: parlayOdds = {};
  let future_cbb_game_id_x_parlay_odds: parlayOdds = {};
  let rows_picked: tableRow[] = [];
  let rows_other: tableRow[] = [];
  let rows_parlay: tableRow[] = [];


  type tableRow = {
    cbb_game_id: string;
    game: Game;
    start_timestamp: number;
    pick: string;
    pick_ml: string;
    vs: string;
    vs_ml: string;
    chance: string;
    result: boolean;
    status: string;
  };

  /**
   * Get a common, formatted row for our tables
   * @param {Object} cbb_game 
   * @return Object
   */
  const getFormattedGameRow = (cbb_game: Game) => {
    const CBB = new HelperCBB({
      'cbb_game': cbb_game,
    });

    const row: tableRow = {
      'cbb_game_id': cbb_game.cbb_game_id,
      'game': cbb_game,
      'start_timestamp': cbb_game.start_timestamp,
      'pick': cbb_game.home_team_rating >= cbb_game.away_team_rating ? 'home' : 'away',
      'pick_ml': cbb_game.home_team_rating >= cbb_game.away_team_rating ? CBB.getPreML('home') : CBB.getPreML('away'),
      'vs': cbb_game.home_team_rating >= cbb_game.away_team_rating ? 'away' : 'home', // the opposite of the pick :)
      'vs_ml': cbb_game.home_team_rating >= cbb_game.away_team_rating ? CBB.getPreML('away') : CBB.getPreML('home'),
      'chance': parseFloat(((cbb_game.home_team_rating >= cbb_game.away_team_rating ? cbb_game.home_team_rating : cbb_game.away_team_rating) * 100).toString()).toFixed(0),
      'result': (cbb_game.home_team_rating >= cbb_game.away_team_rating && cbb_game.home_score > cbb_game.away_score) || (cbb_game.away_team_rating >= cbb_game.home_team_rating && cbb_game.home_score < cbb_game.away_score),
      'status': cbb_game.status,
    };

    return row;
  };

  for (let cbb_game_id in cbb_games) {
    let game = cbb_games[cbb_game_id];


    const row = getFormattedGameRow(game);

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
          odds <= oddsMax &&
          (game[pick + '_team_rating'] * 100) >= winChance
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
        odds <= oddsMax &&
        (game[pick + '_team_rating'] * 100) >= winChance
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
  let parlay_cbb_game_ids: string[] = [];

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
    const combinations = Arrayifer.getCombinations(parlay_cbb_game_ids, parlay_cbb_game_ids.length, roundRobinLength);

    roundRobinBetCombos = combinations.length;
    roundRobinBetTotal = combinations.length * bet;

    for (let i = 0; i < combinations.length; i++) {
      let parlay_won = true;
      let parlay_odds: number | null = null;
      for (let j = 0; j < combinations[i].length; j++) {
        let game = cbb_games[combinations[i][j]];
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

      if (parlay_won && parlay_odds !== null) {
        roundRobinWins++;
        roundRobinWonTotal += (parlay_odds * bet);
      }
    }
  }

  let future_parlay_cbb_game_ids: string[] = [];

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

  let randomized_60 = Arrayifer.shuffle(future_parlay_cbb_game_ids);

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

  let randomized_75 = Arrayifer.shuffle(future_parlay_cbb_game_ids);
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
    const combinations = Arrayifer.getCombinations(future_parlay_cbb_game_ids, future_parlay_cbb_game_ids.length, roundRobinLength);

    future_roundRobinBetCombos = combinations.length;
    future_roundRobinBetTotal = combinations.length * bet;

    for (let i = 0; i < combinations.length; i++) {
      let parlay_won_75 = true;
      let parlay_won_60 = true;
      let parlay_odds: number | null = null;
      for (let j = 0; j < combinations[i].length; j++) {
        let game = cbb_games[combinations[i][j]];
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

      if (parlay_won_75 && parlay_odds !== null) {
        future_roundRobinWins_75++;
        future_roundRobinWonTotal_75 += (parlay_odds * bet);
      }

      if (parlay_won_60 && parlay_odds !== null) {
        future_roundRobinWins_60++;
        future_roundRobinWonTotal_60 += (parlay_odds * bet);
      }

      if (parlay_odds !== null) {
        future_roundRobinWins_100++;
        future_roundRobinWonTotal_100 += (parlay_odds * bet);
      }
    }
  }


  if (future_winnings_75_array.length) {
    let randomized = Arrayifer.shuffle(future_winnings_75_array);

    for (let i = 0; i < randomized.length; i++) {
      if ((future_games_won_75 / future_games_bet) < 0.7) {
        future_games_won_75++;
        future_winnings_75 += bet + randomized[i];
      }
    }
  }

  if (future_winnings_60_array.length) {
    let randomized = Arrayifer.shuffle(future_winnings_60_array);

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


  let row_index = 0;

  const getStyledTableRow = (row) => {
    let teamCellStyle: React.CSSProperties = {
      'cursor': 'pointer',
      'whiteSpace': 'nowrap',
    };

    if (width < 800) {
      teamCellStyle.position = 'sticky';
      teamCellStyle.left = 0;
      teamCellStyle.backgroundColor = (theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]);
    }

    const CBB = new HelperCBB({
      'cbb_game': row.game,
    });

    const pickRank = CBB.getTeamRank(row.pick, displayRank);
    const pickName = CBB.getTeamName(row.pick);
    const vsRank = CBB.getTeamRank(row.vs, displayRank);
    const vsName = CBB.getTeamName(row.vs);

    return (
      <StyledTableRow
        key={row.cbb_game_id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell sx = {teamCellStyle} onClick={() => {handleGame(row.cbb_game_id)}}><div>{pickRank ? <sup style = {{'marginRight': '5px'}}>{pickRank}</sup> : ''}{pickName}</div></TableCell>
        <TableCell>{row.pick_ml}</TableCell>
        <TableCell>{CBB.getStartTime()}</TableCell>
        <TableCell sx = {{'cursor': 'pointer', 'whiteSpace': 'nowrap'}} onClick={() => {handleGame(row.cbb_game_id)}}>
          <div>{vsRank ? <sup style = {{'marginRight': '5px'}}>{vsRank}</sup> : ''}{vsName}</div>
        </TableCell>
        <TableCell>{row.vs_ml}</TableCell>
        <TableCell>{row.chance}</TableCell>
        <TableCell>{row.status === 'final' ? (row.result ? <CheckCircleIcon color = 'success' /> : <CancelCircleIcon sx = {{'color': 'red'}} />) : '-'}</TableCell>
      </StyledTableRow>
    );
  };

  const pickedRowsConatiner = rows_picked.sort(Sorter.getComparator(order, orderBy)).slice().map((row) => getStyledTableRow(row));

  const otherRowsConatiner = rows_other.sort(Sorter.getComparator(order, orderBy)).slice().map((row) => getStyledTableRow(row));


  if (date < now && games_bet > 2 && roundRobinLength) {
    for (let i = 0; i < parlay_cbb_game_ids.length; i++) {
      let game = cbb_games[parlay_cbb_game_ids[i]];

      const row = getFormattedGameRow(game);

      rows_parlay.push(row);
    }
  } else if (date === now && future_games_bet > 2 && roundRobinLength) {
    for (let i = 0; i < future_parlay_cbb_game_ids.length; i++) {
      let game = cbb_games[future_parlay_cbb_game_ids[i]];

      const row = getFormattedGameRow(game);

      rows_parlay.push(row);
    }
  }

  const parleyRowsConatiner = rows_parlay.sort(Sorter.getComparator(order, orderBy)).slice().map((row) => getStyledTableRow(row));


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
                  style = {{'padding': headCell.padding}}
                  sortDirection={orderBy === headCell.id ? (order as SortDirection) : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? (order as 'asc' | 'desc') : 'asc'}
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

  


  let betting_contents: React.JSX.Element[] = [];

  const bettingInput = <TextField style = {{'margin': 10}} id="bet" label="Bet" variant="standard" value={inputBet} onChange = {(e) => {setBet(e.target.value)}} />;
  const oddsMinInput = <TextField style = {{'margin': 10}} id="oddsMin" label="Odd Min" variant="standard" value={inputOddsMin} onChange = {(e) => {setOddsMin(e.target.value)}} />;
  const oddsMaxInput = <TextField style = {{'margin': 10}} id="oddsmax" label="Odds Max" variant="standard" value={inputOddsMax} onChange = {(e) => {setOddsMax(e.target.value)}} />;
  const percentageInput = <TextField style = {{'margin': 10}} id="precentage" label="Win chance %" variant="standard" value={inputPercentage} onChange = {(e) => {setPercentage(e.target.value)}} />;
  const roundRobinInput = <TextField style = {{'margin': 10}} id="roundRobin" label="Round robin parlay" variant="standard" value={inputRoundRobin} onChange = {(e) => {setRoundRobin(e.target.value)}} />;

  if (total_bet || date < now) {
    betting_contents.push(bettingInput);
    betting_contents.push(oddsMinInput);
    betting_contents.push(oddsMaxInput);
    betting_contents.push(percentageInput);
    betting_contents.push(<Typography variant = 'subtitle1' color = 'text.secondary'>Hypothetical pre-game ML betting ${bet} on each pick with odds greater than {oddsMin} and less than {oddsMax}</Typography>);

    if (total_bet) {
      betting_contents.push(<Typography variant = 'body1'>Total bet: ${total_bet} ({games_bet} games)</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Won: ${parseFloat(winnings.toString()).toFixed(2)} ({wins}  ({((wins / games_bet) * 100).toFixed(2)}%))</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Net: ${parseFloat((winnings - total_bet).toString()).toFixed(2)} ({total_bet > 0 ? parseFloat((((winnings - total_bet) / total_bet) * 100).toString()).toFixed(2) : 0}%)</Typography>);
    }

    betting_contents.push(<Typography variant = 'subtitle1' color = 'text.secondary'>A round robin bet creates a parlay for every possible combination of games based on the input below. It will use the inputs above as a base for games to select. Must have at least 2 eligible games. Ex: if there are 10 games total and you select 9 games, it would create 10 parlays of 9 games each.</Typography>);
    betting_contents.push(roundRobinInput);
    if (games_bet > 2 && roundRobinLength) {
      betting_contents.push(<Typography variant = 'body1'>Total bet: ${roundRobinBetTotal} ({roundRobinBetCombos} parlays)</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Won: ${parseFloat(roundRobinWonTotal.toString()).toFixed(2)} ({roundRobinWins}  ({((roundRobinWins / roundRobinBetCombos) * 100).toFixed(2)}%))</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Net: ${parseFloat((roundRobinWonTotal - roundRobinBetTotal).toString()).toFixed(2)} ({roundRobinBetTotal > 0 ? parseFloat((((roundRobinWonTotal - roundRobinBetTotal) / roundRobinBetTotal) * 100).toString()).toFixed(2) : 0}%)</Typography>);
    }
  } else if (date == now) {
    betting_contents.push(bettingInput);
    betting_contents.push(oddsMinInput);
    betting_contents.push(oddsMaxInput);
    betting_contents.push(percentageInput);
    betting_contents.push(<Typography variant = 'subtitle1' color = 'text.secondary'>Future pre-game ML betting ${bet} on each pick with odds greater than {oddsMin} and less than {oddsMax}</Typography>);

    if (future_total_bet) {
      betting_contents.push(<Typography variant = 'body1'>Total bet: ${future_total_bet} ({future_games_bet} games)</Typography>);
      betting_contents.push(<Typography variant = 'subtitle2' color = 'text.secondary' style = {{'marginTop': '10px'}}>100% win rate</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Won: ${parseFloat(future_winnings_100.toString()).toFixed(2)} ({future_games_bet} games) (100%)</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Net: ${parseFloat((future_winnings_100 - future_total_bet).toString()).toFixed(2)} ({future_total_bet > 0 ? parseFloat((((future_winnings_100 - future_total_bet) / future_total_bet) * 100).toString()).toFixed(2) : 0}%)</Typography>);
      betting_contents.push(<Typography variant = 'subtitle2' color = 'text.secondary' style = {{'marginTop': '10px'}}>Random ~75% win rate</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Won: ${parseFloat(future_winnings_75.toString()).toFixed(2)} ({future_games_won_75} games) ({((future_games_won_75 / future_games_bet) * 100).toFixed(2)}%)</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Net: ${parseFloat((future_winnings_75 - future_total_bet).toString()).toFixed(2)} ({future_total_bet > 0 ? parseFloat((((future_winnings_75 - future_total_bet) / future_total_bet) * 100).toString()).toFixed(2) : 0}%)</Typography>);
      betting_contents.push(<Typography variant = 'subtitle2' color = 'text.secondary' style = {{'marginTop': '10px'}}>Random ~60% win rate</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Won: ${parseFloat(future_winnings_60.toString()).toFixed(2)} ({future_games_won_60} games) ({((future_games_won_60 / future_games_bet) * 100).toFixed(2)}%)</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Net: ${parseFloat((future_winnings_60 - future_total_bet).toString()).toFixed(2)} ({future_total_bet > 0 ? parseFloat((((future_winnings_60 - future_total_bet) / future_total_bet) * 100).toString()).toFixed(2) : 0}%)</Typography>);
    }

    betting_contents.push(<Typography variant = 'subtitle1' color = 'text.secondary'>A round robin bet creates a parlay for every possible combination of games based on the input below. It will use the inputs above as a base for games to select. Must have at least 2 eligible games. Ex: if there are 10 games total and you select 9 games, it would create 10 parlays of 9 games each.</Typography>);
    betting_contents.push(roundRobinInput);

    if (future_games_bet > 2 && roundRobinLength) {
      betting_contents.push(<Typography variant = 'subtitle2' color = 'text.secondary' style = {{'marginTop': '10px'}}>100% win rate</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Total bet: ${future_roundRobinBetTotal} ({future_roundRobinBetCombos} parlays)</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Won: ${parseFloat(future_roundRobinWonTotal_100.toString()).toFixed(2)} ({future_roundRobinWins_100}  ({((future_roundRobinWins_100 / future_roundRobinBetCombos) * 100).toFixed(2)}%))</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Net: ${parseFloat((future_roundRobinWonTotal_100 - future_roundRobinBetTotal).toString()).toFixed(2)} ({future_roundRobinBetTotal > 0 ? parseFloat((((future_roundRobinWonTotal_100 - future_roundRobinBetTotal) / future_roundRobinBetTotal) * 100).toString()).toFixed(2) : 0}%)</Typography>);

      betting_contents.push(<Typography variant = 'subtitle2' color = 'text.secondary' style = {{'marginTop': '10px'}}>75% win rate</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Total bet: ${future_roundRobinBetTotal} ({future_roundRobinBetCombos} parlays)</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Won: ${parseFloat(future_roundRobinWonTotal_75.toString()).toFixed(2)} ({future_roundRobinWins_75}  ({((future_roundRobinWins_75 / future_roundRobinBetCombos) * 100).toFixed(2)}%))</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Net: ${parseFloat((future_roundRobinWonTotal_75 - future_roundRobinBetTotal).toString()).toFixed(2)} ({future_roundRobinBetTotal > 0 ? parseFloat((((future_roundRobinWonTotal_75 - future_roundRobinBetTotal) / future_roundRobinBetTotal) * 100).toString()).toFixed(2) : 0}%)</Typography>);

      betting_contents.push(<Typography variant = 'subtitle2' color = 'text.secondary' style = {{'marginTop': '10px'}}>60% win rate</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Total bet: ${future_roundRobinBetTotal} ({future_roundRobinBetCombos} parlays)</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Won: ${parseFloat(future_roundRobinWonTotal_60.toString()).toFixed(2)} ({future_roundRobinWins_60}  ({((future_roundRobinWins_60 / future_roundRobinBetCombos) * 100).toFixed(2)}%))</Typography>);
      betting_contents.push(<Typography variant = 'body1'>Net: ${parseFloat((future_roundRobinWonTotal_60 - future_roundRobinBetTotal).toString()).toFixed(2)} ({future_roundRobinBetTotal > 0 ? parseFloat((((future_roundRobinWonTotal_60 - future_roundRobinBetTotal) / future_roundRobinBetTotal) * 100).toString()).toFixed(2) : 0}%)</Typography>);
    }
  } else {
    betting_contents.push(<Typography variant = 'subtitle1' style = {{'textAlign': 'center'}} color = 'text.secondary'>No betting info available yet... come back soon!</Typography>);
    // if (date > now) {
    //   betting_contents.push(<Typography variant = 'caption' style = {{'textAlign': 'center'}} color = 'text.secondary'>Picks for games greater than today may change</Typography>);
    // }
  }



  return (
    <>
      {
        picksLoading ?
          <Paper elevation = {3} style = {{'padding': 10}}>
            <div>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
            </div>
          </Paper>
        :
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
    </>
  );
}



export default Calculator;