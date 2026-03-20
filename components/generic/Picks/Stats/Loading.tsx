'use client';

import React from 'react';
import { getCardStyle, getOrderedBuckets } from './Client';
import Skeleton from '@/components/ux/loading/Skeleton';
import { Objector } from '@esmalley/ts-utils';

const Loading = () => {
  const orderedBuckets = getOrderedBuckets();

  const skeletonContainers: React.JSX.Element[] = [];

  for (let i = 0; i < orderedBuckets.length; i++) {
    skeletonContainers.push(<Skeleton key = {i} animation="wave" style = {Objector.extender({}, getCardStyle(), { height: 185 })} />);
  }

  return (
    <div style = {{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {skeletonContainers}
    </div>
  );
};

export default Loading;
