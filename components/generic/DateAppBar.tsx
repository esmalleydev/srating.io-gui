'use client';
import React, { RefObject, useEffect, useRef, useState, useTransition } from 'react';
import { useTheme } from '@mui/material/styles';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import IconButton from '@mui/material/IconButton';
import CalendarIcon from '@mui/icons-material/Event';

import moment from 'moment';
import { Dimensions, useWindowDimensions } from '../hooks/useWindowDimensions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useScrollContext } from '@/contexts/scrollContext';
import { useAppDispatch } from '@/redux/hooks';
import { updateGameSort } from '@/redux/features/favorite-slice';
import BackdropLoader from '@/components/generic/BackdropLoader';



const getBreakPoint: () => number = () => {
  return 600;
};


const getMarginTop: () => number = () => {
  const { width } = useWindowDimensions() as Dimensions;

  if (width <= getBreakPoint()) {
    return 56;
  }

  return 64;
};

export { getMarginTop, getBreakPoint };

const DateAppBar = ({ dates, date }) => {
  const theme = useTheme();
  
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
  
  for (let i = 0; i < dates.length; i++) {
    tabDatesObject[dates[i]] = true;
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


  const updateDate: (event: React.SyntheticEvent | null, value: any, ...other: any) => void = (e: React.SyntheticEvent | null, value: string | null, opt_extact: boolean) => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }

    let newDate: string | null = null;

    if (opt_extact && value) {
      newDate = value;
    } else if (value) {
      newDate = dates[value];
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

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calAncor, setCalAncor] = useState(null);

  // const {
  //   AppBarStyles,
  //   dates,
  //   selectedDate,
  //   scrollRef,
  //   tabsOnChange,
  //   calendarOnAccept,
  //   ...other
  // } = props;


  let tabComponents: React.JSX.Element[] = [];
  for (let i = 0; i < dates.length; i++) {
    let label = moment(dates[i]).format('MMM D');
    if (dates[i] === moment().format('YYYY-MM-DD')) {
      label = 'TODAY';
    } else if (
      dates[i] === moment().add(1,'days').format('YYYY-MM-DD') ||
      dates[i] === moment().add(2,'days').format('YYYY-MM-DD') ||
      dates[i] === moment().add(3,'days').format('YYYY-MM-DD')
    ) {
      label = moment(dates[i]).format('ddd');
    }
    let ref_: RefObject<HTMLDivElement> | null = null;
    if (dates[i] === date) {
      ref_ = scrollRefDateBar;
    }
    tabComponents.push(<Tab ref = {ref_} key = {dates[i]} value = {i} label = {label} sx = {{'fontSize': '12px', 'minWidth': 60}} />);
  }

  const tabIndex = dates.indexOf(date) > -1 ? dates.indexOf(date) : dates.length - 1;


  const toggleCalendar = (e) => {
    if (calendarOpen) {
      setCalAncor(null)
    } else if (e) {
      setCalAncor(e.currentTarget);
    }
    setCalendarOpen(!calendarOpen);
  }


  return (
    <div>
      <BackdropLoader open = {spin} />
      <AppBar position="fixed" style = {Object.assign({}, {'marginTop': getMarginTop()}, {'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light})}>
        <Toolbar variant = 'dense'>
          <Tabs value={tabIndex} onChange={updateDate} variant="scrollable" scrollButtons = {true} allowScrollButtonsMobile = {false} indicatorColor="secondary" textColor="inherit" /* sx = {{'backgroundImage': 'linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255, 1) 90%)'}}*/>
            {tabComponents}
          </Tabs>
          <IconButton sx = {{'padding': 0}} onClick={toggleCalendar} color="inherit">
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
                minDate = {dates[0]}
                maxDate = {dates[dates.length - 1]}
                value={date}
                shouldDisableDate = {(momentObj: any) => {
                  if (!(momentObj.format('YYYY-MM-DD') in tabDatesObject)) {
                    return true;
                  }
                  return false;
                }}
                onChange = {(momentObj) => {
                  // required for some reason
                }}
                onAccept = {(momentObj) => {
                  updateDate(null, momentObj.format('YYYY-MM-DD'), true);
                  toggleCalendar(null);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Popover>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default DateAppBar;


