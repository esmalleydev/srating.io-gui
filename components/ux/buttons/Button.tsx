'use client';

import { useTheme } from '@/components/hooks/useTheme';
// import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import Color from '@/components/utils/Color';
import Style from '@/components/utils/Style';
import { RefObject } from 'react';

const Button = (
  {
    title,
    value,
    handleClick,
    ink = false,
    autoFocus = false,
    containerStyle = {},
    buttonStyle = {},
    ref = null,
  }:
  {
    title: string;
    value: string|number;
    handleClick: (e: React.SyntheticEvent, value: string | number) => void;
    ink?: boolean;
    autoFocus?: boolean;
    containerStyle?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    ref?: RefObject<HTMLDivElement> | null;
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

  let regularButtonStyle = {
    backgroundColor: theme.green[600],
    color: '#fff',
    borderRadius: 6,
  };


  if (ink) {
    const textColor = buttonStyle.color || theme.blue[500];

    const hoverColor = buttonStyle.color ? (
      theme.mode === 'dark' ? Color.lighten(buttonStyle.color) : Color.darken(buttonStyle.color)
    ) : (
      theme.mode === 'dark' ? theme.blue[300] : theme.blue[700]
    );

    regularButtonStyle = {
      backgroundColor: 'transparent',
      color: Color.getTextColor(textColor, backgroundColor),
      '&:hover': {
        color: hoverColor,
      },
    };
  }

  const bStyle = {
    fontWeight: 500,
    fontSize: 14,
    minWidth: 100,
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
      backgroundColor: theme.mode === 'dark' ? Color.darken(bStyle.backgroundColor as string) : Color.lighten(bStyle.backgroundColor as string),
    };
  }

  return (
    <div ref = {ref} className = {Style.getStyleClassName(cStyle)} onClick={(e) => { handleClick(e, value); }}>
      <button className = {Style.getStyleClassName(bStyle)} autoFocus = {autoFocus}>
        {title}
      </button>
    </div>
  );
};

export default Button;
