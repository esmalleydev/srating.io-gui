'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Color from '@/components/utils/Color';
import Tooltip from '../ux/hover/Tooltip';

const Indicator = (
  { title, code, color }:
  { title: string; code: string; color?: string; },
) => {
  const theme = useTheme();

  const backgroundColor = color || '#0288d1';

  const spanStyle: React.CSSProperties = {
    fontSize: '10px',
    padding: '3px',
    minWidth: '18px',
    textAlign: 'center',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
    backgroundColor,
    color: Color.getTextColor(theme.text.primary, backgroundColor),
  };

  return (
    <Tooltip position = 'top' text={title}>
      <span style = {spanStyle}>{code}</span>
    </Tooltip>
  );
};

export default Indicator;
