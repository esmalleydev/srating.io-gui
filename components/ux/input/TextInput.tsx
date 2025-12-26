'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Style from '@/components/utils/Style';
import Typography from '../text/Typography';
import { RefObject, useCallback, useEffect, useState } from 'react';
import Objector from '@/components/utils/Objector';

type TextInputVariant = 'standard' | 'outlined' | 'filled';
type TextInputFormatter = 'text' | 'number' | 'money';


interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'placeholder' | 'onChange'> {
  ref?: RefObject<HTMLInputElement | null>;
  // Optional custom styles to merge
  style?: React.CSSProperties;
  // Optional label to display above the input
  label: string;
  variant?: TextInputVariant;
  formatter?: TextInputFormatter;
  error?: boolean; // External error control
  errorMessage?: string;
  required?: boolean;
  onChange?: (value: string | number) => void;
  triggerValidation?: boolean;
  min?: number; // for number or money formats
  max?: number; // for number or money formats
}

const TextInput: React.FC<TextInputProps> = ({
  ref = null,
  style = {},
  label,
  variant = 'outlined',
  formatter = 'text',
  error: externalError = false,
  errorMessage: externalErrorMessage,
  required = false,
  maxLength, // Native prop pulled out for clarity
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  onChange: onChangeProp,
  value: valueProp,
  triggerValidation = false,
  min = null,
  max = null,
  ...props
}) => {
  const theme = useTheme();

  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(valueProp || props.defaultValue || undefined);
  const [validationError, setValidationError] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState(externalErrorMessage || undefined);
  const [isTouched, setIsTouched] = useState(false);


  // Sync internal value if prop changes (for controlled inputs)
  useEffect(() => {
    if (valueProp !== undefined) {
      setInternalValue(valueProp);
    }
  }, [valueProp]);

  // Use the prop value if provided, otherwise use internal state
  const value = valueProp !== undefined ? valueProp : internalValue;

  const errorColor = theme.error.main;
  const textColor = theme.text.primary;

  const hasError = externalError || validationError;

  let borderColor = theme.mode === 'dark' ? theme.grey[400] : theme.grey[600];

  if (hasError) {
    borderColor = errorColor;
  } else if (isFocused) {
    borderColor = theme.mode === 'dark' ? theme.info.light : theme.info.dark;
  }
  const height = 46;

  const inputStyle: React.CSSProperties = {
    // Structure & Position
    width: '100%',
    height,
    boxSizing: 'border-box',
    color: hasError ? errorColor : textColor,
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',
    borderRadius: variant === 'outlined' ? 4 : 0,
  };

  if (variant === 'filled') {
    inputStyle.backgroundColor = theme.mode === 'dark' ? theme.grey[900] : theme.grey[300];
    inputStyle.padding = '25px 12px 8px 12px'; // Taller to accommodate space for the label
    inputStyle.border = 'none';
    inputStyle.borderBottom = 'none';
  } else if (variant === 'standard') {
    // inputStyle.fontSize = '14px';
    inputStyle.padding = '26px 0 8px 0';
    inputStyle.border = 'none';
    inputStyle.borderBottom = `2px solid ${borderColor}`;
  } else if (variant === 'outlined') {
    inputStyle.padding = '14px 12px';
    inputStyle.border = `1px solid ${borderColor}`;
  }

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    margin: variant === 'standard' ? '16px 0 4px 0' : '8px 0',
  };


  Objector.extender(inputStyle, style);

  const isLabelActive = isFocused || (
    value !== undefined && value !== ''
  );


  let labelTop = 12;
  let labelLeft = 12;
  if (variant === 'standard') {
    labelTop = 16;
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

    // Floating (active) position
    transform: isLabelActive
      ? 'translate(0, -50%) scale(0.75)' // Lift and shrink
      : 'translate(0, 0) scale(1)', // Stay put

    // Additional adjustments for 'outlined' when floating
    ...(variant === 'outlined' && isLabelActive ? {
      top: 4,
      left: 10,
      padding: '0 4px',
      backgroundColor: theme.background.main, // Background to mask the border
      zIndex: 1, // Ensure it's on top of the border
    } : {}),

    fontSize: isLabelActive ? '13px' : '14px', // Shrink font when floating
  };

  const errorTextStyle: React.CSSProperties = {
    color: errorColor,
    marginTop: '4px',
    marginLeft: variant === 'standard' ? '0px' : '4px',
    fontSize: '12px',
    minHeight: '20px', // Prevents layout jumping if you want consistent spacing
  };


  const handleValidation = (val) => {
    let nextValue = val;
    if (nextValue) {
      setValidationError(false);
      setValidationErrorMessage(undefined);
    }

    if (nextValue && formatter === 'number' && typeof nextValue !== 'number') {
      // Remove non-digits, allows for negative and decimals
      const newValue = nextValue.replace(/(?!^-)[^0-9.]/g, '');

      if (newValue !== nextValue) {
        setValidationError(true);
        setValidationErrorMessage('Can only enter numbers');
      }
      nextValue = newValue;
    } else if (nextValue && formatter === 'money') {
      // Allow digits and one dot
      const newValue = nextValue.replace(/[^0-9.]/g, '');

      if (newValue !== nextValue) {
        setValidationError(true);
        setValidationErrorMessage('Can only enter numbers');
      }

      nextValue = newValue;

      // Prevent multiple dots
      const dots = nextValue.match(/\./g);
      if (dots && dots.length > 1) {
        return undefined; // Ignore input
      }

      // Limit to 2 decimal places
      if (nextValue.includes('.')) {
        const [int, dec] = nextValue.split('.');
        if (dec && dec.length > 2) {
          return undefined; // Ignore input
        }
      }
    }

    if (
      min !== null &&
      nextValue &&
      (
        formatter === 'number' ||
        formatter === 'money'
      ) &&
      nextValue < min
    ) {
      setValidationError(true);
      setValidationErrorMessage(`Must be greater than min (${min})`);
      return undefined;
    }

    if (
      max !== null &&
      nextValue &&
      (
        formatter === 'number' ||
        formatter === 'money'
      ) &&
      nextValue > max
    ) {
      setValidationError(true);
      setValidationErrorMessage(`Must be less than max (${max})`);
      return undefined;
    }

    if (maxLength && nextValue && nextValue.length > maxLength) {
      setValidationError(true);
      setValidationErrorMessage(`Max charcters allowed: ${maxLength}`);
      return undefined;
    }

    if (
      required &&
      !nextValue &&
      (
        isTouched ||
        triggerValidation
      )
    ) {
      setValidationError(true);
    }

    return nextValue;
  };

  // --- Logic Helpers ---

  useEffect(() => {
    handleValidation(valueProp);
  }, [valueProp, triggerValidation]);

  const formatMoneyOnBlur = (val: string) => {
    if (!val) {
      return '';
    }
    const num = parseFloat(val);
    if (isNaN(num)) {
      return val;
    }
    return num.toFixed(2);
  };

  // --- Event Handlers ---

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setIsTouched(true);
    if (onFocusProp) {
      onFocusProp(e);
    }
  }, [onFocusProp]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);

    let finalValue = e.target.value;

    // 1. Handle Formatting on Blur (Money)
    if (formatter === 'money' && finalValue) {
      finalValue = formatMoneyOnBlur(finalValue);
      // We need to update the internal state to show the formatted value (e.g. 5 -> 5.00)
      // If controlled, this depends on the parent updating props via onChange,
      // but for uncontrolled we set it here.
      setInternalValue(finalValue);

      // Artificial event to ensure parent gets the formatted value
      if (valueProp !== undefined && onChangeProp) {
        // const syntheticEvent = { ...e, target: { ...e.target, value: finalValue } } as React.FocusEvent<HTMLInputElement>;
        onChangeProp(finalValue);
      }
    }

    handleValidation(finalValue);

    if (onBlurProp) {
      onBlurProp(e);
    }
  }, [onBlurProp, formatter, required, valueProp, onChangeProp, isTouched]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let { value: nextValue } = e.target;
    // --- Formatters (Input Masking) ---

    if (nextValue) {
      setValidationError(false);
      setValidationErrorMessage(undefined);
    }

    nextValue = handleValidation(nextValue);

    if (nextValue === undefined) {
      return;
    }

    // Update Internal State (Uncontrolled)
    if (valueProp === undefined) {
      setInternalValue(nextValue);
    }

    // Trigger Parent Change
    if (onChangeProp) {
      // Create a new event with the formatted value
      // e.target.value = nextValue;
      onChangeProp(nextValue);
    }
  }, [valueProp, onChangeProp, formatter, maxLength, required, isTouched]);

  // --- Determine Error Message to Display ---
  // Priority: 1. External Message, 2. Internal Required Message
  const displayedErrorMessage = validationErrorMessage || externalErrorMessage || (validationError ? 'This field is required' : null);

  // todo show maxLength on bottom right of input / how many characters I have reached

  return (
    <div className={Style.getStyleClassName(containerStyle)}>
      <div style={{ position: 'relative', width: '100%' }}>
        <Typography type = 'caption' className = {Style.getStyleClassName(labelStyle)}>{label}</Typography>
        <input
          ref = {ref}
          type='text'
          className={Style.getStyleClassName(inputStyle)}
          value={value}
          // maxLength={maxLength} use internval validation
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </div>
      <div style={{ height: 20, marginTop: 4 }}>
        {displayedErrorMessage && (
          <Typography type='caption' style={errorTextStyle}>
            {displayedErrorMessage}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default TextInput;
