'use client';

import { useTheme } from '@/components/hooks/useTheme';
import { Color, Objector, Style } from '@esmalley/ts-utils';

const Skeleton = (
  {
    type = 'text',
    animation = 'pulse',
    style = {},
  }:
  {
    type?: 'text' | 'circular';
    animation?: 'pulse' | 'wave';
    style?: React.CSSProperties;
  },
) => {
  const theme = useTheme();
  // Map the variant to the correct border radius
  let borderRadius = '4px'; // Default for rectangular and text
  if (type === 'circular') {
    borderRadius = '50%';
  }

  // Base inline styles for dimensions
  const baseStyle: Record<string, unknown> = {
    display: 'block',
    backgroundColor: theme.grey[(theme.mode === 'dark' ? 800 : 500)],
    width: (type === 'text' ? '100%' : 'auto'),
    height: (type === 'text' ? '1em' : 'auto'),
    borderRadius,
    // marginTop: type === 'text' ? '0.2em' : 0,
    // marginBottom: type === 'text' ? '0.2em' : 0,
  };

  if (animation === 'pulse') {
    baseStyle['@keyframes skeleton-pulse'] = {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.4 },
    };
    baseStyle.animation = 'skeleton-pulse 2s ease-in-out 0.5s infinite';
  }

  if (animation === 'wave') {
    baseStyle['@keyframes skeleton-wave'] = {
      '0%': { transform: 'translateX(-100%)' },
      '50%, 100%': { transform: 'translateX(100%)' },
    };
    baseStyle.position = 'relative';
    baseStyle.overflow = 'hidden';
    baseStyle.backgroundColor = theme.grey[(theme.mode === 'dark' ? 900 : 500)];
    baseStyle['::after'] = {
      content: "''",
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(90deg, transparent, ${Color.alphaColor('#fff', 0.1)}, transparent)`,
      transform: 'translateX(-100%)',
      animation: 'skeleton-wave 2s linear 0.5s infinite',
    };
  }


  Objector.extender(baseStyle, style);


  return (
    <span className = {Style.getStyleClassName(baseStyle)} />
  );
};

export default Skeleton;
