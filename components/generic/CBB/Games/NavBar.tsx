'use client';
import React, { useState, useEffect, useRef, RefObject, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import DateAppBar from '@/components/generic/DateAppBar';
import { useAppDispatch } from '@/redux/hooks';
import { updateGameSort } from '@/redux/features/favorite-slice';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { useScrollContext } from '@/contexts/scrollContext';
import BackdropLoader from '@/components/generic/BackdropLoader';



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


const NavBar = ({ dates, date }) => {
  const tabDates = dates || [];
  
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  
  const scrollRefDateBar: RefObject<HTMLDivElement> = useRef(null);
  const [spin, setSpin] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const scrollRef  = useScrollContext();
  
  const dispatch = useAppDispatch();
  
  
  // For speed, lookups
  const tabDatesObject = {};
  
  for (let i = 0; i < tabDates.length; i++) {
    tabDatesObject[tabDates[i]] = true;
  }
  
  const scrollToElement = () => {
    scrollRefDateBar.current?.scrollIntoView({'inline': 'center', 'behavior': 'smooth'});
    // setTimeout(function() {
    //   if (scrollRefDateBar && scrollRefDateBar.current) {
    //     scrollRefDateBar.current?.scrollIntoView({'inline': 'center', 'behavior': 'smooth'});
    //   }
    // }, 50);
  };
  
  useEffect(() => {
    scrollToElement();
  }, [date]);


  const updateDate = (e, value, opt_extact) => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }

    let newDate: string | null = null;

    if (opt_extact) {
      newDate = value;
    } else {
      newDate = tabDates[value];
    }

    if (newDate !== null && searchParams?.get('date') !== newDate) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('date', newDate);
      const search = current.toString();
      const query = search ? `?${search}` : "";

      setSpin(true);
      startTransition(() => {
        router.replace(`${pathName}${query}`);
        setSpin(false);
      });
    }
    dispatch(updateGameSort(null));
  }

  return (
    <div>
      <BackdropLoader open = {(spin === true)} />
      <DateAppBar
        styles = {{'marginTop': getMarginTop()}}
        selectedDate = {date}
        dates = {tabDates}
        tabsOnChange = {updateDate}
        calendarOnAccept = {(momentObj) => {updateDate(null, momentObj.format('YYYY-MM-DD'), true);}}
        scrollRef = {scrollRefDateBar}
      />
    </div>
  );
};

export default NavBar;