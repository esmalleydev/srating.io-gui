'use client';
import React, { useState, useEffect, useRef, RefObject } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import moment from 'moment';


import Chip from '@mui/material/Chip';

import CircularProgress from '@mui/material/CircularProgress';

import ConferencePicker from '@/components/generic/CBB/ConferencePicker';
import AdditionalOptions from '@/components/generic/CBB/Games/AdditionalOptions';
import Tile from '@/components/generic/CBB/Game/Tile';

import DateAppBar from '@/components/generic/DateAppBar';


import HelperCBB from '@/components/helpers/CBB';
import Api from '@/components/Api.jsx';
import BackdropLoader from '@/components/generic/BackdropLoader';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useScrollContext } from '@/contexts/scrollContext';
import { updateGameSort } from '@/redux/features/favorite-slice';
import { gamesDataType } from '@/components/generic/types';
import { updateConferences } from '@/redux/features/display-slice';
import Dates from '@/components/utils/Dates';
import { Fab, Typography, useTheme } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import { useScrollPosition } from '@n8tb1t/use-scroll-position';

const api = new Api();
const dateUtil = new Dates();

let intervalRefresher: NodeJS.Timeout;

const Games = (props) => {
  const dispatch = useAppDispatch();
  const favoriteSlice = useAppSelector(state => state.favoriteReducer.value);
  const displaySlice = useAppSelector(state => state.displayReducer.value);

  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const scrollRefDateBar: RefObject<HTMLDivElement> = useRef(null);

  const scrollRef  = useScrollContext();

  const defaultDate = moment().format('YYYY-MM-DD');
  const season = searchParams?.get('season') || new HelperCBB().getCurrentSeason();

  const sessionDataKey = 'CBB.GAMES.DATA.'+season;

  // this wil get cleared when clicking scores again, but if I arrived here from a back button we want to preserve the state
  const sessionDataString = typeof window !== 'undefined' ? sessionStorage.getItem(sessionDataKey) : null;
  let sessionData = sessionDataString ? JSON.parse(sessionDataString) : {};

  if ((sessionData.expire_session && sessionData.expire_session < new Date().getTime()) || +sessionData.season !== +season) {
    sessionData = {};
  }

  const statusOptions = [{'value': 'pre', 'label': 'Upcoming'}, {'value': 'live', 'label': 'Live'}, {'value': 'final', 'label': 'Final'}];

  const tabDates = props.dates || [];
  const [request, setRequest] = useState(sessionData.request || false);
  const [spin, setSpin] = useState(('spin' in sessionData) ? sessionData.spin : (props.games));
  const [date, setDate] = useState(sessionData.date || searchParams?.get('date') || null);
  const [now, setNow] = useState(defaultDate);
  const [games, setGames] = useState<gamesDataType>(sessionData.games || {});
  const [status, setStatus] = useState(sessionData.status || statusOptions.map(item => item.value));
  const [scrollTop, setScrollTop] = useState(sessionData.scrollTop || 0);
  const [firstRender, setFirstRender] = useState(true);
  const [loading, setLoading] = useState(false);
  // todo figure out scroll thing
  const [showScrollFAB, setShowScrolledFAB] = useState(true);


  // if stored session, refresh in 5 seconds, else normal 30 seconds
  const [refreshRate, setRefreshRate] = useState(sessionData.games ? 5 : 30);

  const { width } = useWindowDimensions() as Dimensions;

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
    setLoading(true);

    if (searchParams && searchParams?.get('date') !== value) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('date', value);
      const search = current.toString();
      const query = search ? `?${search}` : "";

      // https://github.com/vercel/next.js/pull/58335

      // this is dumb but w/e...
      setTimeout(function() {
        router.replace(`${pathName}${query}`);
      }, 0);
    }

    // if (router.query && router.query.date !== value) {
    //   router.replace({
    //     query: {...router.query, date: value},
    //   });
    // }
    
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
      setLoading(false);
    }).catch((err) => {
      // nothing for now
    });
  };

  const scrollToElement = () => {
    // for some reason this doesnt work on first render, when executed immediately, so trigger the scroll in 750ms
    if (firstRender) {
      setTimeout(function() {
        if (scrollRefDateBar && scrollRefDateBar.current) {
          scrollRefDateBar.current?.scrollIntoView({'inline': 'center', 'behavior': 'smooth'});
        }
      }, 750);
    } else {
      scrollRefDateBar.current?.scrollIntoView({'inline': 'center', 'behavior': 'smooth'});
    }
  };

  const handleScrollToTop = () => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTo({'top': 0, 'behavior': 'smooth'});
      dispatch(updateGameSort(null));
    }
  };


  const getSelectedDate = () => {
    return date || now;
  }

  // todo figure out this scroll thing
  /*
  useScrollPosition(
    ({ prevPos, currPos }) => {
      console.log(currPos)
      // if (currPos > 300) {
      //   setShowScrolledFAB(true);
      // }
    },
    [showScrollFAB],
    undefined,
    true
  );
  */

  useEffect(() => {
    triggerSessionStorage(false);
  }, []);

  useEffect(() => {
    console.log('?')
    handleScrollToTop();
  }, [displaySlice]);

  useEffect(() => {
    scrollToElement();
  }, [date]);

  useEffect(() => {
    if (firstRender && scrollRef && scrollRef.current) {
      // todo something in nextjs is setting scrolltop to zero right after this, so trick it by putting this at the end of the execution :)
      // https://github.com/vercel/next.js/issues/20951
      setTimeout(function() {
        if (scrollRef && scrollRef.current) {
          scrollRef.current.scrollTop = scrollTop;
        }
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
        <div style = {{'display': 'flex', 'justifyContent': 'center'}}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (!request) {
    const selectedDate = getSelectedDate();
    if (selectedDate in tabDatesObject) {
      getGames(selectedDate);
    } else {
      const d = dateUtil.getClosestDate(selectedDate, tabDates);
      getGames(d || tabDates[0]);
    }
  }


  const updateDate = (e, value) => {
    setScrollTop(0);
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    getGames(tabDates[value]);
    dispatch(updateGameSort(null));
  }


  const gameContainers: React.JSX.Element[] = [];

  let sorted_games = Object.values(games);

  sorted_games.sort(function(a, b) {
    const aIsPinned = (
      favoriteSlice.skip_sort_cbb_game_ids.indexOf(a.cbb_game_id) === -1 &&
      favoriteSlice.cbb_game_ids.length &&
      favoriteSlice.cbb_game_ids.indexOf(a.cbb_game_id) > -1
    );

    const bIsPinned = (
      favoriteSlice.skip_sort_cbb_game_ids.indexOf(b.cbb_game_id) === -1 &&
      favoriteSlice.cbb_game_ids.length &&
      favoriteSlice.cbb_game_ids.indexOf(b.cbb_game_id) > -1
    );

    if (aIsPinned && !bIsPinned) {
      return -1;
    }
      
    if (!aIsPinned && bIsPinned) {
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
      scrollRef &&
      scrollRef.current
    ) {
      // the scrollTop is still wrong in the triggerSessionStorage, so just pass the value I guess
      setScrollTop(scrollRef.current.scrollTop);
      triggerSessionStorage(scrollRef.current.scrollTop);
    }
    dispatch(updateGameSort(null));
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

    if (
      displaySlice.conferences.length &&
      displaySlice.conferences.indexOf(game_.teams[game_.away_team_id].conference) === -1 &&
      displaySlice.conferences.indexOf(game_.teams[game_.home_team_id].conference) === -1
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

    gameContainers.push(<Tile onClick={onClickTile} key={game_.cbb_game_id} data={game_} />);
  }

  const gameContainerStyle: React.CSSProperties = {
    'display': 'flex',
    'flexWrap': 'wrap',
    'justifyContent': 'center',
  };



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


  let confChips: React.JSX.Element[] = [];
  for (let i = 0; i < displaySlice.conferences.length; i++) {
    confChips.push(<Chip key = {displaySlice.conferences[i]} sx = {{'margin': '5px'}} label={displaySlice.conferences[i]} onDelete={() => {dispatch(updateConferences(displaySlice.conferences[i]))}} />);
  }


  // TODO FADE IN / GROW CBBGAME TILES

  const subHeaderHeight = 48;
  let subHeaderTop = 112;
  let marginTop = '64px';
  let minSubBarWidth = 75;

  if (width < 600) {
    marginTop = '56px';
    minSubBarWidth = 0;
    subHeaderTop = 104;
  }


  const subHeaderStyle: React.CSSProperties = {
    'height': subHeaderHeight,
    'position': 'fixed',
    'backgroundColor': theme.palette.background.default,
    'zIndex': 1100,
    'display': 'flex',
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'top': subHeaderTop,
    'left': 0,
    'right': 0,
  };


  return (
    <div style = {{'padding': '46px 0px 0px 0px'}}>
      <BackdropLoader open = {(spin === true)} />
      <div>
        <DateAppBar
          styles = {{'marginTop': marginTop}}
          selectedDate = {getSelectedDate()}
          dates = {tabDates}
          tabsOnChange = {updateDate}
          calendarOnAccept = {(momentObj) => {getGames(momentObj.format('YYYY-MM-DD'));}}
          scrollRef = {scrollRefDateBar}
        />
      </div>
      <div style = {subHeaderStyle}>
        <div style = {{'minWidth': minSubBarWidth}}><ConferencePicker /></div>
        <div style = {{'minWidth': minSubBarWidth}}>
          {statusOptions.map((statusOption, index) => (
            <Chip
              key = {index}
              sx = {{'margin': '5px', 'maxWidth': (width < 340 ? 60 : 'initial')}}
              label={statusOption.label}
              variant={status.indexOf(statusOption.value) === -1 ? 'outlined' : 'filled'}
              color={status.indexOf(statusOption.value) === -1 ? 'primary' : 'success'}
              onClick={() => handleStatuses(statusOption.value)}
            />
          ))}
        </div>
        <div style = {{'minWidth': minSubBarWidth}}><AdditionalOptions /></div>
      </div>
      <div style = {{'padding': '0px 2.5px 0px 2.5px', 'marginTop': subHeaderHeight}}>
        <div style = {{'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'marginTop': '10px', 'flexWrap': 'wrap'}}>
          {confChips}
        </div>
        <div style = {gameContainerStyle}>
          {
            gameContainers.length ?
              gameContainers :
              (loading ?
                <div style = {{'display': 'flex', 'justifyContent': 'center'}}><CircularProgress /></div> :
                <Typography variant = 'h5'>No games found :( please adjust filter. </Typography>)
          }
        </div>
      </div>
      {showScrollFAB ? <div style = {{'position': 'absolute', 'bottom': 70, 'left': 15}}><Fab size = 'small' color = 'secondary' onClick={handleScrollToTop}>{<KeyboardArrowUpIcon />}</Fab></div> : ''}
    </div>
  );
}

export default Games;

