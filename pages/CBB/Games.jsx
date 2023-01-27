import React, { useState, useEffect } from 'react';
import useWindowDimensions from '../../components/hooks/useWindowDimensions';
import { useTheme } from '@mui/material/styles';

import moment from 'moment';

// import Typography from '@mui/material/Typography';


import IconButton from '@mui/material/IconButton';
import CalendarIcon from '@mui/icons-material/Event';

import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Chip from '@mui/material/Chip';
import Backdrop from '@mui/material/Backdrop';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';


import CircularProgress from '@mui/material/CircularProgress';

import ConferencePicker from '../../components/generic/CBB/ConferencePicker';
import AdditionalOptions from '../../components/generic/CBB/Games/AdditionalOptions';
import Tile from '../../components/generic/CBB/Game/Tile.jsx';

import Api from '../../components/Api.jsx';

const api = new Api();

let intervalRefresher = null;


const Games = (props) => {
  const theme = useTheme();

  // const defaultRankDisplay = localStorage.getItem('CBB.RANKPICKER.DEFAULT') ? JSON.parse(localStorage.getItem('CBB.RANKPICKER.DEFAULT')) : 'composite_rank';
  // const defaultConferences = localStorage.getItem('CBB.CONFERENCEPICKER.DEFAULT') ? JSON.parse(localStorage.getItem('CBB.CONFERENCEPICKER.DEFAULT')) : [];
  const defaultRankDisplay = 'composite_rank';
  const defaultConferences = [];
  const defaultDate = moment().format('YYYY-MM-DD');

  // this wil get cleared when clicking scores again, but if I arrived here from a back button we want to preserve the state
  // let sessionData = sessionStorage.getItem('CBB.GAMES.DATA') ? JSON.parse(sessionStorage.getItem('CBB.GAMES.DATA')) : {};
  let sessionData = {};

  if (sessionData.expire_session && sessionData.expire_session < new Date().getTime()) {
    sessionData = {};
  }

  const statusOptions = [{'value': 'pre', 'label': 'Upcoming'}, {'value': 'live', 'label': 'Live'}, {'value': 'final', 'label': 'Final'}];

  const [request, setRequest] = useState(sessionData.request || false);
  const [spin, setSpin] = useState(('spin' in sessionData) ? sessionData.spin : (props.games));
  const [date, setDate] = useState(sessionData.date || null);
  const [now, setNow] = useState(defaultDate);
  const [games, setGames] = useState(sessionData.games || {});
  const [rankDisplay, setRankDisplay] = useState(defaultRankDisplay);
  const [conferences, setConferences] = useState(defaultConferences);
  const [status, setStatus] = useState(sessionData.status || statusOptions.map(item => item.value));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calAncor, setCalAncor] = useState(null);
  const [scrollTop, setScrollTop] = useState(sessionData.scrollTop || 0);
  const [firstRender, setFirstRender] = useState(true);

  // if stored session, refresh in 5 seconds, else normal 30 seconds
  const [refreshRate, setRefreshRate] = useState(sessionData.games ? 5 : 30);

  const { height, width } = useWindowDimensions();

  const getGames = (value) => {
    if (date !== value) {
      setSpin(true);
    }

    setRequest(true);
    setDate(value);
    api.Request({
      'class': 'cbb_game',
      'function': 'getGames',
      'arguments': {
        'start_date': value,
      }
    }).then(cbb_games => {
      setRefreshRate(30);
      setGames(cbb_games);
      setSpin(false);
    }).catch((err) => {
      // nothing for now
    });
  }


  if (!request) {
    getGames(now);
  }

  const triggerSessionStorage = (optScrollTop) => {
    sessionStorage.setItem('CBB.GAMES.DATA', JSON.stringify({
      'request': request,
      'games': games,
      'date': date,
      'status': status,
      'spin': false,
      'scrollTop': optScrollTop || scrollTop,
      'expire_session': new Date().getTime() + (5 * 60 * 1000), // 5 mins from now
    }));
  };


  useEffect(() => {
    if (firstRender && props.scrollRef && props.scrollRef.current) {
      props.scrollRef.current.scrollTop = scrollTop;
    }

    setFirstRender(false);
    triggerSessionStorage();

    intervalRefresher = setInterval(function() {
      getGames(date);
    }, refreshRate * 1000);

    return function clean_up() {
      clearInterval(intervalRefresher);
    };
  });

  const getRangeDates = (start, end)  => {
    let dates = [];

    for (let date = new Date(start); date <= new Date(end); date.setDate(date.getDate()+1)) {
      dates.push(new Date(date).toISOString().split('T')[0]);
    }
    return dates;
  };


  const getTabDates = () => {
    return getRangeDates('2022-11-01', '2023-04-04');
  }

  const getSelectedDate = () => {
    return date || now;
  }

  /*
  const getYesterdayDate = () => {
    const selectedDate = getSelectedDate();

    let yesterday = new Date(selectedDate + ' 12:00:00');
    yesterday.setDate(yesterday.getDate() - 1);

    return yesterday.toISOString().split('T')[0];
  };

  const getTomorrowDate = () => {
    const selectedDate = getSelectedDate();

    let tomorrow = new Date(selectedDate + ' 12:00:00');
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow.toISOString().split('T')[0];
  };
  */

  const updateDate = (e, value) => {
    const tabDates = getTabDates();
    setScrollTop(0);
    setFirstRender(true);
    getGames(tabDates[value]);
  }


  const toggleCalendar = (e) => {
    if (calendarOpen) {
      setCalAncor(null)
    } else {
      setCalAncor(e.currentTarget);
    }
    setCalendarOpen(!calendarOpen);
  }

  const gameContainers = [];

  let sorted_games = Object.values(games);

  sorted_games.sort(function(a, b) {
    /*
    if (
      a.status === 'live' &&
      b.status === 'live'
    ) {
      if (a.current_period === 'END 2ND') {
        return -1;
      }

      if (b.current_period === 'END 2ND') {
        return 1;
      }

      if (a.current_period !== b.current_period) {

        if (a.current_period === '1ST HALF') {
          return 1;
        }

        return -1;
      }
      let aD = new Date();
      aD.setHours(12, a.clock.split(':')[0], a.clock.split(':')[1])
      let bD = new Date();
      bD.setHours(12, b.clock.split(':')[0], b.clock.split(':')[1])
      return aD < bD ? -1 : 1;
    }
    */

    if (
      a.status === 'live' &&
      b.status !== 'live'
    ) {
      return -1;
    }

    if (
      a.status !== 'live' &&
      b.status === 'live'
    ) {
      return 1;
    }

    if (
      a.status === 'final' &&
      b.status === 'pre'
    ) {
      return 1;
    }

    if (
      a.status === 'pre' &&
      b.status === 'final'
    ) {
      return -1;
    }
    return a.start_datetime > b.start_datetime ? 1 : -1;
  });

  const onClickTile = () => {
    if (
      props.scrollRef &&
      props.scrollRef.current
    ) {
      // the scrollTop is still wrong in the triggerSessionStorage, so just pass the value I guess
      setScrollTop(props.scrollRef.current.scrollTop);
      triggerSessionStorage(props.scrollRef.current.scrollTop);
    }
  }

  for (var i = 0; i < sorted_games.length; i++) {
    let game_ = sorted_games[i];

    // remove d2 garbo games
    if (
      !game_.teams[game_.away_team_id].kenpom ||
      !game_.teams[game_.home_team_id].kenpom
    ) {
      continue;
    }

    if (
      conferences.length &&
      conferences.indexOf(game_.teams[game_.away_team_id].cbb_conference) === -1 &&
      conferences.indexOf(game_.teams[game_.home_team_id].cbb_conference) === -1
    ) {
      continue;
    }

    if (status.indexOf(game_.status) === -1) {
      continue;
    }

    // remove games that are today but still TBA
    let game_timestamp;
    if (
      game_.status === 'pre' &&
      game_.start_date.split('T')[0] === now &&
      (game_timestamp = new Date(game_.start_timestamp * 1000)) &&
      game_timestamp.getHours() >= 0 && game_timestamp.getHours() <= 6
    ) {
      continue;
    }

    gameContainers.push(<Tile onClick={onClickTile} key={game_.cbb_game_id} data={game_} rankDisplay = {rankDisplay} />);
  }

  const gameContainerStyle = {
    'display': 'flex',
    'flexWrap': 'wrap',
    'justifyContent': 'center',
  };


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

  const tabIndex = tabDates.indexOf(getSelectedDate());

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

  const handleStatuses = (status_) => {
   let currentStatuses = [...status];

   if (status_) {
      const status_index = currentStatuses.indexOf(status_);

      if (status_index > -1) {
        currentStatuses.splice(status_index, 1);
      } else {
        currentStatuses.push(status_);
      }
    } else {
      currentStatuses = [];
    }
    setStatus(currentStatuses);
  };


  let confChips = [];
  for (let i = 0; i < conferences.length; i++) {
    confChips.push(<Chip key = {conferences[i]} sx = {{'margin': '5px'}} label={conferences[i]} onDelete={() => {handleConferences(conferences[i])}} />);
  }


  // TODO FADE IN / GROW CBBGAME TILES

  let marginTop = '64px';

  if (width < 600) {
    marginTop = '56px';
  }

  return (
    <div style = {{'padding': '46px 20px 0px 20px'}}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={(spin === true)} // kinda dumb but for some reason spin can be undefined
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div>
        <AppBar position="fixed" style = {{'marginTop': marginTop, 'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light}}>
          <Toolbar /*sx = {{'padding': 0}}*/ variant = 'dense'>
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
      <div style = {{'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'marginTop': '10px'}}>
        <ConferencePicker selected = {conferences} actionHandler = {handleConferences} />
        <AdditionalOptions rankDisplayHandler = {(value) => {setRankDisplay(value);}} rankDisplay = {rankDisplay} />
      </div>
      <div style = {{'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'marginTop': '10px', 'flexWrap': 'wrap'}}>
        {statusOptions.map((statusOption, index) => (
          <Chip
            key = {index}
            sx = {{'margin': '5px'}}
            label={statusOption.label}
            variant={status.indexOf(statusOption.value) === -1 ? 'outlined' : ''}
            color={status.indexOf(statusOption.value) === -1 ? 'primary' : 'success'}
            onClick={() => handleStatuses(statusOption.value)}
          />
        ))}
        {confChips}
      </div>
      <div>
      </div>
      <div style = {gameContainerStyle}>
        {gameContainers}
      </div>
    </div>
  );
}

export default Games;

