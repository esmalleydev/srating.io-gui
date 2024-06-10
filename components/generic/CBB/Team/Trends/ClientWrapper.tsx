'use client';
import React from 'react';

const ClientWrapper = ({ children }) => {
  return (
    <div style={{'padding': '5px'}}>
      {children}
    </div>
  );
};

export default ClientWrapper;