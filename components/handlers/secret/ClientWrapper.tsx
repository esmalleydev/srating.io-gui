'use client';
import React from 'react';
// import { useAppSelector } from '@/redux/hooks';

const ClientWrapper = ({ children }) => {
  // const loadingSecret = useAppSelector(state => state.userReducer.loadingSecret);

  return (
    <>
      {/* <BackdropLoader open = {loadingSecret} /> */}
      {children}
    </>
  );
};

export default ClientWrapper;