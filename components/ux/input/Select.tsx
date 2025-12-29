'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { useTheme } from '@/components/hooks/useTheme';
import Style from '@/components/utils/Style';
import Typography from '../text/Typography';
import Paper from '../container/Paper';
import Objector from '@/components/utils/Objector';
import Menu, { MenuOption } from '../menu/Menu';

export type SelectOption = {
  label: string;
  value: string | number;
};

type SelectVariant = 'standard' | 'outlined' | 'filled';

interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string | number | null; // Controlled value
  defaultValue?: string | number | null; // Uncontrolled default
  onChange?: (value: string | number) => void;
  variant?: SelectVariant;
  style?: React.CSSProperties;
  placeholder?: string;
  required?: boolean;
  error?: boolean; // External error control
  errorMessage?: string; // External error message
  triggerValidation?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value: valueProp,
  defaultValue,
  onChange,
  variant = 'outlined',
  style = {},
  placeholder = '',
  required = false,
  error: externalError = false,
  errorMessage: externalErrorMessage,
  triggerValidation = false,
}) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // --- State ---
  const [isOpen, setIsOpen] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || null);
  const [validationError, setValidationError] = useState(false); // Internal validation state
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const [width, setWidth] = useState(0);

  // Determine current value (Controlled vs Uncontrolled)
  const value = valueProp !== undefined ? valueProp : internalValue;

  // Find the selected option object to display its label
  const selectedOption = useMemo(() => options.find((o) => o.value === value), [options, value]);

  const errorColor = theme.error.main;
  const hasError = (externalError || !!externalErrorMessage || validationError);

  // Determine Error Message to Display
  const displayedErrorMessage = externalErrorMessage || (validationError ? 'This field is required' : null);


  useEffect(() => {
    if (inputRef && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();

      setWidth(rect.width);
    }
  }, [inputRef]);

  // useEffect(() => {
  //   if (containerRef && containerRef.current) {
  //     setAnchorEl(containerRef.current);
  //   } else {
  //     setAnchorEl(null);
  //   }
  // }, [containerRef]);

  // --- Handlers ---

  const handleSelect = (optionValue: string | number) => {
    if (valueProp === undefined) {
      setInternalValue(optionValue);
    }
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);

    // Clear validation error when a selection is made
    if (required && optionValue) {
      setValidationError(false);
    }
  };

  // Custom click handler to toggle dropdown
  const handleToggle = (e) => {
    setAnchorEl(e.currentTarget);
    setIsTouched(true);
    // If opening, ensure no validation error state is immediately visible unless required
    if (!isOpen) {
      setValidationError(false);
    }
    setIsOpen(!isOpen);

    // Perform blur/validation check when closing
    if (isOpen && required) {
      if (!value) {
        setValidationError(true);
      }
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && isOpen) {
      console.log('key down select shit')
      handleToggle(e);
      return;
    }

    // if (e.key === 'Enter' || e.key === ' ') {
    //   e.preventDefault();
    //   if (!isOpen) {
    //     setIsOpen(true);
    //   } else if (options[activeIndex]) {
    //     handleSelect(options[activeIndex].value);
    //   }
    // }

    // if (e.key === 'ArrowDown') {
    //   e.preventDefault();
    //   if (!isOpen) {
    //     setIsOpen(true);
    //   }
    //   setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
    // }

    // if (e.key === 'ArrowUp') {
    //   e.preventDefault();
    //   setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    // }

    // if (e.key === 'Escape') {
    //   setIsOpen(false);
    // }
  };



  // Click outside to close
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
  //       setIsOpen(false);
  //       // Validation check on outside click/blur
  //       if (required && !value) {
  //         setValidationError(true);
  //       } else {
  //         setValidationError(false);
  //       }
  //     }
  //   };
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, [required, value]);

  // --- Styling Logic (Matches Text.tsx) ---

  const isFocused = isOpen;
  const isLabelActive = isFocused || !!value || !!selectedOption;

  const textColor = theme.text.primary;
  let borderColor = theme.mode === 'dark' ? theme.grey[400] : theme.grey[600];

  if (hasError) {
    borderColor = errorColor;
  } else if (isFocused) {
    borderColor = theme.mode === 'dark' ? theme.info.light : theme.info.dark;
  }

  const height = 46;

  // Base styling for the "Input" box
  const triggerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height,
    boxSizing: 'border-box',
    color: textColor,
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',
    borderRadius: variant === 'outlined' ? 4 : 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
  };

  // Variant specifics
  if (variant === 'filled') {
    triggerStyle.backgroundColor = theme.mode === 'dark' ? theme.grey[900] : theme.grey[300];
    triggerStyle.padding = '25px 36px 8px 12px'; // Extra right padding for arrow
    triggerStyle.border = 'none';
    triggerStyle.borderBottom = 'none';
  } else if (variant === 'standard') {
    triggerStyle.padding = '8px 24px 8px 0';
    triggerStyle.border = 'none';
    triggerStyle.borderBottom = `2px solid ${borderColor}`;
  } else if (variant === 'outlined') {
    triggerStyle.padding = '14px 36px 14px 12px';
    triggerStyle.border = `1px solid ${borderColor}`;
  }

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    margin: variant === 'standard' ? '16px 0 4px 0' : '8px 0',
  };

  Objector.extender(triggerStyle, style);

  // Label Positioning Logic
  let labelTop = 12;
  let labelLeft = 12;
  if (variant === 'standard') {
    labelTop = 8;
    labelLeft = 0;
  }

  let labelColor = theme.text.secondary;
  if (isFocused) {
    labelColor = borderColor;
  } else if (hasError) {
    labelColor = errorColor;
  }

  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    pointerEvents: 'none',
    color: labelColor,
    transition: 'all 0.3s ease-out',
    transformOrigin: 'top left',
    top: labelTop,
    left: labelLeft,

    // Floating animation
    transform: isLabelActive
      ? 'translate(0, -50%) scale(0.75)'
      : 'translate(0, 0) scale(1)',

    // Outlined background masking
    ...(variant === 'outlined' && isLabelActive ? {
      top: 4,
      left: 10,
      padding: '0 4px',
      backgroundColor: theme.background.main,
      zIndex: 1,
    } : {}),

    fontSize: isLabelActive ? '13px' : '14px',
  };

  const arrowIconStyle: React.CSSProperties = {
    position: 'absolute',
    right: variant === 'standard' ? 0 : 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: labelColor,
    pointerEvents: 'none', // Allow clicking through the icon
  };

  const errorTextStyle: React.CSSProperties = {
    color: errorColor,
    marginTop: '4px',
    marginLeft: variant === 'standard' ? '0px' : '4px',
    fontSize: '12px',
    minHeight: displayedErrorMessage ? '20px' : '0px',
  };

  const menuStyle: React.CSSProperties = {
    marginTop: 10,
  };

  if (width) {
    menuStyle.width = width;
  }

  // convert the select option to a menu option, basically just attached the onSelect handler
  const menuOptions: MenuOption[] = options.map((option) => {
    return Objector.extender(option, { onSelect: handleSelect, selectable: true });
  });


  return (
    <div
      ref={containerRef}
      className={Style.getStyleClassName(containerStyle)}
      onKeyDown={handleKeyDown}
      onFocus={(e) => {
        if (!isOpen) {
          handleToggle(e);
        }
      }}
      tabIndex={0}
    >
      <div style={{ position: 'relative', width: '100%' }}>
        {/* Label */}
        <Typography type="caption" className={Style.getStyleClassName(labelStyle)}>
          {label}
        </Typography>

        {/* Trigger Box (Looks like Input) */}
        <div
          ref = {inputRef}
          className={Style.getStyleClassName(triggerStyle)}
          onClick={(e) => {console.log('trigger box on click'); handleToggle(e)}}
          // tabIndex={0}
        >
          <Typography type="body1" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </Typography>

          <div style={arrowIconStyle}>
              {isOpen ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
          </div>
        </div>
        <Menu
          open = {isOpen}
          options = {menuOptions}
          anchor={anchorEl}
          onClose = {() => {
            console.log('onClose')
            setIsOpen(false);
            setAnchorEl(null);
          }}
          style = {menuStyle}
        />
      </div>
      {/* Error Message Display */}
      <div style={{ height: 20, marginTop: 4 }}>
        {displayedErrorMessage && (isTouched || triggerValidation) && (
          <Typography type="caption" style={errorTextStyle}>
            {displayedErrorMessage}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Select;
