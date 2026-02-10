'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/fantasy-slice';

const ReduxWrapper = (
  {
    children,
    view,
  }:
  {
    children: React.ReactNode;
    view: string;
  },
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // this should not be needed, the player navigation will reset back to the default view
    // dispatch(setDataKey({ key: 'view', value: view }));
  }, [dispatch, view]);


  return (
    <div>
      {children}
    </div>
  );
};

export default ReduxWrapper;
