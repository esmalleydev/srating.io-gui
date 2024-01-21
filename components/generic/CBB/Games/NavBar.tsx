'use client';
import React, { useState, useEffect, useRef, RefObject, useTransition } from 'react';
import moment from 'moment';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import DateAppBar from '@/components/generic/DateAppBar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateGameSort } from '@/redux/features/favorite-slice';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { useScrollContext } from '@/contexts/scrollContext';
import BackdropLoader from '../../BackdropLoader';
import { clearDatesChecked } from '@/redux/features/games-slice';


// TODO, GET ALL GAMES ON FIRST LOAD
// THEN FOR REFRESHES, EACH GAME CONTROLS IT, ONES CURRENTLY VIEWABLE GO FIRST AND REFRESH MORE FREQUENTLY
// ONES NOT VIEWABLE STILL REFRESH EVERY MIN? BUT THEY ARE NOT PRIO
// IF YOU SCROLL INTO VIEW, TRIGGER FRESH? MUST BE SO FAST THAT IT GETS DATA BACK BEFORE SCROLLING OUT OF VIEW

// TRIAL IT TO COMPARE SPEED VS 1 BIG CALL TO ALL GAMES, DO IT ON A DAY WITH A LOT OF GAMES AND SMALL AMOUNT
// SHOW REFRESH COUNTER ON EACH GAME TILE?


const getBreakPoint = () => {
  return 600;
};


const getMarginTop = () => {
  const { width } = useWindowDimensions() as Dimensions;

  if (width <= getBreakPoint()) {
    return 56;
  }

  return 64;
};

export { getMarginTop, getBreakPoint };


const NavBar = ({ dates, sessionDataKey, season }) => {

   // this wil get cleared when clicking scores again, but if I arrived here from a back button we want to preserve the state
   const sessionDataString = typeof window !== 'undefined' ? sessionStorage.getItem(sessionDataKey) : null;
   let sessionData = sessionDataString ? JSON.parse(sessionDataString) : {};
 
   if ((sessionData.expire_session && sessionData.expire_session < new Date().getTime()) || +sessionData.season !== +season) {
     sessionData = {};
   }

  const tabDates = dates || [];

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const now =  moment().format('YYYY-MM-DD');

  const [date, setDate] = useState(searchParams?.get('date') || moment().format('YYYY-MM-DD'));
  const datesChecked = useAppSelector(state => state.gamesReducer.value.dates_checked);

  const [firstRender, setFirstRender] = useState(true);
  const [scrollTop, setScrollTop] = useState(sessionData.scrollTop || 0);
  const scrollRefDateBar: RefObject<HTMLDivElement> = useRef(null);
  const [spin, setSpin] = useState(false);
  const [isPending, startTransition] = useTransition();

  const scrollRef  = useScrollContext();


  const dispatch = useAppDispatch();
  // const favoriteSlice = useAppSelector(state => state.favoriteReducer.value);
  // const displaySlice = useAppSelector(state => state.displayReducer.value);

  
  // For speed, lookups
  const tabDatesObject = {};

  for (let i = 0; i < tabDates.length; i++) {
    tabDatesObject[tabDates[i]] = true;
  }


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

  useEffect(() => {
    scrollToElement();
  }, [date]);

  useEffect(() => {
    if (firstRender && scrollRef && scrollRef.current) {
      // todo something in nextjs is setting scrolltop to zero right after this, so trick it by putting this at the end of the execution :)
      // https://github.com/vercel/next.js/issues/20951
      setTimeout(function() {
        if (scrollRef && scrollRef.current) {
          // todo try to remove this
          // scrollRef.current.scrollTop = scrollTop;
        }
      }, 1);
    }

    setFirstRender(false);
  });



  const updateDate = (e, value) => {
    setSpin(true);
    setScrollTop(0);
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }

    const newDate = tabDates[value];

    if (searchParams?.get('date') !== newDate) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('date', newDate);
      const search = current.toString();
      const query = search ? `?${search}` : "";

      // https://github.com/vercel/next.js/pull/58335

      // setTimeout(function() {
        // router.replace(`${pathName}${query}`);
      // }, 0);
      setSpin(true);
      startTransition(() => {
        router.replace(`${pathName}${query}`);
        setSpin(false);
      });
    }
    setDate(newDate);
    dispatch(updateGameSort(null));
    if (date >= now && datesChecked[date]) {
      // dispatch(clearDatesChecked(null));
    }
  }

  return (
    <div>
      <BackdropLoader open = {(spin === true)} />
      <DateAppBar
        styles = {{'marginTop': getMarginTop()}}
        selectedDate = {date}
        dates = {tabDates}
        tabsOnChange = {updateDate}
        calendarOnAccept = {(momentObj) => {updateDate(null, momentObj.format('YYYY-MM-DD'));}}
        scrollRef = {scrollRefDateBar}
      />
    </div>
  );
};

export default NavBar;