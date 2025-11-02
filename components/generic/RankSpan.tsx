'use client';

import Color from '@/components/utils/Color';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';
import { useTheme } from '@/components/hooks/useTheme';
import Tooltip from '../ux/hover/Tooltip';

const RankSpan = (
  { rank, max, useOrdinal }:
  { rank: number; max: number; useOrdinal: boolean },
) => {
  const { width } = useWindowDimensions() as Dimensions;

  const theme = useTheme();

  const bestColor = theme.mode === 'light' ? theme.success.main : theme.success.dark;
  const worstColor = theme.mode === 'light' ? theme.error.main : theme.error.dark;

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
    // it is too inconsistent... switches from black to white, so just go with white, even tho black might looks a tiny bit better on a few colors. White is pretty readable
    // spanStyle.color = Color.getTextColor(theme.text.primary, backgroundColor);
    spanStyle.color = '#fff';
  }


  const getNumberWithOrdinal = (number: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = number % 100;
    return number + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const rankWithOrdinal = getNumberWithOrdinal(rank);

  return (
    <Tooltip position = 'top' text={`Ranked ${rankWithOrdinal} out of ${max}`}>
      <span style = {spanStyle}>{useOrdinal ? rankWithOrdinal : rank}</span>
    </Tooltip>
  );
};

export default RankSpan;
