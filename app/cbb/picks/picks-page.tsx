'use client';
import React, { useState, useEffect, useRef, RefObject } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import moment from 'moment';

import DateAppBar from '@/components/generic/DateAppBar.jsx';
import Picks_ from '@/components/generic/CBB/Picks/Picks';
import Calculator from '@/components/generic/CBB/Picks/Calculator.jsx';
import Stats from '@/components/generic/CBB/Picks/Stats.jsx';
import HelperCBB from '@/components/helpers/CBB';

import { useScrollContext } from '@/contexts/scrollContext';
import { useAppDispatch } from '@/redux/hooks';
import { updateGameSort } from '@/redux/features/favorite-slice';
import Dates from '@/components/utils/Dates';
import { useClientAPI } from '@/components/clientAPI';

const dateUtil = new Dates();

const Picks = (props) => {
  const self = this;

  const dispatch = useAppDispatch();

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const scrollRefDateBar: RefObject<HTMLDivElement> = useRef(null);

  const scrollRef  = useScrollContext();

  const tabDates = props.dates;

  const { width } = useWindowDimensions() as Dimensions;

  const season = searchParams?.get('season') || new HelperCBB().getCurrentSeason();

  let tabOptions = {
    'stats': 'Stats',
    'calculator': 'Calculator',
    'picks': 'Picks',
  };

  let tabOrder = ['picks', 'calculator', 'stats'];

  const sessionDataKey = 'CBB.PICKS.DATA.'+season;

  // this wil get cleared when clicking scores again, but if I arrived here from a back button we want to preserve the state
  const sessionDataString = typeof window !== 'undefined' ? sessionStorage.getItem(sessionDataKey) : null;
  let sessionData = sessionDataString ? JSON.parse(sessionDataString) : {};
  if ((sessionData.expire_session && sessionData.expire_session < new Date().getTime()) || +sessionData.season !== +season) {
    sessionData = {};
  }

  const [firstRender, setFirstRender] = useState(true);
  const [request, setRequest] = useState(sessionData.request || false);
  const [spin, setSpin] = useState(('spin' in sessionData) ? sessionData.spin : (props.games));
  const [date, setDate] = useState(sessionData.date || searchParams?.get('date') || null);
  const [view, setView] = useState(searchParams?.get('view') || 'picks');
  const [games, setGames] = useState(sessionData.games || {});
  const [now, setNow] = useState(moment().format('YYYY-MM-DD'));
  const [scrollTop, setScrollTop] = useState(sessionData.scrollTop || 0);
  const [showLockedDialog, setShowLockedDialog] = useState(false);
  
  const selectedTab = tabOrder.indexOf(view) > -1 ? tabOrder[tabOrder.indexOf(view)] : tabOrder[0];
  const [tabIndex, setTabIndex] = useState(tabOrder.indexOf(selectedTab));

  // For speed, lookups
  const tabDatesObject = {};
  for (let i = 0; i < tabDates.length; i++) {
    tabDatesObject[tabDates[i]] = true;
  }

  const triggerSessionStorage = () => {
    sessionStorage.setItem(sessionDataKey, JSON.stringify({
      'request': request,
      'games': games,
      'date': date,
      'spin': false,
      'scrollTop': scrollTop,
      'expire_session': new Date().getTime() + (5 * 60 * 1000), // 5 mins from now
      'season': season,
    }));
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


  const getGames = (value) => {;
    if (date !== value) {
      setSpin(true);
    }

    setRequest(true);

    // https://github.com/vercel/next.js/discussions/47583
    // router.replace({
    //   query: {...router.query, date: value},
    // });
    
    if (searchParams) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('date', value);
      const search = current.toString();
      const query = search ? `?${search}` : "";

      router.replace(`${pathName}${query}`);
    }

    useClientAPI({
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


  useEffect(() => {
    triggerSessionStorage();
  }, [view, scrollTop, request, games, date]);

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
  });

  if (firstRender) {
    return (<div style = {{'display': 'flex', 'justifyContent': 'center'}}><CircularProgress /></div>);
  }


  const getSelectedDate = () => {
    return date || now;
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
    getGames(tabDates[value]);
    dispatch(updateGameSort(null));
  }

  // check the games, if the first one has no rating, then they dont have picks access
  // dont let them click the calc button
  // todo should store this on login or something so the gui doesnt need to make a request, even though this is a reliable method to check
  let calcAccess = true;
  for (let cbb_game_id in games) {
    if (
      !games[cbb_game_id].home_team_rating &&
      !games[cbb_game_id].away_team_rating
    ) {
      calcAccess = false;
    }
    break;
  }


  
  let tabs: React.JSX.Element[] = [];
  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {(<span style = {{'fontSize': '12px'}}>{tabOptions[tabOrder[i]]}</span>)} />);
  }

  const handleTabClick = (e, value) => {
    setShowLockedDialog(false);
    if (value === 1 && !calcAccess) {
      setShowLockedDialog(true);
      return;
    }
    
    setTabIndex(value);
    setView(tabOrder[value]);
    // https://github.com/vercel/next.js/discussions/47583
    // router.replace({
    //   query: {...router.query, view: tabOrder[value]},
    // });
    if (searchParams) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('view', tabOrder[value]);
      const search = current.toString();
      const query = search ? `?${search}` : "";

      // https://github.com/vercel/next.js/pull/58335

      // this is dumb but w/e...
      setTimeout(function() {
        router.replace(`${pathName}${query}`);
      }, 0);
    }
  }

  const onClickTile = () => {
    if (
      scrollRef &&
      scrollRef.current
    ) {
      setScrollTop(scrollRef.current.scrollTop);
    }
    dispatch(updateGameSort(null));
  }

  let marginTop = '64px';

  if (width < 600) {
    marginTop = '56px';
  }

  const handleSubscribe = () => {
    router.push('/pricing');
  };

  const handleCloseLockedDialog = () => {
    setShowLockedDialog(false);
  };

  return (
    <div style = {{'padding': '46px 20px 0px 20px'}}>
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
      <Box display="flex" justifyContent="center" /*sx = {{'position': 'sticky', 'top': 100}}*/>
        <Tabs variant="scrollable" scrollButtons="auto" value={tabIndex} onChange={handleTabClick} indicatorColor="secondary" textColor="inherit">
          {tabs}
        </Tabs>
      </Box>
      {
        spin ? <div style = {{'display': 'flex', 'justifyContent': 'center'}}><CircularProgress /></div> :
        <div>
          {selectedTab == 'picks' ? <Picks_ key = {date} games = {games} date = {date} onClickTile = {onClickTile} /> : ''}
          {selectedTab == 'calculator' ? <Calculator key = {date} games = {games} date = {date} /> : ''}
          {selectedTab == 'stats' ? <Stats key = {date} date = {date} /> : ''}
        </div>
      }
      <Dialog
        open={showLockedDialog}
        onClose={handleCloseLockedDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Subscription required'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Subscribe for just $5 per month to get access to the betting calculator!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLockedDialog}>Maybe later</Button>
          <Button onClick={handleSubscribe} autoFocus>
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


export default Picks;
