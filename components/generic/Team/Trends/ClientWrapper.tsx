'use client';

import React from 'react';
import { getHeaderHeight } from '../Header/ClientWrapper';
import { getNavHeaderHeight } from '../NavBar';
import { getSubNavHeaderHeight } from '../SubNavbar';

const ClientWrapper = ({ children }) => {
  const top = getHeaderHeight();
  const paddingTop = getNavHeaderHeight() + getSubNavHeaderHeight();
  return (
    <div style={{ marginTop: top, padding: `${paddingTop}px 5px 5px 5px` }}>
      {children}
    </div>
  );
};

export default ClientWrapper;
