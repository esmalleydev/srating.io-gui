'use client';

import Style from '@/components/utils/Style';
import React from 'react';
import Typography from '../text/Typography';
import { useTheme } from '@/components/hooks/useTheme';

const MenuListText = (
  {
    primary,
    secondary,
    style = {},
    // children,
  }:
  {
    primary: string;
    secondary?: string;
    style?: React.CSSProperties;
    // children: React.ReactNode;
  },
) => {
  const theme = useTheme();
  const cStyle: React.CSSProperties = {
    flex: '1 1 auto',
    margin: '6px 0px',
    ...style,
  };

  return (
    <div className={Style.getStyleClassName(cStyle)}>
      <Typography type='body1'>{primary}</Typography>
      {secondary ? <Typography type = 'caption' style = {{ color: theme.text.secondary }}>{secondary}</Typography> : ''}
    </div>
  );
};

export default MenuListText;
