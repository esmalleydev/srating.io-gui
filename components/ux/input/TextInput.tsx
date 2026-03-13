'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Typography from '../text/Typography';
import { RefObject } from 'react';
import { BaseInputProps, useInputLogic } from './hooks/useInputLogic';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '../buttons/IconButton';

import { Objector, Style, Color } from '@esmalley/ts-utils';


interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'placeholder' | 'onChange' | 'onFocus' | 'onBlur' | 'max' | 'min' | 'maxLength'>, BaseInputProps {
  ref?: RefObject<HTMLInputElement | null>;
  style?: React.CSSProperties;
  placeholderStyle?: React.CSSProperties;
  icon?: React.JSX.Element;
  clear?: boolean;
  transformPlaceholder?: boolean;
}

const TextInput: React.FC<TextInputProps> = (props) => {
  const {
    inputHandler,
    ref = null,
    style = {},
    placeholderStyle = {},
    placeholder,
    label,
    variant = 'outlined',
    disabled = false,
    formatter = 'text',
    error: externalError = false,
    errorMessage: externalErrorMessage,
    showError = true,
    required = false,
    maxLength, // Native prop pulled out for clarity
    onFocus,
    onBlur,
    onChange,
    value: valueProp,
    triggerValidation = false,
    min = null,
    max = null,
    icon = null,
    clear = false,
    transformPlaceholder = true,
    // reset = false,
    ...domProps
  } = props;

  const theme = useTheme();

  // Use the shared logic
  const { value, isFocused, hasError, displayedErrorMessage, handlers } = useInputLogic(props);

  const hidePlaceholder = !transformPlaceholder && (value || isFocused);

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


  let paddingLeft = (icon ? 24 : 0);
  const iconLeft = icon ? 8 : 0;

  const inputStyle: React.CSSProperties = {
    // Structure & Position
    width: '100%',
    height: 46,
    boxSizing: 'border-box',
    color: hasError ? errorColor : textColor,
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',
    borderRadius: variant === 'outlined' ? 4 : 0,
    fontSize: '1rem',
  };

  if (variant === 'filled') {
    inputStyle.backgroundColor = theme.mode === 'dark' ? theme.grey[900] : theme.grey[300];
    paddingLeft += 12 + iconLeft;
    inputStyle.padding = `14px 12px 8px ${paddingLeft}px`; // Taller to accommodate space for the label
    inputStyle.border = 'none';
    inputStyle.borderBottom = 'none';
    if (!disabled) {
      inputStyle['&:hover'] = {
        backgroundColor: Color.alphaColor('#fff', 0.25),
      };
    }
  } else if (variant === 'standard') {
    if (icon) {
      paddingLeft += 12 + iconLeft;
    }
    inputStyle.padding = `14px 12px 8px ${paddingLeft}px`;
    inputStyle.border = 'none';
    inputStyle.borderBottom = `2px solid ${borderColor}`;
  } else if (variant === 'outlined') {
    paddingLeft += 12 + iconLeft;
    inputStyle.padding = `14px 12px 14px ${paddingLeft}px`;
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
  if (variant === 'filled' && isLabelActive) {
    labelTop = 10;
  }
  if (variant === 'standard' && isLabelActive) {
    labelTop = 10;
  }
  if (variant === 'standard' && !icon) {
    labelLeft = 0;
  }
  let labelColor = theme.text.secondary;
  if (isFocused) {
    labelColor = borderColor;
  } else if (hasError) {
    labelColor = errorColor;
  }
  const pStyle: React.CSSProperties = {
    position: 'absolute',
    pointerEvents: 'none',
    color: labelColor,
    transition: 'all 0.3s ease-out',
    transformOrigin: 'top left',
    top: labelTop,
    left: icon && !isLabelActive ? 0 : labelLeft,

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

  if (icon) {
    pStyle.paddingLeft = paddingLeft;
  }

  Objector.extender(pStyle, placeholderStyle);

  const errorTextStyle: React.CSSProperties = {
    color: errorColor,
    marginTop: '4px',
    marginLeft: variant === 'standard' ? '0px' : '4px',
    fontSize: '12px',
    minHeight: '20px', // Prevents layout jumping if you want consistent spacing
  };

  let placeholderElement: React.JSX.Element | null = <Typography type = 'caption' className = {Style.getStyleClassName(pStyle)}>{placeholder}</Typography>;

  if (hidePlaceholder) {
    placeholderElement = null;
  }

  return (
    <div className={Style.getStyleClassName(containerStyle)}>
      {label ? <Typography type='caption' style={{ color: labelColor, marginBottom: 5 }}>{label}</Typography> : ''}
      <div style={{ position: 'relative', width: '100%' }}>
        {icon ? <div style = {{ position: 'absolute', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', left: iconLeft }}>{icon}</div> : ''}
        {placeholderElement}
        <input
          ref = {ref}
          type='text'
          className={Style.getStyleClassName(inputStyle)}
          value={value}
          disabled = {disabled}
          name = {domProps.name || crypto.randomUUID()}
          // maxLength={maxLength} use internval validation
          onChange={handlers.handleChange}
          onFocus={handlers.handleFocus}
          onBlur={handlers.handleBlur}
          {...domProps}
        />
        {
        clear && value ?
          <div style = {{ position: 'absolute', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', right: 0, top: 0 }}>
            <IconButton icon = {<CancelIcon style = {{ color: theme.error.main }} />} value = 'clear' onClick={() => {
              // Create a synthetic-like object to match React.ChangeEvent structure
              const syntheticEvent = {
                target: { value: '' },
                currentTarget: { value: '' },
              } as unknown as React.ChangeEvent<HTMLInputElement>;

              handlers.handleChange(syntheticEvent);
            }} />
          </div> : ''
        }
      </div>
      {showError && <div style={{ height: 20, marginTop: 4 }}>
        {displayedErrorMessage && (
          <Typography type='caption' style={errorTextStyle}>
            {displayedErrorMessage}
          </Typography>
        )}
      </div>}
    </div>
  );
};

export default TextInput;
