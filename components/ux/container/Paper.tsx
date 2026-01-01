'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Color from '@/components/utils/Color';
import Style from '@/components/utils/Style';
import React, { RefObject } from 'react';


/**
 * Paper component, use to decorate things on a surface.
 * Alter the surface elevation and shadows with `elevation`
 * Can add click events, hover animation etc.
 */
const Paper = (
  {
    elevation = 3,
    style = {},
    children,
    ref,
    tranparency = 0,
    hover = false,
    onClick,
    onKeyDown,
    tabIndex,
    buttons = [],
  }:
  {
    elevation?: number;
    style?: React.CSSProperties;
    children: React.ReactNode;
    tranparency?: number;
    ref?: RefObject<HTMLDivElement | null>;
    hover?: boolean;
    onClick?: (e: React.SyntheticEvent) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void; // Type definition
    tabIndex?: number;
    buttons?: React.JSX.Element[];
  },
) => {
  const theme = useTheme();

  let backgroundColor = '#fff';
  if (theme.mode === 'dark') {
    backgroundColor = Color.lerpColor(theme.background.main, theme.grey[400], elevation / 24);
  }

  if (tranparency) {
    const rgb = Color.hexToRgb(backgroundColor);
    backgroundColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${tranparency})`;
  }

  const cStyle = {
    position: 'relative',
    borderRadius: '4px',
    boxShadow: Style.getShadow(elevation),
    backgroundColor,
    color: theme.text.primary,
    ...style,
  };

  if (hover) {
    cStyle['&:hover'] = {
      backgroundColor: theme.mode === 'light' ? Color.alphaColor(cStyle.backgroundColor, 0.5) : Color.lighten(cStyle.backgroundColor, 0.04),
    };
  }

  const handleClick = (e: React.SyntheticEvent) => {
    if (onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  // the top offset assumes all the buttons will be 40px in height

  return (
    <div
      className={Style.getStyleClassName(cStyle)}
      ref={ref}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex}
    >
      <div style = {{ position: 'absolute', right: 0, top: -20, marginRight: 20  }}>
        {buttons.map((button) => {
          return (
            <div style = {{ margin: '0px 5px', display: 'inline-flex'}}>
              {button}
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
};

export default Paper;
