'use client';

import React from 'react';
import { getHeaderHeight } from '../Header/ClientWrapper';
import { getSubNavHeaderHeight } from '../SubNavBar';

const ClientWrapper = ({ children }) => {
  const top = getHeaderHeight() + getSubNavHeaderHeight() + 5;
  return (
    <div style = {{ marginTop: top }}>
      {children}
    </div>
  );
};

export default ClientWrapper;
