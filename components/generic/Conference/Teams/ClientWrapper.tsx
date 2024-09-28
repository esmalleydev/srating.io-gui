'use client';

import React from 'react';
import { getHeaderHeight } from '../Header/ClientWrapper';

const ClientWrapper = ({ children }) => {
  const top = getHeaderHeight();
  return (
    <div style = {{ marginTop: top }}>
      {children}
    </div>
  );
};

export default ClientWrapper;
