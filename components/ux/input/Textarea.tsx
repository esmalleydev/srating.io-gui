'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Style from '@/components/utils/Style';
import Typography from '../text/Typography';
import { RefObject } from 'react';
import Objector from '@/components/utils/Objector';
import { BaseInputProps, useInputLogic } from './hooks/useInputLogic';

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder' | 'onChange' | 'onFocus' | 'onBlur'>, BaseInputProps {
  ref?: RefObject<HTMLTextAreaElement | null>;
  style?: React.CSSProperties;
  rows?: number;
}

const Textarea: React.FC<TextareaProps> = (props) => {
  const {
    ref = null,
    style = {},
    placeholder,
    label,
    variant = 'outlined',
    disabled = false,
    rows = 4,
    // EXTRACT THESE so they aren't in 'domProps'
    maxLength, // this must be extracted or it uses the default html maxLength handler. I want to allow typing after the fact and show the error
    onChange,
    formatter,
    inputHandler,
    error,
    errorMessage,
    triggerValidation,
    min,
    max,
    ...domProps
  } = props;

  const theme = useTheme();

  // Use the shared logic
  const { value, isFocused, hasError, displayedErrorMessage, handlers } = useInputLogic(props);

  // --- Styling Logic ---
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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    color: hasError ? errorColor : textColor,
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',
    borderRadius: variant === 'outlined' ? 4 : 0,
    resize: 'vertical',
    fontFamily: 'inherit', // Ensure font matches Input
    minHeight: '46px', // Match Input minimum
    fontSize: '1rem',
  };

  if (variant === 'filled') {
    inputStyle.backgroundColor = theme.mode === 'dark' ? theme.grey[900] : theme.grey[300];
    inputStyle.padding = '25px 12px 8px 12px';
    inputStyle.border = 'none';
    inputStyle.borderBottom = 'none';
  } else if (variant === 'standard') {
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
  };

  Objector.extender(inputStyle, style);

  const isLabelActive = isFocused || (value !== undefined && value !== '');

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
    transform: isLabelActive
      ? 'translate(0, -50%) scale(0.75)'
      : 'translate(0, 0) scale(1)',

    ...(variant === 'outlined' && isLabelActive ? {
      top: 4,
      left: 10,
      padding: '0 4px',
      backgroundColor: theme.background.main,
      zIndex: 1,
    } : {}),

    fontSize: isLabelActive ? '13px' : '14px',
  };

  const errorTextStyle: React.CSSProperties = {
    color: errorColor,
    marginTop: '4px',
    marginLeft: variant === 'standard' ? '0px' : '4px',
    fontSize: '12px',
    minHeight: '20px',
  };

  return (
    <div className={Style.getStyleClassName(containerStyle)}>
      {label ? <Typography type='caption' style={{ color: labelColor, marginBottom: 5 }}>{label}</Typography> : ''}
      <div style={{ position: 'relative', width: '100%' }}>
        <Typography type='caption' className={Style.getStyleClassName(placeholderStyle)}>{placeholder}</Typography>
        <textarea
          ref={ref}
          className={Style.getStyleClassName(inputStyle)}
          value={value as string} // Cast ensuring compatibility
          disabled={disabled}
          onChange={handlers.handleChange}
          onFocus={handlers.handleFocus}
          onBlur={handlers.handleBlur}
          rows={rows}
          {...domProps}
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

export default Textarea;
