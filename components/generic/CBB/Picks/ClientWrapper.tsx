'use client';

import React from 'react';
import { getMarginTop } from '@/components/generic/DateAppBar';
import { getHeaderHeight } from './SubNavBar';
import { useAppSelector } from '@/redux/hooks';
import { useScrollContext } from '@/contexts/scrollContext';

const ClientWrapper = ({ children }) => {
  const paddingTop = getMarginTop() + getHeaderHeight();
  const scrollTop = useAppSelector((state) => state.picksReducer.scrollTop);

  const scrollRef = useScrollContext();

  if (scrollRef && scrollRef.current) {
    scrollRef.current.scrollTop = scrollTop;
  }

  return (
    <div style={{ padding: `${paddingTop}px 5px 0px 5px` }}>
      {children}
    </div>
  );
};

export default ClientWrapper;
