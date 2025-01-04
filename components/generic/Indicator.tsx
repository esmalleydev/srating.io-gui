'use client';

import { useTheme } from '@mui/material/styles';
import { Tooltip } from '@mui/material';

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
    color: theme.palette.getContrastText(backgroundColor),
  };

  return (
    <Tooltip enterTouchDelay={0} disableFocusListener placement = 'top' title={title}>
      <span style = {spanStyle}>{code}</span>
    </Tooltip>
  );
};

export default Indicator;
