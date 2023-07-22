import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import useWindowDimensions from '../../components/hooks/useWindowDimensions';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import moment from 'moment';
import cacheData from 'memory-cache';

import DateAppBar from '../../components/generic/DateAppBar.jsx';
import Picks_ from '../../components/generic/CBB/Picks/Picks.jsx';
import Calculator from '../../components/generic/CBB/Picks/Calculator.jsx';
import Stats from '../../components/generic/CBB/Picks/Stats.jsx';
import HelperCBB from '../../components/helpers/CBB';

import Api from '../../components/Api.jsx';
const api = new Api();

const Picks = (props) => {
  const self = this;

  const tabDates = props.dates;
  const { height, width } = useWindowDimensions();

  const [firstRender, setFirstRender] = useState(true);
  const [request, setRequest] = useState(false);
  const [spin, setSpin] = useState(true);
  const [date, setDate] = useState();
  const [now, setNow] = useState(moment().format('YYYY-MM-DD'));
  const [games, setGames] = useState({});
  // const [rankDisplay, setRankDisplay] = useState('composite_rank');
  const [tabIndex, setTabIndex] = useState(0);

  // For speed, lookups
  const tabDatesObject = {};
  for (let i = 0; i < tabDates.length; i++) {
    tabDatesObject[tabDates[i]] = true;
  }



  useEffect(() => {
    setFirstRender(false);
    // setRankDisplay(localStorage.getItem('CBB.RANKPICKER.DEFAULT') ? JSON.parse(localStorage.getItem('CBB.RANKPICKER.DEFAULT')) : 'composite_rank');
  }, []);

  if (firstRender) {
    return (<div style = {{'display': 'flex', 'justifyContent': 'center'}}><CircularProgress /></div>);
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


  if (!request) {
    const d = getClosestDate(getSelectedDate());
    getGames(d || tabDates[0]);
  }


  const updateDate = (e, value) => {
    getGames(tabDates[value]);
  }


  let tabOptions = {
    'stats': 'Stats',
    'calculator': 'Calculator',
    'picks': 'Picks',
  };

  let tabOrder = ['picks', 'calculator', 'stats'];
  let tabs = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {(<span style = {{'fontSize': '12px'}}>{tabOptions[tabOrder[i]]}</span>)} />);
  }

  const selectedTab = tabOrder[tabIndex];

  const handleTabClick = (e, value) => {
    setTabIndex(value);
  }

  let marginTop = '64px';

  if (width < 600) {
    marginTop = '56px';
  }

  return (
    <div style = {{'padding': '46px 20px 0px 20px'}}>
      <Head>
        <title>sRating | College basketball betting picks</title>
        <meta name = 'description' content = 'Best picks for each college basketball game based on statistics' key = 'desc'/>
        <meta property="og:title" content=">sRating.io college basketball picks" />
        <meta property="og:description" content="Best picks for each college basketball game based on statistics" />
      </Head>
      <div>
        <DateAppBar
          styles = {{'marginTop': marginTop}}
          selectedDate = {getSelectedDate()}
          dates = {tabDates}
          tabsOnChange = {updateDate}
          calendarOnAccept = {(momentObj) => {getGames(momentObj.format('YYYY-MM-DD'));}}
          // scrollRef = {scrollRef}
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
          {selectedTab == 'picks' ? <Picks_ key = {date} games = {games} date = {date} /> : ''}
          {selectedTab == 'calculator' ? <Calculator key = {date} games = {games} date = {date} /> : ''}
          {selectedTab == 'stats' ? <Stats key = {date} date = {date} /> : ''}
        </div>
      }
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

  const cachedLocation = 'CBB.PICKS.LOAD.'+season;

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


export default Picks;
