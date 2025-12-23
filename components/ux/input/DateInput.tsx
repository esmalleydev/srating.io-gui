'use client';

import React, { useState, useEffect, useRef } from 'react';
import Style from '@/components/utils/Style';
import Calendar from '../calendar/Calendar';
import TextInput from './TextInput';
import Plane from '../overlay/Plane';


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
  error?: boolean; // External error control
  errorMessage?: string;
  required?: boolean;
}

const DateInput: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  minDate = '1900-01-01',
  maxDate = '2100-01-01',
  style,
  error: externalError = false,
  errorMessage: externalErrorMessage,
  required = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // --- State ---
  const [isOpen, setIsOpen] = useState(false);

  // Parse initial value
  const initialDate = value ? new Date(value) : null;
  const [selectedDate, setSelectedDate] = useState<Date | null>(isValidDate(initialDate) ? initialDate : null);
  const [calAncor, setCalAncor] = useState(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const skipOpenRef = useRef(false);
  const textRef = useRef<HTMLInputElement | null>(null);

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
    skipOpenRef.current = true; // Tell the input not to open the calendar
    setIsOpen(false);
    textRef.current?.focus(); // Now safe to focus the input
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
    setIsOpen(true);
    setCalAncor(e.currentTarget);
  };

  const handleOnBlur = (e: React.FocusEvent) => {
    // e.relatedTarget is the element that is GAINING focus
    const target = e.relatedTarget as Node;

    // If the user clicked or tabbed into something NOT inside our container, close it
    if (containerRef.current && !containerRef.current.contains(target)) {
      // Check if it's also not inside the calendar (in case of a Portal)
      if (calendarRef.current && !calendarRef.current.contains(target)) {
        setIsOpen(false);
        setCalAncor(null);
      }
    }
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


  return (
    <div ref={containerRef} className={Style.getStyleClassName(wrapperStyle)}>
      <TextInput
        ref = {textRef}
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onClick={handleTextInputClick}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        error = {externalError}
        errorMessage = {externalErrorMessage}
        required = {required}
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
            value={selectedDate ? selectedDate.toISOString() : undefined}
            onChange={handleCalendarChange}
            minDate={minDate}
            maxDate={maxDate}
            shouldDisableDate={() => false} // Add custom logic if needed
          />
        </div>
      </Plane>
    </div>
  );
};

export default DateInput;
