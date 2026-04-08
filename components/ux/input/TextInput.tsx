'use client';

import { useTheme } from '@/components/ux/contexts/themeContext';
import Typography from '../text/Typography';
import { RefObject } from 'react';
import { BaseInputProps, useInputLogic } from './hooks/useInputLogic';
import { Cancel as CancelIcon } from '@esmalley/react-material-icons/Cancel';
import IconButton from '../buttons/IconButton';

import { Objector, Style, Color } from '@esmalley/ts-utils';


interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'placeholder' | 'onChange' | 'onFocus' | 'onBlur' | 'max' | 'min' | 'maxLength'>, BaseInputProps {
  ref?: RefObject<HTMLInputElement | null>;
  style?: Record<string, unknown>;
  placeholderStyle?: Record<string, unknown>;
  clearIconStyle?: Record<string, unknown>;
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
    clearIconStyle = {},
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


  let paddingLeft = (icon ? 40 : 16);
  const iconLeft = icon ? 8 : 0;

  if (variant === 'standard' && !icon) {
    paddingLeft -= 8;
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 46,
    boxSizing: 'border-box',
    color: hasError ? errorColor : textColor,
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',
    borderRadius: variant === 'outlined' ? 4 : 0,
    fontSize: '1rem',
    paddingLeft,
    paddingRight: paddingLeft + (clear ? 24 : 0),
  };

  if (variant === 'filled') {
    inputStyle.backgroundColor = theme.mode === 'dark' ? theme.grey[900] : theme.grey[300];
    inputStyle.border = 'none';
    inputStyle.borderBottom = 'none';
    if (!disabled) {
      inputStyle['&:hover'] = {
        backgroundColor: Color.alphaColor((theme.mode === 'dark' ? '#fff' : theme.grey[600]), 0.25),
      };
    }
  } else if (variant === 'standard') {
    inputStyle.border = 'none';
    inputStyle.borderBottom = `2px solid ${borderColor}`;
  } else if (variant === 'outlined') {
    inputStyle.border = `1px solid ${borderColor}`;
  }

  Objector.extender(inputStyle, style);

  // const height = +(inputStyle.height?.toString().replace('px', '') || 0) || 0;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    lineHeight: 'initial',
  };



  const isLabelActive = isFocused || (
    value !== undefined && value !== ''
  );


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
    transform: isLabelActive
      ? 'translate(0, -100%) scale(0.75)' // Lift and shrink
      : 'translate(0, 0) scale(1)', // Stay put
    margin: `0px 16px 0px ${paddingLeft}px`,
  };

  if (isLabelActive && variant === 'outlined') {
    pStyle.backgroundColor = (
      (style && style.backgroundColor) as string ||
      (style && style['background-color']) as string ||
      theme.background.main
    );
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

  const clearStyle = {
    color: (theme.mode === 'dark' ? theme.error.main : theme.grey[600]),
  };

  Objector.extender(clearStyle, clearIconStyle);

  return (
    <div className={Style.getStyleClassName(containerStyle)}>
      {label ? <Typography type='caption' style={{ color: labelColor, marginBottom: 5 }}>{label}</Typography> : ''}
      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
        {icon ? <div style = {{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', left: iconLeft, pointerEvents: 'none' }}>{icon}</div> : ''}
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
            <IconButton icon = {<CancelIcon style = {clearStyle} />} value = 'clear' onClick={() => {
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
