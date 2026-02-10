'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { PaymentRouter } from '@/types/general';
import { setDataKey } from '@/redux/features/payment_router-slice';

const ReduxWrapper = (
  {
    children,
    payment_router,
  }:
  {
    children: React.ReactNode,
    payment_router: PaymentRouter,
  },
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setDataKey({ key: 'payment_router', value: payment_router }));
  }, [dispatch, payment_router]);


  return (
    <div>
      {children}
    </div>
  );
};

export default ReduxWrapper;
