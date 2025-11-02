'use client';

import React, {
  RefObject, useLayoutEffect, useRef, useState, useTransition,
} from 'react';
import { useTheme } from '@mui/material/styles';

import Popover from '@mui/material/Popover';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CalendarIcon from '@mui/icons-material/Event';

import moment from 'moment';
import { Dimensions, useWindowDimensions } from '../hooks/useWindowDimensions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useScrollContext } from '@/contexts/scrollContext';
import { useAppDispatch } from '@/redux/hooks';
import { updateGameSort } from '@/redux/features/favorite-slice';
import { setLoading } from '@/redux/features/loading-slice';
import { setDataKey } from '@/redux/features/games-slice';

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

const getDateBarHeight: () => number = () => {
  return 40;
};

export { getMarginTop, getBreakPoint, getDateBarHeight };

const DateBar = (
  { dates, date }:
  { dates: string[]; date: string | null; },
) => {
  const theme = useTheme();

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const scrollRefDateBar = useRef<HTMLDivElement>(null);
  const scrollRefDate = useRef<HTMLDivElement>(null);

  const [isPending, startTransition] = useTransition();

  const scrollRef = useScrollContext();

  const dispatch = useAppDispatch();


  // For speed, lookups
  const tabDatesObject = {};

  for (let i = 0; i < dates.length; i++) {
    tabDatesObject[dates[i]] = true;
  }

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calAncor, setCalAncor] = useState(null);

  const updateDate = (value: string | null, opt_extact: boolean) => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }

    let newDate: string | null = null;

    if (opt_extact && value !== null) {
      newDate = value;
    } else if (value !== null) {
      newDate = dates[value];
    }

    if (newDate !== null && searchParams?.get('date') !== newDate) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('date', newDate);
      const search = current.toString();
      const query = search ? `?${search}` : '';

      dispatch(setDataKey({ key: 'refreshEnabled', value: false }));
      dispatch(setDataKey({ key: 'scrollTop', value: 0 }));
      dispatch(setLoading(true));
      startTransition(() => {
        router.replace(`${pathName}${query}`);
      });
    }
    dispatch(updateGameSort(null));
  };

  const height = getDateBarHeight();
  const backgroundColor = theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.primary.light;
  const selectedColor = theme.palette.secondary.dark;


  const dateContainers: React.JSX.Element[] = [];
  for (let i = 0; i < dates.length; i++) {
    let label = moment(dates[i]).format('MMM D');
    if (dates[i] === moment().format('YYYY-MM-DD')) {
      label = 'Today';
    } else if (
      dates[i] === moment().add(1, 'days').format('YYYY-MM-DD') ||
      dates[i] === moment().add(2, 'days').format('YYYY-MM-DD') ||
      dates[i] === moment().add(3, 'days').format('YYYY-MM-DD')
    ) {
      label = moment(dates[i]).format('ddd');
    }

    const dateStyle: React.CSSProperties = {
      fontSize: '12px',
      width: 60,
      minWidth: 60,
      cursor: 'pointer',
      height: '100%',
      verticalAlign: 'middle',
      display: 'flex',
      alignItems: 'center',
      borderBottom: `2px ${backgroundColor} solid`,
    };

    let dateBarRef: RefObject<HTMLDivElement> | null = null;
    if (dates[i] === date) {
      dateBarRef = scrollRefDate as RefObject<HTMLDivElement>;
      dateStyle.borderBottom = `2px ${selectedColor} solid`;
    }

    // todo make the inner an a tag with the link
    dateContainers.push(
      <div
        ref = {dateBarRef}
        key = {dates[i]}
        style = {dateStyle}
        onClick={() => { updateDate(dates[i], true); }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.palette.action.hover; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = backgroundColor; }}
      >
        <div style = {{ width: '100%' }}>{label}</div>
      </div>,
    );
  }

  const scrollToElement = () => {
    scrollRefDate.current?.scrollIntoView({ inline: 'center', behavior: 'smooth' });
  };

  const scrollLeft = () => {
    if (scrollRefDateBar.current) {
      scrollRefDateBar.current.scrollTo({ left: scrollRefDateBar.current.scrollLeft - 100, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRefDateBar.current) {
      scrollRefDateBar.current.scrollTo({ left: scrollRefDateBar.current.scrollLeft + 100, behavior: 'smooth' });
    }
  };

  useLayoutEffect(() => {
    scrollToElement();
  }, [date]);


  const toggleCalendar = (e) => {
    if (calendarOpen) {
      setCalAncor(null);
    } else if (e) {
      setCalAncor(e.currentTarget);
    }
    setCalendarOpen(!calendarOpen);
  };


  return (
    <div style = {({ display: 'flex', position: 'fixed', width: '100%', zIndex: 1100, height, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.primary.light })}>
      <div style = {{ display: 'inline-flex' }}>
        <IconButton onClick={scrollLeft}>
          <KeyboardArrowLeftIcon />
        </IconButton>
      </div>
      <div ref = {scrollRefDateBar} style = {{ display: 'inline-flex', overflowX: 'scroll', overflowY: 'hidden', scrollbarWidth: 'none', height: '100%', textAlign: 'center', alignItems: 'center' }}>
        {dateContainers}
      </div>
      <div style = {{ display: 'inline-flex', paddingRight: 8 }}>
        <IconButton onClick={scrollRight}>
          <KeyboardArrowRightIcon />
        </IconButton>
        <IconButton sx = {{ padding: 0 }} onClick={toggleCalendar} color="inherit">
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
              minDate = {moment(dates[0])}
              maxDate = {moment(dates[dates.length - 1])}
              value={moment(date)}
              shouldDisableDate = {(momentObj: moment.Moment) => {
                if (!(momentObj.format('YYYY-MM-DD') in tabDatesObject)) {
                  return true;
                }
                return false;
              }}
              onChange = {(momentObj) => {
                // required for some reason
              }}
              onAccept = {(momentObj: moment.Moment) => {
                updateDate(momentObj.format('YYYY-MM-DD'), true);
                toggleCalendar(null);
              }}
            />
          </LocalizationProvider>
        </Popover>
      </div>
    </div>
  );
};

export default DateBar;


