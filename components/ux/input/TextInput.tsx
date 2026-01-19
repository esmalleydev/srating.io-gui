'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Style from '@/components/utils/Style';
import Typography from '../text/Typography';
import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import Objector from '@/components/utils/Objector';
import Inputs from '@/components/helpers/Inputs';

type TextInputVariant = 'standard' | 'outlined' | 'filled';
type TextInputFormatter = 'text' | 'number' | 'money';


// todo update this to use useInputLogic hook


interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'placeholder' | 'onChange'> {
  inputHandler: Inputs;
  ref?: RefObject<HTMLInputElement | null>;
  style?: React.CSSProperties;
  placeholder: string;
  label?: string;
  variant?: TextInputVariant;
  disabled?: boolean;
  formatter?: TextInputFormatter;
  error?: boolean; // External error control
  errorMessage?: string;
  required?: boolean;
  onChange?: (value: string) => void;
  triggerValidation?: boolean;
  min?: number; // for number or money formats
  max?: number; // for number or money formats
  // reset?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  inputHandler,
  ref = null,
  style = {},
  placeholder,
  label,
  variant = 'outlined',
  disabled = false,
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
  // reset = false,
  ...props
}) => {
  const theme = useTheme();
  const instanceId = useMemo(() => crypto.randomUUID(), []);

  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(valueProp || props.defaultValue || undefined);
  const [validationError, setValidationError] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState(externalErrorMessage || undefined);
  const [isTouched, setIsTouched] = useState(false);

  if (
    formatter === 'text' &&
    max !== null
  ) {
    console.warn('TextInput: You are using max instead of maxLength for text inputs!!');
  }

  // useEffect(() => {
  //   if (reset) {
  //     setIsTouched(false);
  //     setValidationError(false);
  //   }
  // }, [reset]);


  // Sync internal value if prop changes (for controlled inputs)
  useEffect(() => {
    if (valueProp !== undefined) {
      setInternalValue(valueProp);
    }
  }, [valueProp]);

  // Use the prop value if provided, otherwise use internal state
  const value = valueProp !== undefined ? valueProp : internalValue;
  const hasError = externalError || validationError;

  const errorCallback = () => {
    return {
      validationError: hasError || (!value && required),
      validationErrorMessage: validationErrorMessage || (!value && required ? 'This field is required' : undefined),
    };
  };

  useEffect(() => {
    if (inputHandler) {
      inputHandler.register(instanceId, errorCallback);
    }

    return () => {
      if (inputHandler) {
        inputHandler.unregister(instanceId);
      }
    };
  }, [inputHandler, instanceId, errorCallback]);

  const errorColor = theme.error.main;
  let textColor = theme.text.primary;

  let borderColor = theme.mode === 'dark' ? theme.grey[400] : theme.grey[600];

  if (hasError) {
    borderColor = errorColor;
  } else if (isFocused) {
    borderColor = theme.mode === 'dark' ? theme.info.light : theme.info.dark;
  }

  if (disabled) {
    textColor = theme.text.disabled;
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
    // margin: variant === 'standard' ? '16px 0 4px 0' : '8px 0',
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
  const placeholderStyle: React.CSSProperties = {
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


  const handleValidation = (val): void => {
    const nextValue = val;

    if (nextValue) {
      setValidationError(false);
      setValidationErrorMessage(undefined);
    }

    if (nextValue && formatter === 'number' && typeof nextValue !== 'number') {
      // Remove non-digits, allows for negative and decimals
      const valueToCheck = nextValue.replace(/(?!^-)[^0-9.]/g, '');

      if (valueToCheck !== nextValue) {
        setValidationError(true);
        setValidationErrorMessage('Can only enter numbers');
        return;
      }
    } else if (nextValue && formatter === 'money' && typeof nextValue !== 'number') {
      // console.log('money', nextValue)
      // console.log('money', typeof nextValue)
      const valueToCheck = nextValue.replace(/[^0-9.]/g, '');
      // console.log('money valueToCheck', valueToCheck)
      // console.log('money after replace', nextValue)
      if (valueToCheck !== nextValue) {
        setValidationError(true);
        setValidationErrorMessage('Can only enter numbers');
        return;
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
      setValidationErrorMessage(`Must be greater than or equal to min (${min})`);
      return;
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
      setValidationErrorMessage(`Must be less than or equal to max (${max})`);
      return;
    }

    if (maxLength && nextValue && nextValue.toString().length > maxLength) {
      setValidationError(true);
      setValidationErrorMessage(`Max charcters allowed: ${maxLength}. Using ${nextValue.toString().length}`);
      return;
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
      setValidationErrorMessage('This field is required');
      // return;
    }
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

    let finalValue: string = e.target.value;

    if (finalValue && formatter === 'number' && typeof finalValue !== 'number') {
      // Remove non-digits, allows for negative and decimals
      const newValue = finalValue.replace(/(?!^-)[^0-9.]/g, '');
      finalValue = newValue;
    } else if (finalValue && formatter === 'money') {
      // Allow digits and one dot
      const newValue = finalValue.replace(/[^0-9.]/g, '');
      finalValue = formatMoneyOnBlur(newValue);
    }

    setInternalValue(finalValue);

    if (valueProp !== undefined && onChangeProp) {
      onChangeProp(finalValue);
    }

    if (onBlurProp) {
      onBlurProp(e);
    }
  }, [onBlurProp, formatter, required, valueProp, onChangeProp, isTouched]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: nextValue } = e.target;

    handleValidation(nextValue);

    // console.log('after handleValidation', nextValue)

    if (valueProp === undefined) {
      setInternalValue(nextValue);
    }

    if (onChangeProp) {
      // console.log('onChange in handleChange', nextValue)
      // console.log('onChange in handleChange type', typeof nextValue)
      onChangeProp(nextValue);
    }
  }, [valueProp, onChangeProp, formatter, maxLength, max, min, required, isTouched]);

  // --- Determine Error Message to Display ---
  // Priority: 1. External Message, 2. Internal Required Message
  const displayedErrorMessage = validationErrorMessage || externalErrorMessage || (validationError ? 'This field is required' : null);

  return (
    <div className={Style.getStyleClassName(containerStyle)}>
      {label ? <Typography type='caption' style={{ color: labelColor, marginBottom: 5 }}>{label}</Typography> : ''}
      <div style={{ position: 'relative', width: '100%' }}>
        <Typography type = 'caption' className = {Style.getStyleClassName(placeholderStyle)}>{placeholder}</Typography>
        <input
          ref = {ref}
          type='text'
          className={Style.getStyleClassName(inputStyle)}
          value={value}
          disabled = {disabled}
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
