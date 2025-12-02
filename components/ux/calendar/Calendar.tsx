'use client';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { useTheme } from '@/components/hooks/useTheme';
import Dates from '@/components/utils/Dates';
import Style from '@/components/utils/Style';
import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import Paper from '../container/Paper';
import Color from '@/components/utils/Color';
import Typography from '../text/Typography';
import IconButton from '../buttons/IconButton';

// todo somday update left and right buttons to be disabled based on any games eligible on next screen
// for example in Nov, but trying to go back to Oct, if there are 0 games in Oct, then it should be disabled?


const MonthPicker = (
  {
    minDate,
    maxDate,
    currentMonth,
    setCurrentMonth,
    setViewMode,
  }:
  {
    minDate: string;
    maxDate: string;
    currentMonth: Date;
    setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
    setViewMode: React.Dispatch<React.SetStateAction<string>>;
  },
) => {
  const theme = useTheme();
  const months = useMemo(() => {
    // Generate 12 Date objects, each set to the 1st of the month in the current year
    return Array.from({ length: 12 }, (_, i) => {
      const d = Dates.parse(currentMonth); // Use Dates.parse for safety
      d.setDate(1); // Force 1st of month to avoid overflow issues (e.g. Feb 30)
      d.setMonth(i);
      return d;
    });
  }, [currentMonth]);

  const handleMonthSelect = (monthDate: Date) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthDate.getMonth()); // Set the month using local month index
    setCurrentMonth(newDate);
    setViewMode('day');
  };

  const isMonthDisabled = (dateToCheck: Date) => {
    // Normalize everything to the Start of the Month (YYYY-MM-01 00:00:00)
    // This ensures that if minDate is Nov 15th, Nov 1st is still considered "valid"
    const current = Dates.getStartOfMonth(dateToCheck).getTime();
    const min = Dates.getStartOfMonth(minDate).getTime();
    const max = Dates.getStartOfMonth(maxDate).getTime();

    return current < min || current > max;
  };

  const pickerStyle = {
    display: 'grid',
    'grid-template-columns': 'repeat(3, 1fr)',
    gap: '8px',
    height: 240,
    padding: '0px 5px',
  };

  return (
    <div className={Style.getStyleClassName(pickerStyle)}>
      {months.map((monthDate) => {
        const isSelected = monthDate.getMonth() === currentMonth.getMonth();
        const disabled = isMonthDisabled(monthDate);

        const buttonStyle: React.CSSProperties = {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '8px',
          cursor: disabled ? 'default' : 'pointer', // Remove pointer if disabled
          opacity: disabled ? 0.3 : 1, // Dim if disabled
          pointerEvents: disabled ? 'none' : 'auto', // Prevent clicks
          color: theme.text.primary,
        };

        if (isSelected && !disabled) {
          buttonStyle.backgroundColor = theme.info.main;
          buttonStyle.color = Color.getTextColor(theme.text.primary, buttonStyle.backgroundColor);
        }

        return (
          <Paper elevation={5}
            key={monthDate.getMonth()}
            hover = {true}
            style = {buttonStyle}
            onClick={() => handleMonthSelect(monthDate)}
          >
            <Typography type = 'body1'>{Dates.format(monthDate, 'F')}</Typography>
          </Paper>
        );
      })}
    </div>
  );
};


const YearPicker = (
  {
    minDate,
    maxDate,
    currentMonth,
    setCurrentMonth,
    setViewMode,
  }:
  {
    minDate: string;
    maxDate: string;
    currentMonth: Date;
    setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
    setViewMode: React.Dispatch<React.SetStateAction<string>>;
  },
) => {
  const theme = useTheme();
  const scrollRef = useRef<HTMLElement>(null);

  // Generate ONLY the years that fall within the Min/Max range
  const years = useMemo(() => {
    // Use Dates utility to safely parse and extract years
    const minYear = Dates.parse(minDate).getFullYear();
    const maxYear = Dates.parse(maxDate).getFullYear();

    const yearList: number[] = [];

    // Loop strictly from min to max
    for (let i = minYear; i <= maxYear; i++) {
      yearList.push(i);
    }

    return yearList;
  }, [minDate, maxDate]);

  // scroll year into view
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [scrollRef.current, currentMonth]);

  const handleYearSelect = (year: number) => {
    // 1. Set the current month in the calendar to the selected year
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    // 2. Switch to the month view to select the month within the new year
    setViewMode('month');
  };

  const pickerStyle = {
    display: 'grid',
    'grid-template-columns': 'repeat(3, 1fr)',
    gap: '8px',
    height: 240,
    overflowY: 'auto',
    padding: '0px 5px',
  };

  return (
    <div className={Style.getStyleClassName(pickerStyle)}>
      {years.map((year) => {
        const isSelected = year === currentMonth.getFullYear();
        const buttonStyle: React.CSSProperties = {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '8px',
          cursor: 'pointer',
        };

        if (isSelected) {
          buttonStyle.backgroundColor = theme.info.main;
          buttonStyle.color = Color.getTextColor(theme.text.primary, buttonStyle.backgroundColor);
        }

        return (
          <Paper elevation={5}
            ref = {isSelected ? scrollRef as RefObject<HTMLDivElement> : undefined}
            key={year}
            hover = {true}
            style = {buttonStyle}
            onClick={() => handleYearSelect(year)}
          >
            <Typography type = 'body1'>{year}</Typography>
          </Paper>
        );
      })}
    </div>
  );
};


const Calendar = (
  {
    value,
    onChange,
    minDate,
    maxDate,
    shouldDisableDate,
  }:
  {
    value: string | null | undefined;
    onChange: (date: Date) => void;
    minDate: string;
    maxDate: string;
    shouldDisableDate: (date: Date) => boolean;
  },
) => {
  const theme = useTheme();

  // State for the *month* we are currently viewing. Uses standard Date object.
  const today = Dates.getStartOfDay(new Date());
  const [currentMonth, setCurrentMonth] = useState(value ? Dates.getStartOfDay(new Date(value)) : today);
  // New state to track the current view: 'day', 'month', or 'year'
  const [viewMode, setViewMode] = useState('day');

  // This effect ensures that if the *parent's* `value` prop changes,
  // we navigate to that month if it's different and reset to day view.
  useEffect(() => {
    if (value && Dates.getStartOfDay(value).getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(Dates.getStartOfDay(new Date(value)));
      setViewMode('day');
    }
  }, [value]);

  const goToPrevious = () => {
    if (viewMode === 'day') {
      setCurrentMonth(Dates.add(currentMonth, -1, 'months'));
    }

    if (viewMode === 'month') {
      setCurrentMonth(Dates.add(currentMonth, -1, 'years'));
    }
  };

  const goToNext = () => {
    if (viewMode === 'day') {
      setCurrentMonth(Dates.add(currentMonth, 1, 'months'));
    }

    if (viewMode === 'month') {
      setCurrentMonth(Dates.add(currentMonth, 1, 'years'));
    }
  };

  const calendarGridDays = useMemo(() => {
    const days: Date[] = [];
    let currentDay = Dates.getStartOfGrid(currentMonth);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay = Dates.add(currentDay, 1, 'days');
    }
    return days;
  }, [currentMonth]);

  const getWeekdays = () => {
    const daysShort = Dates.getDaysShort();
    return daysShort.map((day) => day.substring(0, 2));
  };
  const weekdays = useMemo(getWeekdays, []);

  const getContents = () => {
    if (viewMode === 'month') {
      return (
        <MonthPicker
          minDate = {minDate}
          maxDate = {maxDate}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          setViewMode={setViewMode}
        />
      );
    }

    if (viewMode === 'year') {
      return <YearPicker
        minDate = {minDate}
        maxDate = {maxDate}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        setViewMode={setViewMode}
      />;
    }

    const calendarGridStyle = {
      display: 'grid',
      'grid-template-columns': 'repeat(7, 1fr)',
      gap: '2px',
    };

    const calendarWeekdayStyle = {
      fontSize: '0.7rem',
      fontWeight: 700,
      color: theme.text.secondary,
      textAlign: 'center',
      padding: '4px 0',
    };

    // Default 'day' view content
    return (
      <>
        {/* Weekday Labels */}
        <div className={Style.getStyleClassName(calendarGridStyle)}>
          {weekdays.map((day) => (
            <div key={day} className={Style.getStyleClassName(calendarWeekdayStyle)}>
              {day}
            </div>
          ))}

          {/* Day Buttons */}
          {calendarGridDays.map((day) => {
            // --- Determine Day State ---
            const isOutsideMonth = day.getMonth() !== currentMonth.getMonth();
            const isToday = Dates.isSameDay(day, today);
            const isSelected = value ? Dates.isSameDay(day, value) : false;

            // --- Determine if Disabled ---
            let isDisabled = false;

            if (minDate && Dates.isBeforeDay(day, minDate)) {
              isDisabled = true;
            }
            if (maxDate && Dates.isAfterDay(day, maxDate)) {
              isDisabled = true;
            }
            if (!isDisabled && shouldDisableDate && shouldDisableDate(day)) {
              isDisabled = true;
            }

            const buttonStyle: React.CSSProperties = {
              fontSize: '0.85rem',
              fontWeight: 500,
              width: '40px',
              height: '40px',
              margin: '1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              backgroundColor: 'transparent',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
              color: 'inherit',
              borderColor: 'inherit',
            };

            if (isDisabled) {
              buttonStyle.backgroundColor = 'transparent';
              // eslint-disable-next-line prefer-destructuring
              buttonStyle.color = theme.text.disabled;
              buttonStyle.cursor = 'not-allowed';
            }

            if (isOutsideMonth) {
              // eslint-disable-next-line prefer-destructuring
              buttonStyle.color = theme.grey[400];
            }

            const selectedColor = theme.mode === 'dark' ? theme.info.dark : theme.info.light;

            if (isToday) {
              buttonStyle.border = `2px solid ${selectedColor}`;
            }
            if (isToday && isSelected) {
              buttonStyle.borderColor = '#fff';
            }

            if (isSelected) {
              buttonStyle.backgroundColor = selectedColor;
              buttonStyle.color = '#fff';
              buttonStyle.fontWeight = 600;
              buttonStyle['&:hover'] = {
                backgroundColor: theme.info.main,
              };
            }


            return (
              <button
                key={day.valueOf()}
                type="button"
                className={Style.getStyleClassName(buttonStyle)}
                onClick={() => onChange(day)}
                disabled={isDisabled}
              >
                {Dates.format(day, 'j')}
              </button>
            );
          })}
        </div>
      </>
    );
  };

  const containerHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  };

  const headerTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: 600,
    display: 'flex',
    gap: '8px',
  };

  const headerSegStyle = {
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: '4px',
    transition: 'background-color 0.15s ease-in-out',
    '&:hover': {
      backgroundColor: theme.action.hover,
    },
  };

  return (
    <>
      <Paper style = {{ width: 320, padding: '8px' }}>
        <div className={Style.getStyleClassName(containerHeaderStyle)}>
          <IconButton value = 'left' onClick={goToPrevious} disabled={viewMode !== 'day' && viewMode !== 'month'} icon = {<KeyboardArrowLeftIcon />} />
          <div className={Style.getStyleClassName(headerTitleStyle)}>
            <div
              className={Style.getStyleClassName(headerSegStyle)}
              onClick={() => setViewMode('month')}
            >
              {Dates.format(currentMonth, 'F')}
            </div>
            <div
              className={Style.getStyleClassName(headerSegStyle)}
              onClick={() => setViewMode('year')}
            >
              {Dates.format(currentMonth, 'Y')}
            </div>
          </div>
          <IconButton value = 'right' onClick={goToNext} disabled={viewMode !== 'day' && viewMode !== 'month'} icon = {<KeyboardArrowRightIcon />} />
        </div>
        {getContents()}
      </Paper>
    </>
  );
};

export default Calendar;
