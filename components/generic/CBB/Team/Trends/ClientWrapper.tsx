'use client';
import React from 'react';
import { getNavHeaderHeight } from '../NavBar';
import { getSubNavHeaderHeight } from '../SubNavbar';

const ClientWrapper = ({ children }) => {
  const paddingTop = getNavHeaderHeight() + getSubNavHeaderHeight();
  return (
    <div style={{'padding': paddingTop + 'px 5px 5px 5px'}}>
      {children}
    </div>
  );
};

export default ClientWrapper;