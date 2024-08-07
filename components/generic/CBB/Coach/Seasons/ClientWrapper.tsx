'use client';

import React from 'react';
import { getSubNavHeaderHeight } from '../SubNavBar';

const ClientWrapper = ({ children }) => {
  const top = getSubNavHeaderHeight() + 10;
  return (
    <div style = {{ marginTop: top }}>
      {children}
    </div>
  );
};

export default ClientWrapper;
