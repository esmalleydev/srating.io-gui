'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/fantasy_group-slice';

const ReduxWrapper = (
  {
    children,
    fantasy_group,
  }:
  {
    children: React.ReactNode;
    fantasy_group: object;
  },
) => {
  const dispatch = useAppDispatch();

  console.log('redux');
  console.log(fantasy_group);

  useEffect(() => {
    console.log('use', fantasy_group);
    // this should not be needed, the player navigation will reset back to the default view
    dispatch(setDataKey({ key: 'fantasy_group', value: fantasy_group }));
  }, [dispatch, fantasy_group]);


  return (
    <div>
      {children}
    </div>
  );
};

export default ReduxWrapper;
