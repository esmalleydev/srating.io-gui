import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useWindowDimensions from '../../components/hooks/useWindowDimensions';
import { useTheme } from '@mui/material/styles';

import moment from 'moment';
import cacheData from 'memory-cache';

import Typography from '@mui/material/Typography';


import Chip from '@mui/material/Chip';

import CircularProgress from '@mui/material/CircularProgress';

import ConferencePicker from '../../components/generic/CBB/ConferencePicker';
import AdditionalOptions from '../../components/generic/CBB/Games/AdditionalOptions';
import Tile from '../../components/generic/CBB/Game/Tile.jsx';

import DateAppBar from '../../components/generic/DateAppBar.jsx';


import HelperCBB from '../../components/helpers/CBB';
import Api from '../../components/Api.jsx';
import BackdropLoader from '../../components/generic/BackdropLoader';

const api = new Api();

let intervalRefresher = null;


const Games = (props) => {
  const router = useRouter();
  const theme = useTheme();
  const scrollRef = useRef(null);

  const defaultDate = moment().format('YYYY-MM-DD');
  const season = (router.query && router.query.season) || new HelperCBB().getCurrentSeason();

  const sessionDataKey = 'CBB.GAMES.DATA.'+season;

  // this wil get cleared when clicking scores again, but if I arrived here from a back button we want to preserve the state
  let sessionData = typeof window !== 'undefined' && sessionStorage.getItem(sessionDataKey) ? JSON.parse(sessionStorage.getItem(sessionDataKey)) : {};


  if ((sessionData.expire_session && sessionData.expire_session < new Date().getTime()) || +sessionData.season !== +season) {
    sessionData = {};
  }

  const statusOptions = [{'value': 'pre', 'label': 'Upcoming'}, {'value': 'live', 'label': 'Live'}, {'value': 'final', 'label': 'Final'}];

  const tabDates = props.dates || [];
  const [request, setRequest] = useState(sessionData.request || false);
  const [spin, setSpin] = useState(('spin' in sessionData) ? sessionData.spin : (props.games));
  const [date, setDate] = useState(sessionData.date || router.query.date || null);
  const [now, setNow] = useState(defaultDate);
  const [games, setGames] = useState(sessionData.games || {});
  const [rankDisplay, setRankDisplay] = useState('composite_rank');
  const [conferences, setConferences] = useState([]);
  const [pins, setPins] = useState(typeof window !== 'undefined' && sessionStorage.getItem('CBB.GAMES.PINS') ? JSON.parse(sessionStorage.getItem('CBB.GAMES.PINS')) : []);
  const [status, setStatus] = useState(sessionData.status || statusOptions.map(item => item.value));
  const [scrollTop, setScrollTop] = useState(sessionData.scrollTop || 0);
  const [firstRender, setFirstRender] = useState(true);

  // if stored session, refresh in 5 seconds, else normal 30 seconds
  const [refreshRate, setRefreshRate] = useState(sessionData.games ? 5 : 30);


  const { height, width } = useWindowDimensions();

  // For speed, lookups
  const tabDatesObject = {};

  for (let i = 0; i < tabDates.length; i++) {
    tabDatesObject[tabDates[i]] = true;
  }

  const triggerSessionStorage = (optScrollTop) => {
    sessionStorage.setItem(sessionDataKey, JSON.stringify({
      'request': request,
      'games': games,
      'date': date,
      'status': status,
      'spin': false,
      'scrollTop': optScrollTop || scrollTop,
      'expire_session': new Date().getTime() + (5 * 60 * 1000), // 5 mins from now
      'season': season,
    }));
  };

  const getGames = (value) => {
    if (date !== value) {
      setSpin(true);
    }

    setRequest(true);
    setDate(value);

    if (router.query && router.query.date !== value) {
      router.replace({
        query: {...router.query, date: value},
      });
    }
    
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
  };

  const scrollToElement = () => {
    scrollRef.current?.scrollIntoView({'inline': 'center', 'behavior': 'smooth'});
  };


  /**
   * Find the closest tabDates match to a date
   * @param  {String} d a date to match YYYY-MM-DD
   * @return {?String}
   */
  const getClosestDate = (d) => {
    let closestDist = null;
    let closestDate = null;

    if (d in tabDatesObject) {
      return d;
    }

    for (let i = 0; i < tabDates.length; i++) {
      const a = new Date(tabDates[i]);
      const b = new Date(d);

      const dist = Math.abs(a - b);

      if (
        !closestDist ||
        dist < closestDist
      ) {
        closestDist = dist;
        closestDate = tabDates[i];
      }
    }

    return closestDate;
  };


  const getSelectedDate = () => {
    return date || now;
  }


  useEffect(() => {
    setConferences(localStorage.getItem('CBB.CONFERENCEPICKER.DEFAULT') ? JSON.parse(localStorage.getItem('CBB.CONFERENCEPICKER.DEFAULT')) : []);
    setRankDisplay(localStorage.getItem('CBB.RANKPICKER.DEFAULT') ? JSON.parse(localStorage.getItem('CBB.RANKPICKER.DEFAULT')) : 'composite_rank');
    triggerSessionStorage();
  }, []);

  useEffect(() => {
    scrollToElement();
  }, [date]);

  useEffect(() => {
    if (firstRender && props.scrollRef && props.scrollRef.current) {
      // todo something in nextjs is setting scrolltop to zero right after this, so trick it by putting this at the end of the execution :)
      // https://github.com/vercel/next.js/issues/20951
      setTimeout(function() {
        props.scrollRef.current.scrollTop = scrollTop;
      }, 1);
    }

    setFirstRender(false);
    intervalRefresher = setInterval(function() {
      getGames(date);
    }, refreshRate * 1000);

    return function clean_up() {
      clearInterval(intervalRefresher);
    };
  });

  if (firstRender) {
    return (
      <div>
        <Head>
          <title>sRating | College basketball scores</title>
          <meta name = 'description' content = 'Live college basketball scores and odds' key = 'desc'/>
          <meta property="og:title" content="srating.io college basketball scores" />
          <meta property="og:description" content="Live college basketball scores and odds" />
          <meta name="twitter:card" content="summary" />
          <meta name = 'twitter:title' content = 'Live college basketball scores and odds' />
        </Head>
        <div style = {{'display': 'flex', 'justifyContent': 'center'}}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (!request) {
    const d = getClosestDate(getSelectedDate());
    getGames(d || tabDates[0]);
  }


  const updateDate = (e, value) => {
    setScrollTop(0);
    getGames(tabDates[value]);
  }

  const handlePins = (cbb_game_id) => {
    let currentPins = [...pins];

    const index = currentPins.indexOf(cbb_game_id);

    if (index > -1) {
      currentPins.splice(index, 1);
    } else {
      currentPins.push(cbb_game_id);
    } 

    sessionStorage.setItem('CBB.GAMES.PINS', JSON.stringify(currentPins));
    setPins(currentPins);
  };

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

    if (pins.length && pins.indexOf(a.cbb_game_id) > -1) {
      return -1;
    }

    if (pins.length && pins.indexOf(b.cbb_game_id) > -1) {
      return 1;
    }

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

    // remove games where a team is TBA
    
    if (
      !game_.teams ||
      !game_.teams[game_.away_team_id] ||
      !game_.teams[game_.home_team_id]
    ) {
      continue;
    }

    // todo temp, uncomment
    // remove d2 garbo games
    // if (
    //   !game_.teams[game_.away_team_id].cbb_d1 ||
    //   !game_.teams[game_.home_team_id].cbb_d1
    // ) {
    //   continue;
    // }

    if (
      conferences.length &&
      conferences.indexOf(game_.teams[game_.away_team_id].conference) === -1 &&
      conferences.indexOf(game_.teams[game_.home_team_id].conference) === -1
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

    gameContainers.push(<Tile onClick={onClickTile} key={game_.cbb_game_id} data={game_} rankDisplay = {rankDisplay} isPinned = {(pins.indexOf(game_.cbb_game_id) > -1)} actionPin = {handlePins} />);
  }

  const gameContainerStyle = {
    'display': 'flex',
    'flexWrap': 'wrap',
    'justifyContent': 'center',
  };


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
      <Head>
        <title>sRating | College basketball scores</title>
        <meta name = 'description' content = 'Live college basketball scores and odds' key = 'desc'/>
        <meta property="og:title" content="srating.io college basketball scores" />
        <meta property="og:description" content="Live college basketball scores and odds" />
        <meta name="twitter:card" content="summary" />
        <meta name = 'twitter:title' content = 'Live college basketball scores and odds' />
      </Head>
      <BackdropLoader open = {(spin === true)} />
      <div>
        <DateAppBar
          styles = {{'marginTop': marginTop}}
          selectedDate = {getSelectedDate()}
          dates = {tabDates}
          tabsOnChange = {updateDate}
          calendarOnAccept = {(momentObj) => {getGames(momentObj.format('YYYY-MM-DD'));}}
          scrollRef = {scrollRef}
        />
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
      <div style = {gameContainerStyle}>
        {gameContainers}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const seconds = 60 * 60 * 12; // cache for 12 hours
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage='+seconds+', stale-while-revalidate=59'
  );

  const CBB = new HelperCBB();

  const season =  (context.query && context.query.season) || CBB.getCurrentSeason();

  let dates = [];

  const cachedLocation = 'CBB.GAMES.LOAD.'+season;

  const cached = cacheData.get(cachedLocation);

  if (!cached) {
    await api.Request({
      'class': 'cbb_game',
      'function': 'getSeasonDates',
      'arguments': {
        'season': season
      }
    }).then((response) => {
      dates = response;
      cacheData.put(cachedLocation, dates, 1000 * seconds);
    }).catch((e) => {

    });
  } else {
    dates = cached;
  }


  return {
    'props': {
      'dates': dates,
    },
  }
}

export default Games;

