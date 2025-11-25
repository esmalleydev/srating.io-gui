'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/picks-slice';

const ReduxWrapper = (
  {
    children,
    view,
    season,
  }:
  { children: React.ReactNode,
    view: string,
    season: number,
  },
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setDataKey({ key: 'view', value: view }));
    dispatch(setDataKey({ key: 'season', value: season }));
  }, [dispatch, season, view]);


  return (
    <div>
      {children}
    </div>
  );
};

export default ReduxWrapper;
