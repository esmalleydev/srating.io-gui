/* eslint-disable prefer-destructuring */

'use client';

import { useTheme } from '@/components/hooks/useTheme';
// import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import Color from '@/components/utils/Color';
import Objector from '@/components/utils/Objector';
import Style from '@/components/utils/Style';
import { RefObject } from 'react';

const IconButton = (
  {
    icon,
    value,
    onClick,
    type = 'standard',
    disabled = false,
    autoFocus = false,
    containerStyle = {},
    buttonStyle = {},
    ref = null,
    ...props
  }:
  {
    icon: React.JSX.Element;
    value: string|number;
    onClick: (e: React.SyntheticEvent, value: string | number) => void;
    type?: 'standard' | 'circle';
    disabled?: boolean;
    autoFocus?: boolean;
    containerStyle?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    ref?: RefObject<HTMLDivElement> | null;
  },
) => {
  const theme = useTheme();
  // const { width } = useWindowDimensions() as Dimensions;

  const cStyle: React.CSSProperties & {
    '&:hover'?: React.CSSProperties
  } = {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
    transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      backgroundColor: theme.action.hover,
    },
  };

  const circleBackgroundColor = theme.mode === 'dark' ? theme.grey[700] : theme.grey[500];

  if (type === 'circle') {
    cStyle.justifyContent = 'center';
    cStyle.backgroundColor = circleBackgroundColor;
    cStyle.borderRadius = '50%';
    cStyle.height = 40;
    cStyle.width = 40;
    cStyle.textAlign = 'center';
    cStyle.transition = 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    cStyle['&:hover'] = {
      backgroundColor: theme.grey[600]
    };
  }

  Objector.extender(cStyle, containerStyle);

  const bStyle: React.CSSProperties & {
    '&:hover'?: React.CSSProperties
  } = {
    fontWeight: 500,
    fontSize: 14,
    minHeight: 24,
    minWidth: 24,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    color: theme.info.main,
  };

  if (type === 'circle') {
    bStyle.color = theme.mode === 'dark' ? theme.info.light : theme.info.dark;
  }

  Objector.extender(bStyle, buttonStyle);

  if (bStyle.backgroundColor !== 'transparent') {
    bStyle['&:hover'] = {
      backgroundColor: theme.mode === 'dark' ? Color.lighten(bStyle.backgroundColor as string) : Color.darken(bStyle.backgroundColor as string),
    };
  }



  if (disabled) {
    // Disabled regular button (fill/solid)
    // bStyle.backgroundColor = theme.grey[300]; // Light background for disabled
    bStyle.color = theme.grey[500]; // Grey text for disabled
    // bStyle.cursor = 'default';
    delete bStyle['&:hover']; // Remove hover effect
    delete cStyle['&:hover']; // Remove hover effect
  }

  return (
    <div ref = {ref} className = {Style.getStyleClassName(cStyle)} {...props} onClick={(e) => { onClick(e, value); }}>
      <button className = {Style.getStyleClassName(bStyle)} autoFocus = {autoFocus} disabled = {disabled}>
        {icon}
      </button>
    </div>
  );
};

export default IconButton;
