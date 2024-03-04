'use client';
import React from 'react';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Typography } from '@mui/material';
import { getHeaderHeight } from './Header/ClientWrapper';
import { getSubNavHeaderHeight } from './SubNavBar';

const Splash = () => {
  const top = getHeaderHeight() + getSubNavHeaderHeight() + 5;
  return (
    <div style = {{'textAlign': 'center', 'marginTop': top}}>
      <div><ArrowUpwardIcon fontSize='large' /></div>
      <div><Typography variant='h5'>To use this tool, first add 2 teams above!</Typography></div>
    </div>
  );
};

export default Splash;