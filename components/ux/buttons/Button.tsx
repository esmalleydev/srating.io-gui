/* eslint-disable prefer-destructuring */

'use client';

import { useTheme } from '@/components/hooks/useTheme';
// import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import Color from '@/components/utils/Color';
import Style from '@/components/utils/Style';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { RefObject } from 'react';

const Button = (
  {
    title,
    value,
    handleClick,
    type = 'standard',
    disabled = false,
    ink = false,
    autoFocus = false,
    containerStyle = {},
    buttonStyle = {},
    ref = null,
    endIcon = null,
  }:
  {
    title: string;
    value: string|number;
    handleClick: (e: React.SyntheticEvent, value: string | number) => void;
    type?: 'standard' | 'select',
    disabled?: boolean;
    ink?: boolean;
    autoFocus?: boolean;
    containerStyle?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    ref?: RefObject<HTMLDivElement> | null;
    endIcon?: React.JSX.Element | null
  },
) => {
  const theme = useTheme();
  // const { width } = useWindowDimensions() as Dimensions;

  const cStyle: React.CSSProperties = {
    display: 'inline-flex',
    // alignItems: 'center',
    // position: 'relative',
    // margin: 0,
    // cursor: 'pointer',
    // border: 'none',
    ...containerStyle,
  };


  const backgroundColor = cStyle.backgroundColor || theme.background.main;

  let regularButtonStyle: object = {
    backgroundColor: theme.green[600],
    color: '#fff',
    borderRadius: 6,
  };


  if (ink) {
    const textColor = buttonStyle.color || theme.blue[400];
    let hoverColor = (
      theme.mode === 'dark' ? theme.blue[300] : theme.blue[700]
    );

    if (buttonStyle.color) {
      hoverColor = (
        theme.mode === 'dark' ? Color.lighten(buttonStyle.color) : Color.darken(buttonStyle.color)
      );
    }

    regularButtonStyle = {
      backgroundColor: 'transparent',
      color: Color.getTextColor(textColor, backgroundColor),
      '&:hover': {
        color: hoverColor,
      },
    };
  }

  const bStyle: React.CSSProperties & {
    '&:hover'?: React.CSSProperties
  } = {
    fontWeight: 500,
    fontSize: 14,
    minWidth: type === 'select' ? 40 : 100,
    height: 40,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: 'none',
    ...regularButtonStyle,
    ...buttonStyle,
  };

  if (bStyle.backgroundColor !== 'transparent') {
    bStyle['&:hover'] = {
      backgroundColor: theme.mode === 'dark' ? Color.lighten(bStyle.backgroundColor as string) : Color.darken(bStyle.backgroundColor as string),
    };
  }

  if (disabled) {
    if (ink) {
      // Disabled ink button
      bStyle.color = theme.grey[500];
      // bStyle.cursor = 'default';
      delete bStyle['&:hover']; // Remove hover effect
    } else {
      // Disabled regular button (fill/solid)
      bStyle.backgroundColor = theme.grey[300]; // Light background for disabled
      bStyle.color = theme.grey[500]; // Grey text for disabled
      // bStyle.cursor = 'default';
      delete bStyle['&:hover']; // Remove hover effect
    }
  }

  let endIconInternal = endIcon;
  if (type === 'select' && !endIcon) {
    endIconInternal = <KeyboardArrowDownIcon />;
  }

  return (
    <div ref = {ref} className = {Style.getStyleClassName(cStyle)} onClick={(e) => { handleClick(e, value); }}>
      <button className = {Style.getStyleClassName(bStyle)} autoFocus = {autoFocus} disabled = {disabled} tabIndex={0}>
        {title}
        {endIconInternal || ''}
      </button>
    </div>
  );
};

export default Button;
