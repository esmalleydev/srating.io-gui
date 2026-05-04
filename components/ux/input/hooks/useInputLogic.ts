/* eslint-disable consistent-return */

'use client';

import React, { useState, useMemo, useEffect, useCallback, RefObject, InputHTMLAttributes } from 'react';
import Inputs from '../Inputs';

export type InputVariant = 'standard' | 'outlined' | 'filled';
export type InputFormatter = 'text' | 'number' | 'money';
export type SelectOption = {
  label: string;
  value: string | number;
};

// Generic Value type
type Value = string | number | readonly string[] | Date | null | undefined;

// The standard return type for our "subclass" validation functions
export type ValidationResult = { isValid: boolean; errorMessage?: string };

// todo need to make some of this stuff required again, like input handler etc

export interface BaseInputProps<V = Value, T extends HTMLElement = HTMLElement> {
  inputHandler?: Inputs;
  placeholder?: string;
  label?: string;
  variant?: InputVariant;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  showError?: boolean;
  required?: boolean;
  triggerValidation?: boolean;
  value?: V;
  defaultValue?: V;

  // Handlers passed from the parent component
  onChange?: (value: V) => void;
  onFocus?: (e: React.FocusEvent<T>) => void;
  onBlur?: (e: React.FocusEvent<T>) => void;
  onClick?: (e: React.MouseEvent<T>) => void;

  // The "Method Override" for our subclasses
  validator?: (val: V, isTouched: boolean) => ValidationResult;
  transformOnBlur?: (val: V) => V;

  style?: Record<string, unknown>;
  placeholderStyle?: Record<string, unknown>;
  clearIconStyle?: Record<string, unknown>;
  icon?: React.JSX.Element;
  clear?: boolean;
  transformPlaceholder?: boolean;
}

export interface TextInputProps extends
  BaseInputProps<string | number, HTMLInputElement>,
  Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'onFocus' | 'value' | 'defaultValue' | 'style'>
  {
    onKeyDown?: (e: React.KeyboardEvent) => void;
    min?: number;
    max?: number;
    maxLength?: number;
    formatter?: InputFormatter;
    ref?: RefObject<HTMLInputElement | null>;
    name?: string;
    rightIcon?: React.JSX.Element;
  }

// export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder' | 'onChange' | 'onFocus' | 'onBlur'>, BaseInputProps {
//   ref?: RefObject<HTMLTextAreaElement | null>;
//   style?: React.CSSProperties;
//   rows?: number;
// }

export interface TextareaProps extends
  BaseInputProps<string | number, HTMLTextAreaElement>,
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder' | 'onChange' | 'onFocus' | 'onBlur' | 'defaultValue' | 'value'>
  {
    min?: number;
    max?: number;
    maxLength?: number;
    formatter?: InputFormatter;
    ref?: RefObject<HTMLTextAreaElement | null>;
    style?: Record<string, unknown>;
    rows?: number;
    rightIcon?: React.JSX.Element;
  }

export interface SelectInputProps extends BaseInputProps<string | number, HTMLDivElement> {
  options: SelectOption[];
  ref?: RefObject<HTMLDivElement | null>;
}

export interface DateInputProps extends
  BaseInputProps<string | Date | null, HTMLInputElement>,
  Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'style'>
  {
    value?: string | Date | null; // Can accept string (ISO) or Date object
    ref?: RefObject<HTMLInputElement | null>;
    // onChange?: (date: Date | null) => void;
    minDate?: string;
    maxDate?: string;
    enableTime?: boolean;
  }


const useBaseInputLogic = <V = Value, T extends HTMLElement = HTMLElement>(props: BaseInputProps<V, T>) => {
  const {
    value: valueProp,
    defaultValue,
    required = false,
    inputHandler,
    error: externalError,
    errorMessage: externalErrorMessage,
    triggerValidation,
    onChange: onChangeProp,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    onClick: onClickProp,
    validator,
    transformOnBlur,
  } = props;

  const instanceId = useMemo(() => crypto.randomUUID(), []);
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState<V | undefined>(valueProp !== undefined ? valueProp : defaultValue);
  const [isTouched, setIsTouched] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState<string | undefined>(externalErrorMessage);

  // this is for the select... i want to move it out but dont know how since everything is interconnected... if only OOP :(
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const value = valueProp !== undefined ? valueProp : internalValue;

  // Run validation whenever value, touched state, or external triggers change
  useEffect(() => {
    if (validator) {
      const result = validator(value as V, isTouched || !!triggerValidation);
      setValidationError(!result.isValid);
      setValidationErrorMessage(result.errorMessage);
    } else if (required && !value && (isTouched || triggerValidation)) {
      setValidationError(true);
      setValidationErrorMessage('This field is required');
    } else {
      setValidationError(false);
      setValidationErrorMessage(undefined);
    }
  }, [value, isTouched, triggerValidation, required, validator]);

  const hasError = externalError || validationError;
  const displayedErrorMessage = externalErrorMessage || validationErrorMessage;

  // Register with your OOP error handler
  useEffect(() => {
    if (!inputHandler) return;

    const errorCallback = () => ({
      validationError: hasError || (!value && required),
      validationErrorMessage: displayedErrorMessage || (!value && required ? 'This field is required' : undefined),
    });

    inputHandler.register(instanceId, errorCallback);
    return () => {
      if (inputHandler) {
        inputHandler.unregister(instanceId);
      }
    };
  }, [inputHandler, instanceId, hasError, displayedErrorMessage, value, required]);

  // Generic Handlers
  const handleFocus = useCallback((e: React.FocusEvent<T>) => {
    setIsFocused(true);
    setIsTouched(true);
    if (onFocusProp) onFocusProp(e);
  }, [onFocusProp]);

  const handleBlur = useCallback((e: React.FocusEvent<T>) => {
    setIsFocused(false);

    // Apply specialized transformations (like money formatting) if provided
    let finalValue = value;
    if (transformOnBlur && value !== undefined) {
      finalValue = transformOnBlur(value as V);
      if (valueProp === undefined) setInternalValue(finalValue);
      if (onChangeProp) onChangeProp(finalValue as V);
    }

    if (onBlurProp) onBlurProp(e);
  }, [onBlurProp, transformOnBlur, value, valueProp, onChangeProp]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const nextValue = e.target.value as unknown as V;
    if (valueProp === undefined) {
      setInternalValue(nextValue);
    }
    if (onChangeProp) {
      onChangeProp(nextValue);
    }
  }, [valueProp, onChangeProp]);

  const handleClick = useCallback((e) => {
    setAnchor(e.currentTarget);
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

    if (onClickProp) {
      onClickProp(e);
    }
  }, [value, required]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && isOpen) {
      handleClose();
    }
  };

  const handleClose = useCallback(() => {
    setAnchor(null);
    setIsOpen(false);
  }, []);

  return {
    value,
    isFocused,
    isTouched,
    isOpen,
    anchor,
    hasError,
    displayedErrorMessage,
    handlers: {
      handleFocus,
      handleBlur,
      handleChange,
      handleIsTouched: setIsTouched,
      handleValidationError: setValidationError,
      handleClick,
      handleClose,
      handleKeyDown,
      handleInternalValue: setInternalValue,
      handleIsOpen: setIsOpen,
    },
  };
};

export const useTextInputLogic = (props: TextInputProps | TextareaProps) => {
  const { formatter = 'text', min = null, max = null, maxLength, required } = props;

  // 1. Define specific formatting logic
  const formatMoneyOnBlur = useCallback((val: string | number) => {
    if (!val) return val;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? val : num.toFixed(2);
  }, []);

  const transformOnBlur = useCallback((val: string | number) => {
    let finalValue = val.toString();
    if (formatter === 'number') {
      finalValue = finalValue.replace(/(?!^-)[^0-9.]/g, '');
    } else if (formatter === 'money') {
      finalValue = formatMoneyOnBlur(finalValue.replace(/[^0-9.]/g, '')) as string;
    }
    return finalValue;
  }, [formatter, formatMoneyOnBlur]);

  // 2. Define specific validation logic
  const textValidator = useCallback((val: string | number | undefined, isTouched: boolean): ValidationResult => {
    const strVal = val?.toString() || '';

    if (required && !strVal && isTouched) {
      return { isValid: false, errorMessage: 'This field is required' };
    }

    if (!strVal) return { isValid: true }; // Skip remaining checks if empty

    if (formatter === 'number' || formatter === 'money') {
      const cleanVal = strVal.replace(formatter === 'number' ? /(?!^-)[^0-9.]/g : /[^0-9.]/g, '');
      if (cleanVal !== strVal) {
        return { isValid: false, errorMessage: 'Can only enter numbers' };
      }

      const numValue = !isNaN(Number(strVal)) ? Number(strVal) : null;
      if (numValue !== null) {
        if (min !== null && numValue < min) {
          return { isValid: false, errorMessage: `Must be >= ${min}` };
        }
        if (max !== null && numValue > max) {
          return { isValid: false, errorMessage: `Must be <= ${max}` };
        }
      }
    }

    if (maxLength && strVal.length > maxLength) {
      return { isValid: false, errorMessage: `Max ${maxLength} chars. Used: ${strVal.length}` };
    }

    return { isValid: true };
  }, [formatter, min, max, maxLength, required]);

  // 3. Pass down to the base hook
  return useBaseInputLogic<string | number, HTMLInputElement | HTMLTextAreaElement>({
    ...props,
    validator: textValidator,
    transformOnBlur,
  });
};


export const useSelectInputLogic = (props: SelectInputProps) => {
  const { required, options } = props;

  // const cloned = Objector.deepClone(props);

  // Select validation is usually much simpler
  const selectValidator = useCallback((val: string | number | undefined, isTouched: boolean): ValidationResult => {
    if (required && (val === undefined || val === '') && isTouched) {
      return { isValid: false, errorMessage: 'Please select an option' };
    }

    // Optional: Validate that the current value actually exists in the options list
    if (val !== undefined && val !== '' && !options.some((opt) => opt.value === val)) {
      return { isValid: false, errorMessage: 'Invalid option selected' };
    }

    return { isValid: true };
  }, [required, options]);


  return useBaseInputLogic<string | number, HTMLDivElement>({
    ...props,
    validator: selectValidator,
  });
};

