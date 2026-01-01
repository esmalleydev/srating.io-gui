
'use client';

import { useTheme } from '@/components/hooks/useTheme';
import React from 'react';
import Typography from '../text/Typography';
import Objector from '@/components/utils/Objector';
import Style from '@/components/utils/Style';


/**
 * Tile component
 */
const Tile = (
  {
    icon,
    primary,
    secondary,
    style = {},
    iconStyle = {},
  }:
  {
    icon: React.JSX.Element;
    primary: string;
    secondary?: string;
    style?: React.CSSProperties;
    iconStyle?: React.CSSProperties;
  },
) => {
  const theme = useTheme();

  const containerStyle = Objector.extender(
    {
      margin: '5px 0px',
    },
    style
  );

  const iconContainerStyle = Objector.extender(
    {
      color: theme.success.main,
      marginRight: 10
    },
    iconStyle
  );


  return (
    <div className = {Style.getStyleClassName(containerStyle)}>
      <div style = {{ display: 'flex', alignItems: 'center' }}>
        <div className = {Style.getStyleClassName(iconContainerStyle)}>{icon}</div>
        <div>
          <div><Typography type = 'body1'>{primary}</Typography></div>
          {secondary ? <div><Typography type = 'caption' style = {{ color: theme.text.secondary, fontStyle: 'italic' }}>{secondary}</Typography></div> : ''}
        </div>
      </div>
    </div>
  );
};

export default Tile;
