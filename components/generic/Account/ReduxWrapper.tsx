'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';

const ReduxWrapper = (
  {
    children,
    view,
  }:
  {
    children: React.ReactNode,
    view: string
  },
) => {
  const dispatch = useAppDispatch();


  useEffect(() => {
    // this should not be needed, the user navigation will reset back to the default view
    // dispatch(setDataKey({ key: 'view', value: view }));
    
  }, [dispatch, view]);


  return (
    <div>
      {children}
    </div>
  );
};

export default ReduxWrapper;
