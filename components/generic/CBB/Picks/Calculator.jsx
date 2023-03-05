import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';

const Calculator = (props) => {
  const self = this;

    const [inputBet, setBet] = useState(10);
  const [inputOddsMin, setOddsMin] = useState(-1500);
  const [inputOddsMax, setOddsMax] = useState(-150);
  const [inputRoundRobin, setRoundRobin] = useState(0);
  const [inputPercentage, setPercentage] = useState(75);


  useEffect(() => {
    setFirstRender(false);
    setRankDisplay(localStorage.getItem('CBB.RANKPICKER.DEFAULT') ? JSON.parse(localStorage.getItem('CBB.RANKPICKER.DEFAULT')) : 'composite_rank');
  }, []);

  if (firstRender) {
    return (<div style = {{'display': 'flex', 'justifyContent': 'center'}}><CircularProgress /></div>);
  }


  const bet = inputBet ? +inputBet : 0;
  const oddsMin = inputOddsMin ? +inputOddsMin : 0;
  const oddsMax = inputOddsMax ? +inputOddsMax : 0;
  const roundRobinLength = inputRoundRobin ? +inputRoundRobin : 0;
  const winChance = inputPercentage ? +inputPercentage : 0;


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

  let betting_contents = [];

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
    betting_contents.push(percentageInput);
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
    <div>
    </div>
  );
}

export default Calculator;