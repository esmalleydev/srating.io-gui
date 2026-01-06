'use client';

import React, { useState, useEffect, useRef } from 'react';
import Style from '@/components/utils/Style';
import Calendar from '../calendar/Calendar';
import TextInput from './TextInput';
import Plane from '../overlay/Plane';
import Inputs from '@/components/helpers/Inputs';
import Dates from '@/components/utils/Dates';
import Paper from '../container/Paper';
import Objector from '@/components/utils/Objector';
import { useTheme } from '@/components/hooks/useTheme';


// Helper to validate a date object
const isValidDate = (d: Date | null) => {
  return d instanceof Date && !isNaN(d.getTime());
};

// Simple utility to pad numbers (e.g. 9 -> '09')
const pad = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

/**
 * Converts a Date object to 12-hour format parts
 */
const to12HourTime = (date: Date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const meridiem = hours >= 12 ? 'PM' : 'AM';

  // eslint-disable-next-line operator-assignment
  hours = hours % 12;
  // eslint-disable-next-line no-unneeded-ternary
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return { hours, minutes, meridiem };
};

/**
 * Converts 12-hour parts back to 24-hour integer (0-23)
 */
const to24Hour = (hours: number, meridiem: string) => {
  let h = hours;

  if (meridiem && meridiem.toUpperCase() === 'PM' && h < 12) {
    h += 12;
  }

  if (meridiem && meridiem.toUpperCase() === 'AM' && h === 12) {
    h = 0;
  }

  return h;
};

interface DatePickerProps {
  inputHandler: Inputs;
  placeholder: string;
  label?: string;
  value?: string | Date; // Can accept string (ISO) or Date object
  onChange: (date: Date | null) => void;
  minDate?: string;
  maxDate?: string;
  style?: React.CSSProperties;
  error?: boolean; // External error control
  errorMessage?: string;
  required?: boolean;
  triggerValidation?: boolean;
  enableTime?: boolean;
}

const DateInput: React.FC<DatePickerProps> = ({
  inputHandler,
  placeholder,
  label,
  value,
  onChange,
  minDate = '1900-01-01',
  maxDate = '2100-01-01',
  style,
  error: externalError = false,
  errorMessage: externalErrorMessage,
  required = false,
  triggerValidation = false,
  enableTime = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // --- State ---
  const [isOpen, setIsOpen] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [internalError, setInternalError] = useState(false);
  const [internalErrorMessage, setInternalErrorMessage] = useState('');

  const displayFormat = enableTime ? 'm/d/Y h:i a' : 'm/d/Y';

  // Parse initial value
  const initialDate = value ? Dates.parse(value) : null;
  const [selectedDate, setSelectedDate] = useState<Date | null>(isValidDate(initialDate) ? initialDate : null);
  const [calAncor, setCalAncor] = useState(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const skipOpenRef = useRef(false);
  const textRef = useRef<HTMLInputElement | null>(null);

  // Input string state (what the user sees)
  const [inputValue, setInputValue] = useState(selectedDate ? Dates.format(selectedDate, displayFormat) : '');

  // --- Synchronization ---
  // If parent updates prop 'value', sync local state
  useEffect(() => {
    if (value) {
      const d = Dates.parse(value);
      if (isValidDate(d)) {
        if (minDate && Dates.format(d, 'Y-m-d') < minDate) {
          setInternalError(true);
          setInternalErrorMessage(`Date must be greater than ${minDate}`);
          return;
        }

        if (maxDate && Dates.format(d, 'Y-m-d') > maxDate) {
          setInternalError(true);
          setInternalErrorMessage(`Date must be less than ${maxDate}`);
          return;
        }


        setSelectedDate(d);
        setInputValue(Dates.format(d, displayFormat));
        setInternalError(false);
        setInternalErrorMessage('');
      } else {
        setInternalError(true);
        setInternalErrorMessage('Invalid date');
      }
    }
  }, [value, minDate, maxDate]);



  // Handle Input Typing (Masking & Validation)
  const handleInputChange = (val) => {
    let text = val;

    // Simple Input Masking: Auto-add slashes for MM/DD/YYYY
    // Only add slash if deleting is not happening (simplistic check)
    if (text.length <= 10) {
      if (text.length === 2 && inputValue.length === 1) {
        text += '/';
      }
      if (text.length === 5 && inputValue.length === 4) {
        text += '/';
      }
    }

    // Auto-add space after year for time
    if (enableTime && text.length === 10 && inputValue.length === 9) {
      text += ' ';
    }
    // Auto-add colon
    if (enableTime && text.length === 13 && inputValue.length === 12) {
      text += ':';
    }
    // Auto-add space after minutes
    if (enableTime && text.length === 16 && inputValue.length === 15) {
      text += ' ';
    }

    setInputValue(text);

    // Regex:
    // Date only: ^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$
    // Date + Time (HH:MM): ...\s([0-1]?[0-9]|2[0-3]):[0-5][0-9]$

    let regex;
    if (enableTime) {
      // Matches MM/DD/YYYY HH:MM AM/PM
      // (0[1-9]|1[0-2]) -> Months 01-12
      // (0[1-9]|1[0-2]) -> Hours 01-12
      regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}\s(0[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM|am|pm)$/;
    } else {
      regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    }


    if (regex.test(text)) {
      let newDate: Date;

      if (enableTime) {
        const [dateStr, timeStr, meridiem] = text.split(' '); // Split "01/01/2000" and "12:00 PM"

        const [mm, dd, yyyy] = dateStr.split('/').map(Number);
        const [hh, min] = timeStr.split(':').map(Number);

        const hours24 = to24Hour(hh, meridiem);
        newDate = new Date(yyyy, mm - 1, dd, hours24, min);
      } else {
        const [mm, dd, yyyy] = text.split('/').map(Number);
        newDate = new Date(yyyy, mm - 1, dd);
      }

      if (isValidDate(newDate)) {
        // Additional check: is it within min/max bounds?
        const min = new Date(minDate).getTime();
        const max = new Date(maxDate).getTime();
        const current = newDate.getTime();

        if (current >= min && current <= max) {
          setSelectedDate(newDate);
          onChange(newDate);
          setInternalError(false);
          setInternalErrorMessage('');
          // We don't close the calendar here so they can see it update,
          // but you could set setIsOpen(false) if preferred.
        }
      } else {
        onChange(null);
        setSelectedDate(null);
        setInternalError(true);
        setInternalErrorMessage('Invalid date');
      }
    } else {
      onChange(null);
      setSelectedDate(null);
      setInternalError(true);
      setInternalErrorMessage('Invalid date');
    }
  };

  // Handle Calendar Selection
  const handleCalendarChange = (date: Date) => {
    // console.log('handleCalendarChange', date)
    // If we have an existing time selected, preserve it
    const newDate = new Date(date);
    // console.log('newDate 1', newDate)
    // console.log('selectedDate', selectedDate)
    if (selectedDate && enableTime) {
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
    }
    // console.log('newDate 2', newDate)
    setSelectedDate(newDate);

    // console.log('displayFormat', displayFormat)
    // console.log('Dates.format(newDate, displayFormat)', Dates.format(newDate, displayFormat))

    setInputValue(Dates.format(newDate, displayFormat));
    onChange(newDate);
    setInternalError(false);
    setInternalErrorMessage('');

    // If only Date mode, close. If Time mode, keep open to pick time.
    if (!enableTime) {
      skipOpenRef.current = true; // Tell the input not to open the calendar
      setIsOpen(false);
      textRef.current?.focus(); // Now safe to focus the input
    }
  };

  // Handle Time Selection
  const handleTimeChange = (type: 'hour' | 'minute' | 'meridiem', val: number | string) => {
    const baseDate = selectedDate || new Date(); // Default to Now if null
    const currentStats = to12HourTime(baseDate);

    let newHours = currentStats.hours;
    let newMinutes = currentStats.minutes;
    let newMeridiem = currentStats.meridiem;

    if (type === 'hour') {
      newHours = val as number;
    }
    if (type === 'minute') {
      newMinutes = val as number;
    }
    if (type === 'meridiem') {
      newMeridiem = val as string;
    }

    const hours24 = to24Hour(newHours, newMeridiem);

    const newDate = new Date(baseDate);
    newDate.setHours(hours24);
    newDate.setMinutes(newMinutes);

    setSelectedDate(newDate);
    setInputValue(Dates.format(newDate, displayFormat));
    onChange(newDate);
  };

  // --- Styles ---

  const wrapperStyle: React.CSSProperties = {
    position: 'relative', // Anchor for the absolute popup
    width: '100%',
    ...style,
  };

  const handleOnFocus = (e) => {
    if (skipOpenRef.current) {
      skipOpenRef.current = false; // Reset the flag
      return; // Do nothing
    }
    // setIsTouched(true);
    setIsOpen(true);
    setCalAncor(e.currentTarget);
  };

  const handleOnBlur = (e: React.FocusEvent) => {
    // we dont need this to close the calendar anymore, the Plane component handles it
    // keeping this here in case we want to do something else on blur of input
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && isOpen) {
      // If tabbing forward and the calendar is open
      if (!e.shiftKey) {
        // Find the first focusable element in the calendar (usually a button)
        const focusable = calendarRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if (focusable && focusable.length > 0) {
          e.preventDefault(); // Stop from going to the next input
          (focusable[0] as HTMLElement).focus();
        }
      }
    }
  };

  const handleCalendarKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') {
      return;
    }

    const focusableElements = calendarRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) as NodeListOf<HTMLElement>;

    if (!focusableElements || focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // If Shift + Tab on the first element -> Go back to the Text Input
    if (e.shiftKey && e.key === 'Tab' && document.activeElement === firstElement) {
      e.preventDefault();
      // Logic to focus your TextInput ref

      if (textRef && textRef.current) {
        textRef.current.focus();
      }
    }

    // If Tab on the last element -> Manually move focus to the NEXT input in the form
    if (!e.shiftKey && e.key === 'Tab' && document.activeElement === lastElement) {
      e.preventDefault();
      setIsOpen(false); // Close the calendar

      // Find the next input in the main document flow
      const inputs = Array.from(document.querySelectorAll('input, button, select'));
      const currentIndex = inputs.indexOf(containerRef.current?.querySelector('input') as HTMLInputElement);
      const nextInput = inputs[currentIndex + 1] as HTMLElement;

      if (nextInput) {
        nextInput.focus();
      }
    }
  };


  const handlePlaneOnClose = (e) => {
    setIsOpen(false);
    setCalAncor(null);
  };

  const handleTextInputClick = (e) => {
    setIsOpen(true);
  };

  // Generate options for time selects
  const hoursList = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
  const minutesList = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10...
  const meridiemList = ['AM', 'PM'];

  const { hours: curH, minutes: curM, meridiem: curMeridiem } = selectedDate ? to12HourTime(selectedDate) : { hours: 12, minutes: 0, meridiem: 'PM' };


  const timeSeperatorStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 5px',
  };

  return (
    <div ref={containerRef} className={Style.getStyleClassName(wrapperStyle)}>
      <TextInput
        inputHandler={inputHandler}
        ref = {textRef}
        placeholder={placeholder}
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onClick={handleTextInputClick}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        error = {internalError || externalError}
        errorMessage = {internalErrorMessage || externalErrorMessage}
        required = {required}
        triggerValidation = {triggerValidation}
      />
      <Plane
        open={isOpen}
        onClose={handlePlaneOnClose}
        anchor = {calAncor}
      >
        <div
          ref = {calendarRef}
          onKeyDown={handleCalendarKeyDown}
        >
          <Calendar
            value={Dates.format(Dates.parse(selectedDate), 'Y-m-d H:i:s')}
            // value={selectedDate ? selectedDate.toISOString() : undefined}
            onChange={handleCalendarChange}
            minDate={minDate}
            maxDate={maxDate}
            shouldDisableDate={() => false} // Add custom logic if needed
          />

          {/* Time Picker Controls */}
          {enableTime && (
            <Paper style = {{
              display: 'flex',
              flexDirection: 'row',
              height: 100,
              marginTop: 5,
              overflow: 'hidden',
            }}>
              <TimeColumn
                items={hoursList}
                selected={curH}
                onSelect={(v) => handleTimeChange('hour', v)}
                format={(v) => v.toString()}
              />

              <div style={timeSeperatorStyle}>:</div>

              <TimeColumn
                items={minutesList}
                selected={curM}
                onSelect={(v) => handleTimeChange('minute', v)}
                format={(v) => pad(v as number)}
              />

              <div style={timeSeperatorStyle}>&nbsp;</div>

              <TimeColumn
                items={meridiemList}
                selected={curMeridiem}
                onSelect={(v) => handleTimeChange('meridiem', v)}
                format={(v) => v as string}
              />
            </Paper>
          )}
        </div>
      </Plane>
    </div>
  );
};

interface TimeColumnProps {
  items: number[] | string[];
  selected: number | string;
  onSelect: (val: number | string) => void;
  format: (val: number | string) => string;
}

const TimeColumn: React.FC<TimeColumnProps> = ({ items, selected, onSelect, format }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const theme = useTheme();

  // Auto-scroll to selected item on open/change
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector('[data-selected="true"]') as HTMLElement;
      if (selectedEl) {
        listRef.current.scrollTo({
          top: selectedEl.offsetTop - listRef.current.offsetTop,
          behavior: 'smooth',
        });
      }
    }
  }, [selected]); // Run whenever selection changes (or on mount)

  return (
    <ul ref={listRef} style={{
      listStyle: 'none',
      margin: 0,
      padding: '5px',
      flex: 1,
      overflowY: 'auto',
      textAlign: 'center',
      // Hide scrollbar for cleaner look
      scrollbarWidth: 'none', // Firefox
      msOverflowStyle: 'none', // IE
    }}>
      {items.map((item) => {
        const isSelected = item === selected;
        return (
          <li
            key={item}
            data-selected={isSelected}
            style={Objector.extender(
              {
                padding: '8px 0',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '14px',
                transition: 'background 0.2s',
              },
              (isSelected ? { backgroundColor: (theme.mode === 'dark' ? theme.info.dark : theme.info.main), color: '#fff' } : {}),
            )}
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent blur of input
              onSelect(item);
            }}
          >
            {format(item)}
          </li>
        );
      })}
    </ul>
  );
};




export default DateInput;
