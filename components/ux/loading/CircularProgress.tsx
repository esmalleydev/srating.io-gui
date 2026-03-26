'use client';

import { useTheme } from '@/components/ux/contexts/themeContext';
import { Objector, Style } from '@esmalley/ts-utils';
import React from 'react';



const CircularProgress = (
  {
    type = 'indeterminate',
    value = 0,
    size = 40,
    thickness = 3.6,
    color,
    containerStyle = {},
    circleStyle = {},
  }:
  {
    type?: 'indeterminate' | 'determinate';
    value?: number;
    size?: number;
    thickness?: number;
    color?: string;
    containerStyle?: React.CSSProperties;
    circleStyle?: React.CSSProperties;
  },
) => {
  const theme = useTheme();


  // Math required for determinate progress
  const radius = (44 - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  const cStyle: Record<string, unknown> = {
    display: 'inline-block',
    width: size,
    height: size,
  };

  if (type === 'determinate') {
    // Start at 12 o'clock instead of 3 o'clock
    cStyle.transform = 'rotate(-90deg)';
  } else {
    // Indeterminate spinning
    cStyle.animation = 'spin 1.4s linear infinite';
    cStyle['@keyframes spin'] = {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    };
  }

  Objector.extender(cStyle, containerStyle);

  const cirStyle: Record<string, unknown> = {
    stroke: color || theme.info.main,
    strokeLinecap: 'round',
  };

  if (type === 'determinate') {
    // Calculate how much of the stroke to hide based on value (0-100)
    const clampedValue = Math.max(0, Math.min(100, value));
    const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

    cirStyle.strokeDasharray = circumference.toFixed(3);
    cirStyle.strokeDashoffset = strokeDashoffset.toFixed(3);
    cirStyle.transition = 'stroke-dashoffset 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'; // Smooth animation when value changes
  } else {
    // Indeterminate stretching line
    cirStyle.strokeDasharray = '80px, 200px';
    cirStyle.strokeDashoffset = 0;
    cirStyle.animation = 'circular-dash 1.4s ease-in-out infinite';
    cirStyle['@keyframes circular-dash'] = {
      '0%': {
        strokeDasharray: '1px, 200px',
        strokeDashoffset: 0,
      },
      '50%': {
        strokeDasharray: '100px, 200px',
        strokeDashoffset: '-15px',
      },
      '100%': {
        strokeDasharray: '100px, 200px',
        strokeDashoffset: '-125px',
      },
    };
  }

  Objector.extender(cirStyle, circleStyle);

  return (
    <div className = {Style.getStyleClassName(cStyle)}>
      <svg viewBox="22 22 44 44" style={{ display: 'block' }}>
        <circle
          className = {Style.getStyleClassName(cirStyle)}
          cx="44"
          cy="44"
          r={(44 - thickness) / 2}
          fill="none"
          strokeWidth={thickness}
        />
      </svg>
    </div>
  );
};

export default CircularProgress;
