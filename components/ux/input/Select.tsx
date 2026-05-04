'use client';

import { useTheme } from '@/components/ux/contexts/themeContext';
import KeyboardArrowDownIcon from '@esmalley/react-material-icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@esmalley/react-material-icons/KeyboardArrowUp';
import Typography from '../text/Typography';
import { SelectInputProps, useSelectInputLogic } from './hooks/useInputLogic';
import { Cancel as CancelIcon } from '@esmalley/react-material-icons/Cancel';
import IconButton from '../buttons/IconButton';

import { Objector, Style, Color } from '@esmalley/ts-utils';
import { useCallback, useMemo, useRef, useState } from 'react';
import Menu, { MenuOption } from '../menu/Menu';


const Select: React.FC<SelectInputProps> = (props) => {
  const {
    inputHandler,
    options,
    ref = null,
    style = {},
    placeholderStyle = {},
    clearIconStyle = {},
    placeholder,
    label,
    variant = 'outlined',
    disabled = false,
    error: externalError = false,
    errorMessage: externalErrorMessage,
    showError = true,
    required = false,
    onFocus,
    onBlur,
    onChange,
    value: valueProp,
    triggerValidation = false,
    icon = null,
    clear = false,
    transformPlaceholder = true,
    // reset = false,
    ...domProps
  } = props;

  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const internalRef = useRef(null);

  // This helper ensures both the prop ref and our internal ref get the DOM node
  const setRefs = useCallback((node) => {
    internalRef.current = node;
    if (ref) {
      ref.current = node;
    }
  }, [ref]);

  // Use the shared logic
  const {
    value,
    isFocused,
    hasError,
    displayedErrorMessage,
    handlers,
    anchor,
    isTouched,
    isOpen,
  } = useSelectInputLogic(props);

  // Find the selected option object to display its label
  const selectedOption = useMemo(() => options.find((o) => o.value === value), [options, value]);

  const handleSelect = (option: MenuOption) => {
    const optionValue = option.value as string | number;
    if (valueProp === undefined) {
      handlers.handleInternalValue(optionValue);
    }
    if (onChange) {
      onChange(optionValue);
    }
    handlers.handleIsOpen(false);

    // Clear validation error when a selection is made
    if (required && optionValue) {
      handlers.handleValidationError(false);
    }
  };

  const hidePlaceholder = !transformPlaceholder && (value || isFocused);

  const errorColor = theme.error.main;
  let textColor = theme.text.primary;

  let borderColor = theme.mode === 'dark' ? theme.grey[400] : theme.grey[600];

  if (hasError) {
    borderColor = errorColor;
  } else if (isFocused || isHovered) {
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

  const height = 46;

  const inputStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height,
    boxSizing: 'border-box',
    color: hasError ? errorColor : textColor,
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',
    borderRadius: variant === 'outlined' ? 4 : 0,
    fontSize: '1rem',
    paddingLeft,
    paddingRight: paddingLeft + (clear ? 24 : 0),
    cursor: disabled ? 'not-allowed' : 'pointer',
    pointerEvents: disabled ? 'none' : 'auto',
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
    opacity: disabled ? 0.5 : 1, // Simple and effective
  };

  const isLabelActive = isFocused || (
    value !== undefined && value !== ''
  );


  let labelColor = theme.text.secondary;
  if (isFocused || isHovered) {
    labelColor = borderColor;
  } else if (hasError) {
    labelColor = errorColor;
  }

  const pStyle: Record<string, unknown> = {
    position: 'absolute',
    // pointerEvents: 'none',
    color: labelColor,
    transition: 'all 0.3s ease-out',
    transformOrigin: 'top left',
    transform: isLabelActive
      ? 'translate(0, -100%) scale(0.75)' // Lift and shrink
      : 'translate(0, 0) scale(1)', // Stay put
    margin: `0px 16px 0px ${paddingLeft}px`,
    // '&:hover': {
    //   color: hasError ? errorColor : borderColor,
    // },
  };

  if (isLabelActive && variant === 'outlined') {
    pStyle.backgroundColor = (
      (style && style.backgroundColor) as string ||
      (style && style['background-color']) as string ||
      theme.background.main
    );
  }

  Objector.extender(pStyle, placeholderStyle);

  const selectedTextStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: labelColor,
  };

  const errorHeight = 20;

  const errorTextStyle: React.CSSProperties = {
    color: errorColor,
    marginTop: '4px',
    marginLeft: variant === 'standard' ? '0px' : '4px',
    fontSize: '12px',
    minHeight: errorHeight, // Prevents layout jumping if you want consistent spacing
  };

  let placeholderElement: React.JSX.Element | null = <Typography type = 'caption' className = {Style.getStyleClassName(pStyle)}>{placeholder}</Typography>;

  if (hidePlaceholder) {
    placeholderElement = null;
  }

  const clearStyle = {
    color: (theme.mode === 'dark' ? theme.error.main : theme.grey[600]),
    fontSize: 20,
  };

  const clearWidth = (clear && value) ? 32 : 0;

  Objector.extender(clearStyle, clearIconStyle);

  const arrowIconStyle: Record<string, unknown> = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    color: labelColor,
    pointerEvents: 'none', // Allow clicking through the icon
    right: variant === 'standard' ? 0 : 12,
  };

  const iconStyle = {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    left: iconLeft,
    color: labelColor,
    pointerEvents: 'none',
  };

  const clearContainerStyle = {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: clearWidth,
    paddingBottom: (showError ? errorHeight : 0),
  };

  const menuStyle: React.CSSProperties = {
    // marginTop: height / 2,
  };


  // convert the select option to a menu option, basically just attached the onSelect handler
  const menuOptions: MenuOption[] = options.map((option) => {
    return Objector.extender(option, { onSelect: handleSelect, selectable: true });
  });

  const triggerMenu = useCallback((e) => {
    if (disabled) return;

    // Use the internalRef which is guaranteed to be set after mount
    if (internalRef.current) {
      const proxyEvent = {
        ...e,
        currentTarget: internalRef.current,
        target: internalRef.current,
      };

      handlers.handleClick(proxyEvent);
    }
  }, [disabled, handlers]);



  return (
    <div
      style={{ display: 'flex' }}
    >
      <div
        className={Style.getStyleClassName(containerStyle)}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (disabled) return;

          // Open menu on Enter or Space
          // if (e.key === 'Enter' || e.key === ' ') {
          //   e.preventDefault(); // Prevent page scroll on Space
          //   handlers.handleClick(e);
          // }

          // Pass through to your existing logic handler
          handlers.handleKeyDown(e);
        }}
        onFocus={(e) => {
          if (disabled) return;
          if (!isOpen) {
            triggerMenu(e);
          }
        }}
      >
        {label ? <Typography type='caption' style={{ color: labelColor, marginBottom: 5 }}>{label}</Typography> : ''}
        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
          {icon ? <div className = {Style.getStyleClassName(iconStyle)}>{icon}</div> : ''}
          {placeholderElement}
          <div
            ref = {setRefs}
            className={Style.getStyleClassName(inputStyle)}
            onClick={triggerMenu}
            onMouseEnter={() => {
              if (disabled) return;
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              if (disabled) return;
              setIsHovered(false);
            }}
            // onChange={handlers.handleChange}
            // onFocus={handlers.handleFocus}
            // onBlur={handlers.handleBlur}
          >
            <Typography type='body1' style={selectedTextStyle}>
              {selectedOption ? selectedOption.label : ''}
            </Typography>

            <div style={arrowIconStyle}>
              {isOpen ? <KeyboardArrowUpIcon style = {{ fontSize: 20 }} /> : <KeyboardArrowDownIcon style = {{ fontSize: 20 }} />}
            </div>
          </div>
          <Menu
            open = {isOpen}
            options = {menuOptions}
            anchor={anchor}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            onClose = {handlers.handleClose}
            style = {menuStyle}
          />
        </div>
        {showError && <div style={{ height: errorHeight, marginTop: 4 }}>
          {displayedErrorMessage && (
            <Typography type='caption' style={errorTextStyle}>
              {displayedErrorMessage}
            </Typography>
          )}
        </div>}
      </div>
      {
        clear && value ?
          <div
            className = {Style.getStyleClassName(clearContainerStyle)}
          >
            <IconButton
              tabIndex = {0}
              icon = {<CancelIcon style = {clearStyle} />}
              value = 'clear'
              onClick={(e) => {
                // Create a synthetic-like object to match React.ChangeEvent structure
                const syntheticEvent = {
                  target: { value: '' },
                  currentTarget: { value: '' },
                } as unknown as React.ChangeEvent<HTMLInputElement>;


                handlers.handleChange(syntheticEvent);
              }}
            />
          </div> : ''
      }
    </div>
  );
};

export default Select;
