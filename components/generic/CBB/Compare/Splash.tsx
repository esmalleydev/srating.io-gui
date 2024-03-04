'use client';
import React from 'react';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Typography } from '@mui/material';

const Splash = () => {
  return (
    <div style = {{'textAlign': 'center'}}>
      <div><ArrowUpwardIcon fontSize='large' /></div>
      <div><Typography variant='h5'>To use this tool, first add 2 teams above!</Typography></div>
    </div>
  );
};

export default Splash;