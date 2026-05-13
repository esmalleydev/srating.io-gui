'use client';

import React from 'react';

import { getBreakPoint } from './ClientWrapper';
import General from '@/components/helpers/General';
import { Color } from '@esmalley/ts-utils';
import { useWindowDimensions } from '@esmalley/react-material-ui';


const Rank = ({ conference_statistic_ranking }) => {
  const bestColor = General.getBestColor();
  const worstColor = General.getWorstColor();

  const { width } = useWindowDimensions();

  let rank = null;
  if (conference_statistic_ranking) {
    rank = conference_statistic_ranking.rank;
  }

  let supFontSize = 16;
  if (width < getBreakPoint()) {
    supFontSize = 12;
  }

  const supRankStyle: React.CSSProperties = {
    fontSize: supFontSize,
    marginRight: '5px',
    fontWeight: 700,
  };

  const conferenceNumber = 35;

  if (rank) {
    supRankStyle.color = Color.lerpColor(bestColor, worstColor, (+(rank / conferenceNumber)));
  }

  // if (false) {
  //   return <Skeleton style={{ width: 15, height: 20, display: 'inline-block', marginRight: 5 }} />;
  // }

  return (
    <sup style = {supRankStyle}>
      {rank || ''}
    </sup>
  );
};

export default Rank;
