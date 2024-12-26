'use client';

import { useTheme } from '@mui/material/styles';
import { Tooltip } from '@mui/material';

import Color from '@/components/utils/Color';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

const RankSpan = ({ rank, max, useOrdinal }) => {
  const { width } = useWindowDimensions() as Dimensions;

  const theme = useTheme();

  const bestColor = theme.palette.mode === 'light' ? theme.palette.success.main : theme.palette.success.dark;
  const worstColor = theme.palette.mode === 'light' ? theme.palette.error.main : theme.palette.error.dark;

  const spanStyle: React.CSSProperties = {
    fontSize: '10px',
    margin: '0px 5px',
    padding: '3px',
    borderRadius: '5px',
  };

  let backgroundColor: string | null = null;

  if (width <= 425) {
    spanStyle.fontSize = '9px';
  }

  if (
    rank &&
    (backgroundColor = Color.lerpColor(bestColor, worstColor, (+rank / max))) &&
    backgroundColor !== '#'
  ) {
    spanStyle.backgroundColor = backgroundColor;
    spanStyle.color = theme.palette.getContrastText(backgroundColor);
  }


  const getNumberWithOrdinal = (number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = number % 100;
    return number + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const rankWithOrdinal = getNumberWithOrdinal(rank);

  return (
    <Tooltip enterTouchDelay={1250} disableFocusListener placement = 'top' title={`Ranked ${rankWithOrdinal} out of ${max}`}>
      <span style = {spanStyle}>{useOrdinal ? rankWithOrdinal : rank}</span>
    </Tooltip>
  );
};

export default RankSpan;
