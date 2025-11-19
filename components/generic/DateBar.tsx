'use client';

import React, {
  RefObject, useLayoutEffect, useRef, useState, useTransition,
} from 'react';

import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CalendarIcon from '@mui/icons-material/Event';

import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useScrollContext } from '@/contexts/scrollContext';
import { useAppDispatch } from '@/redux/hooks';
import { updateGameSort } from '@/redux/features/favorite-slice';
import { setLoading } from '@/redux/features/loading-slice';
import { setDataKey } from '@/redux/features/games-slice';
import { useTheme } from '@/components/hooks/useTheme';
import Dates from '@/components/utils/Dates';
import Color from '@/components/utils/Color';
import Style from '@/components/utils/Style';
import Calendar from '@/components/ux/calendar/Calendar';
import Plane from '@/components/ux/overlay/Plane';

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
  const backgroundColor = theme.mode === 'dark' ? theme.grey[900] : theme.primary.light;
  const selectedColor = theme.secondary.dark;

  const dateContainers: React.JSX.Element[] = [];
  for (let i = 0; i < dates.length; i++) {
    let label = Dates.format(Dates.parse(dates[i]), 'M j');
    const now = Dates.format(Dates.parse(), 'Y-m-d');

    if (dates[i] === now) {
      label = 'Today';
    } else if (
      dates[i] === Dates.format(Dates.add(Dates.parse(), 1, 'days'), 'Y-m-d') ||
      dates[i] === Dates.format(Dates.add(Dates.parse(), 2, 'days'), 'Y-m-d') ||
      dates[i] === Dates.format(Dates.add(Dates.parse(), 3, 'days'), 'Y-m-d')
    ) {
      label = Dates.format(Dates.parse(`${dates[i]}T12:00:00Z`), 'D');
    }

    const dateStyle = {
      fontSize: '12px',
      width: 60,
      minWidth: 60,
      cursor: 'pointer',
      height: '100%',
      verticalAlign: 'middle',
      display: 'flex',
      alignItems: 'center',
      borderBottom: `2px ${backgroundColor} solid`,
      '&:hover': {
        backgroundColor: Color.alphaColor('#fff', 0.25),
      },
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
        className = {Style.getStyleClassName(dateStyle)}
        onClick={() => { updateDate(dates[i], true); }}
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
    <div style = {({ display: 'flex', position: 'fixed', width: '100%', zIndex: 1100, height, backgroundColor: theme.mode === 'dark' ? theme.grey[900] : theme.primary.light })}>
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
        <Plane
          open={calendarOpen}
          onClose={toggleCalendar}
          anchor = {calAncor}
        >
          <Calendar
            minDate = {dates[0]}
            maxDate = {dates[dates.length - 1]}
            value = {date}
            shouldDisableDate = {(d: Date) => {
              if (!(Dates.format(Dates.parse(d), 'Y-m-d') in tabDatesObject)) {
                return true;
              }
              return false;
            }}
            onChange = {(d: Date) => {
              updateDate(Dates.format(d, 'Y-m-d'), true);
              toggleCalendar(null);
            }}
          />
        </Plane>
      </div>
    </div>
  );
};

export default DateBar;


