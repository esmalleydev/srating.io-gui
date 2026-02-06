'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Inputs from '@/components/helpers/Inputs';

export type InputVariant = 'standard' | 'outlined' | 'filled';
export type InputFormatter = 'text' | 'number' | 'money';

export interface BaseInputProps {
  inputHandler: Inputs;
  placeholder: string;
  label?: string;
  variant?: InputVariant;
  disabled?: boolean;
  formatter?: InputFormatter;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  triggerValidation?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  onChange?: (value: string) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const useInputLogic = <T extends HTMLInputElement | HTMLTextAreaElement>(props: BaseInputProps) => {
  const {
    value: valueProp,
    defaultValue,
    formatter = 'text',
    max = null,
    min = null,
    maxLength,
    required = false,
    inputHandler,
    error: externalError,
    errorMessage: externalErrorMessage,
    triggerValidation,
    onChange: onChangeProp,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
  } = props;

  const instanceId = useMemo(() => crypto.randomUUID(), []);
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(valueProp || defaultValue || undefined);
  const [validationError, setValidationError] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState(externalErrorMessage || undefined);
  const [isTouched, setIsTouched] = useState(false);

  if (formatter === 'text' && max !== null) {
    console.warn('Input: You are using max instead of maxLength for text inputs!!');
  }

  useEffect(() => {
    if (valueProp !== undefined) {
      setInternalValue(valueProp);
    }
  }, [valueProp]);

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

  const handleValidation = useCallback((val: any): void => {
    const nextValue = val;

    if (nextValue) {
      setValidationError(false);
      setValidationErrorMessage(undefined);
    }

    if (nextValue && formatter === 'number' && typeof nextValue !== 'number') {
      const valueToCheck = nextValue.replace(/(?!^-)[^0-9.]/g, '');
      if (valueToCheck !== nextValue) {
        setValidationError(true);
        setValidationErrorMessage('Can only enter numbers');
        return;
      }
    } else if (nextValue && formatter === 'money' && typeof nextValue !== 'number') {
      const valueToCheck = nextValue.replace(/[^0-9.]/g, '');
      if (valueToCheck !== nextValue) {
        setValidationError(true);
        setValidationErrorMessage('Can only enter numbers');
        return;
      }
    }

    // Convert string inputs to numbers for min/max comparison if needed
    const numValue = nextValue !== '' && !isNaN(Number(nextValue)) ? Number(nextValue) : null;

    if (min !== null && numValue !== null && (formatter === 'number' || formatter === 'money') && numValue < min) {
      setValidationError(true);
      setValidationErrorMessage(`Must be greater than or equal to min (${min})`);
      return;
    }

    if (max !== null && numValue !== null && (formatter === 'number' || formatter === 'money') && numValue > max) {
      setValidationError(true);
      setValidationErrorMessage(`Must be less than or equal to max (${max})`);
      return;
    }

    if (maxLength && nextValue && nextValue.toString().length > maxLength) {
      setValidationError(true);
      setValidationErrorMessage(`Max characters allowed: ${maxLength}. Using ${nextValue.toString().length}`);
      return;
    }

    if (required && !nextValue && (isTouched || triggerValidation)) {
      setValidationError(true);
      setValidationErrorMessage('This field is required');
      // return;
    }
  }, [formatter, min, max, maxLength, required, isTouched, triggerValidation]);

  useEffect(() => {
    handleValidation(valueProp);
  }, [valueProp, triggerValidation, handleValidation]);

  const formatMoneyOnBlur = (val: string) => {
    if (!val) return '';
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    return num.toFixed(2);
  };

  const handleFocus = useCallback((e: React.FocusEvent<T>) => {
    setIsFocused(true);
    setIsTouched(true);
    if (onFocusProp) onFocusProp(e);
  }, [onFocusProp]);

  const handleBlur = useCallback((e: React.FocusEvent<T>) => {
    setIsFocused(false);
    let finalValue: string = e.target.value;

    if (finalValue && formatter === 'number' && typeof finalValue !== 'number') {
      finalValue = finalValue.replace(/(?!^-)[^0-9.]/g, '');
    } else if (finalValue && formatter === 'money') {
      const newValue = finalValue.replace(/[^0-9.]/g, '');
      finalValue = formatMoneyOnBlur(newValue);
    }

    setInternalValue(finalValue);
    if (valueProp !== undefined && onChangeProp) onChangeProp(finalValue);
    if (onBlurProp) onBlurProp(e);
  }, [onBlurProp, formatter, valueProp, onChangeProp]);

  const handleChange = useCallback((e: React.ChangeEvent<T>) => {
    const { value: nextValue } = e.target;
    handleValidation(nextValue);

    if (valueProp === undefined) {
      setInternalValue(nextValue);
    }
    if (onChangeProp) {
      onChangeProp(nextValue);
    }
  }, [valueProp, onChangeProp, handleValidation]);

  // Determine displayed error message
  const displayedErrorMessage = validationErrorMessage || externalErrorMessage || (validationError ? 'This field is required' : null);

  return {
    value,
    isFocused,
    hasError,
    displayedErrorMessage,
    handlers: {
      handleFocus,
      handleBlur,
      handleChange,
    },
  };
};
