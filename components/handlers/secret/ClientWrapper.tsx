'use client';
import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import BackdropLoader from '@/components/generic/BackdropLoader';

const ClientWrapper = ({ children }) => {
  const loadingSecret = useAppSelector(state => state.userReducer.loadingSecret);

  return (
    <>
      <BackdropLoader open = {loadingSecret} />
      {children}
    </>
  );
};

export default ClientWrapper;