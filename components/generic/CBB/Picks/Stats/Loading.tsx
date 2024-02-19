'use client';
import React from 'react';
import { Skeleton } from '@mui/material';
import { getCardStyle, getOrderedBuckets } from './Client';

const Loading = () => {
  const orderedBuckets = getOrderedBuckets();

  const skeletonContainers: React.JSX.Element[] = [];

  for (let i = 0; i < orderedBuckets.length; i++) {
    skeletonContainers.push(<Skeleton key = {i} variant="rounded" animation="wave" height={115} sx = {getCardStyle()} />);
  }

  return (
    <div style = {{'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'center'}}>
      {skeletonContainers}
    </div>
  );
};

export default Loading;