'use client';

import { useTheme } from '@/components/hooks/useTheme';
import { Objector, Style } from '@esmalley/ts-utils';
import React from 'react';

const LinearProgress = (
  {
    type = 'indeterminate',
    value = 0,
    containerStyle = {},
    color = undefined,
  }:
  {
    type?: 'indeterminate' | 'determinate';
    value?: number;
    color?: string;
    containerStyle?: React.CSSProperties;
  },
) => {
  const theme = useTheme();

  const barColor = color || theme.info.main;
  // Determine styles based on variant
  const isDeterminate = type === 'determinate';

  const cStyle = {
    position: 'relative',
    overflow: 'hidden',
    display: 'block',
    height: 4,
    backgroundColor: `${barColor}40`, // 40 is hex for 25% opacity for the track
    width: '100%',
    borderRadius: 2,
  };

  Objector.extender(cStyle, containerStyle);

  const barBaseStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: barColor,
    transition: 'transform 0.4s linear',
    transformOrigin: 'left',
  };

  const barBaseKeyframes1 = {
    '@keyframes linear-indeterminate-1': {
      '0%': { left: '-35%', right: '100%' },
      '60%': { left: '100%', right: '-90%' },
      '100%': { left: '100%', right: '-90%' },
    },
  };

  const barBaseKeyframes2 = {
    '@keyframes linear-indeterminate-2': {
      '0%': { left: '-200%', right: '100%' },
      '60%': { left: '107%', right: '-8%' },
      '100%': { left: '107%', right: '-8%' },
    },
  };


  return (
    <div className = {Style.getStyleClassName(cStyle)}>
      {isDeterminate ? (
        <div
          className = {Style.getStyleClassName(Objector.extender(
            {},
            barBaseStyle,
            {
              left: 0,
              width: '100%',
              transform: `scaleX(${Math.max(0, Math.min(100, value)) / 100})`,
            },
          ))}
        />
      ) : (
        <>
          <div
            className = {Style.getStyleClassName(Objector.extender(
              {},
              barBaseStyle,
              barBaseKeyframes1,
              {
                width: 'auto',
                animation: 'linear-indeterminate-1 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite',
              },
            ))}
          />
          <div
            className = {Style.getStyleClassName(Objector.extender(
              {},
              barBaseStyle,
              barBaseKeyframes2,
              {
                width: 'auto',
                animation: 'linear-indeterminate-2 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite',
                animationDelay: '1.15s',
              },
            ))}
          />
        </>
      )}
    </div>
  );
};


export default LinearProgress;
