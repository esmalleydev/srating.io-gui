'use client';

import React, { useState, useEffect, useRef } from 'react';
import Style from '@/components/utils/Style';
import Calendar from '../calendar/Calendar';
import TextInput from './TextInput';

// Helper to format Date -> MM/DD/YYYY
const formatDateToString = (date: Date | null): string => {
  if (!date) return '';
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

// Helper to validate a date object
const isValidDate = (d: Date | null) => {
  return d instanceof Date && !isNaN(d.getTime());
};

interface DatePickerProps {
  label: string;
  value?: string | Date; // Can accept string (ISO) or Date object
  onChange: (date: Date) => void;
  minDate?: string;
  maxDate?: string;
  style?: React.CSSProperties;
}

const DateInputWithoutPlane: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  minDate = '1900-01-01',
  maxDate = '2100-01-01',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // --- State ---
  const [isOpen, setIsOpen] = useState(false);

  // Parse initial value
  const initialDate = value ? new Date(value) : null;
  const [selectedDate, setSelectedDate] = useState<Date | null>(isValidDate(initialDate) ? initialDate : null);

  // Input string state (what the user sees)
  const [inputValue, setInputValue] = useState(formatDateToString(selectedDate));

  // --- Synchronization ---
  // If parent updates prop 'value', sync local state
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (isValidDate(d)) {
        setSelectedDate(d);
        setInputValue(formatDateToString(d));
      }
    }
  }, [value]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // On close, reset text to match the valid selected date (undoing invalid typing)
        if (selectedDate) {
          setInputValue(formatDateToString(selectedDate));
        } else {
          setInputValue('');
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedDate]);


  // Handle Input Typing (Masking & Validation)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value;

    // Simple Input Masking: Auto-add slashes for MM/DD/YYYY
    // Only add slash if deleting is not happening (simplistic check)
    if (text.length === 2 && inputValue.length === 1) text += '/';
    if (text.length === 5 && inputValue.length === 4) text += '/';

    setInputValue(text);

    // Validate Date
    // Regex check for basic MM/DD/YYYY format
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

    if (regex.test(text)) {
      const [mm, dd, yyyy] = text.split('/').map(Number);
      const newDate = new Date(yyyy, mm - 1, dd);

      if (isValidDate(newDate)) {
        // Additional check: is it within min/max bounds?
        const min = new Date(minDate).getTime();
        const max = new Date(maxDate).getTime();
        const current = newDate.getTime();

        if (current >= min && current <= max) {
          setSelectedDate(newDate);
          onChange(newDate);
          // We don't close the calendar here so they can see it update,
          // but you could set setIsOpen(false) if preferred.
        }
      }
    }
  };

  // Handle Calendar Selection
  const handleCalendarChange = (date: Date) => {
    setSelectedDate(date);
    setInputValue(formatDateToString(date));
    onChange(date);
    setIsOpen(false); // Close after selection
  };

  // --- Styles ---

  const wrapperStyle: React.CSSProperties = {
    position: 'relative', // Anchor for the absolute popup
    width: '100%',
    ...style,
  };

  const handleOnFocus = (e) => {
    setIsOpen(true);
  };

  const popupStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 4px)', // Just below input
    left: 0,
    zIndex: Style.getZIndex().calendar,
    width: '320px', // Matches calendar width
    animation: 'fadeIn 0.2s ease-out',
  };

  return (
    <div ref={containerRef} className={Style.getStyleClassName(wrapperStyle)}>
      <TextInput
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleOnFocus}
        onClick={() => setIsOpen(true)}
        autoComplete="off"
      />
      {isOpen && (
        <div className={Style.getStyleClassName(popupStyle)}>
        <Calendar
          value={selectedDate ? selectedDate.toISOString() : undefined}
          onChange={handleCalendarChange}
          minDate={minDate}
          maxDate={maxDate}
          shouldDisableDate={() => false} // Add custom logic if needed
        />
      </div>
      )}
    </div>
  );
};

export default DateInputWithoutPlane;
