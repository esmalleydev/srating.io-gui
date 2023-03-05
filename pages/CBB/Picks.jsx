import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useWindowDimensions from '../../components/hooks/useWindowDimensions';

import CircularProgress from '@mui/material/CircularProgress';
import { styled, alpha, useTheme } from '@mui/material/styles';

import Typography from '@mui/material/Typography';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

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

import PicksComponent from '../../components/generic/CBB/Picks/Picks.jsx';
import Calculator from '../../components/generic/CBB/Picks/Calculator.jsx';
import Stats from '../../components/generic/CBB/Picks/Stats.jsx';

import Api from '../../components/Api.jsx';
const api = new Api();




const Picks = (props) => {
  const self = this;

  const theme = useTheme();
  const { height, width } = useWindowDimensions();

  const [request, setRequest] = useState(false);
  const [spin, setSpin] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calAncor, setCalAncor] = useState(null);
  const [date, setDate] = useState();
  const [now, setNow] = useState(moment().format('YYYY-MM-DD'));
  const [games, setGames] = useState({});

  let marginTop = '64px';

  if (width < 600) {
    marginTop = '56px';
  }

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

  /*
  const router = useRouter();
  const theme = useTheme();
  const { height, width } = useWindowDimensions();


  const [firstRender, setFirstRender] = useState(true);
  const [request, setRequest] = useState(false);
  const [spin, setSpin] = useState(true);
  const [date, setDate] = useState();
  const [now, setNow] = useState(moment().format('YYYY-MM-DD'));
  const [games, setGames] = useState({});
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calAncor, setCalAncor] = useState(null);
  const [rankDisplay, setRankDisplay] = useState('composite_rank');




  const handleGame = (cbb_game_id) => {
    router.push('/CBB/Games/' + cbb_game_id);
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
      } else if (game.teams[game[side + '_team_id']].alt_name) {
        name = game.teams[game[side + '_team_id']].alt_name;
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



  

  return (
    <div style = {{'padding': '56px 20px 0px 20px'}}>
      <Head>
        <title>sRating | College basketball betting picks</title>
        <meta name = 'description' content = 'Best picks for each college basketball game based on statistics' key = 'desc'/>
        <meta property="og:title" content=">sRating.io college basketball picks" />
        <meta property="og:description" content="Best picks for each college basketball game based on statistics" />
      </Head>
      <div>
        <AppBar position="fixed" style = {{'marginTop': marginTop, 'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light}}>
          <Toolbar variant = 'dense'>
            <Tabs value={tabIndex} onChange={updateDate} variant="scrollable" scrollButtons = {true} allowScrollButtonsMobile = {false} indicatorColor="secondary" textColor="inherit">
              {tabComponents}
            </Tabs>
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
          </Toolbar>
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
  */
 
  let tabOptions = {
    'picks': 'Picks',
    'calculator': 'Calculator',
    'stats': 'Stats',
  };

  let tabOrder = ['picks', 'calculator', 'stats'];


  let tabs = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {tabOptions[tabOrder[i]]} />);
  }

  const selectedTab = tabOrder[tabIndex];

  const handleTabClick = (e, value) => {
    setTabIndex(value);
  };

  const getSelectedDate = () => {
    return date || now;
  }

  const toggleCalendar = (e) => {
    if (calendarOpen) {
      setCalAncor(null)
    } else {
      setCalAncor(e.currentTarget);
    }
    setCalendarOpen(!calendarOpen);
  }

  const getRangeDates = (start, end)  => {
    let dates = [];

    for (let date = new Date(start); date <= new Date(end); date.setDate(date.getDate()+1)) {
      dates.push(new Date(date).toISOString().split('T')[0]);
    }
    return dates;
  };

  const getTabDates = () => {
    const now = moment();
    return getRangeDates('2022-11-01', now.add(5, 'day').format('YYYY-MM-DD'));
  }


  const updateDate = (e, value) => {
    const tabDates = getTabDates();
    getGames(tabDates[value]);
  }


  const tabDates = getTabDates();
  let tabComponents = [];
  for (let i = 0; i < tabDates.length; i++) {
    let label = moment(tabDates[i]).format('MMM Do');
    if (tabDates[i] === moment().format('YYYY-MM-DD')) {
      label = 'TODAY';
    } else if (
      tabDates[i] === moment().add(1,'days').format('YYYY-MM-DD') ||
      tabDates[i] === moment().add(2,'days').format('YYYY-MM-DD') ||
      tabDates[i] === moment().add(3,'days').format('YYYY-MM-DD')
    ) {
      label = moment(tabDates[i]).format('ddd');
    }
    tabComponents.push(<Tab key = {tabDates[i]} label = {label} />);
  }

  const tabDateIndex = tabDates.indexOf(getSelectedDate());

  return (
    <div style = {{'padding': '56px 20px 0px 20px'}}>
      <Head>
        <title>sRating | College basketball betting picks</title>
        <meta name = 'description' content = 'Best picks for each college basketball game based on statistics' key = 'desc'/>
        <meta property="og:title" content="srating.io college basketball picks" />
        <meta property="og:description" content="Best picks for each college basketball game based on statistics" />
        <meta name="twitter:card" content="summary" />
        <meta name = 'twitter:title' content = 'srating.io college basketball picks' />
      </Head>
      <div>
        <AppBar position="fixed" style = {{'marginTop': marginTop, 'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light}}>
          <Box display="flex" justifyContent="center">
            <Tabs variant="scrollable" scrollButtons="auto" value={tabIndex} onChange={handleTabClick} indicatorColor="secondary" textColor="inherit">
              {tabs}
            </Tabs>
          </Box>
          <Toolbar variant = 'dense'>
            <Tabs value={tabDateIndex} onChange={updateDate} variant="scrollable" scrollButtons = {true} allowScrollButtonsMobile = {false} indicatorColor="secondary" textColor="inherit">
              {tabComponents}
            </Tabs>
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
          </Toolbar>
        </AppBar>
      </div>
      {selectedTab == 'picks' ? <PicksComponent games = {games} /> : ''}
      {selectedTab == 'calculator' ? <Calculator games = {games} /> : ''}
      {selectedTab == 'stats' ? <Stats games = {games} /> : ''}
    </div>
  );
}


export default Picks;
