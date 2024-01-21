'use client';
import React from 'react';
import { CircularProgress } from '@mui/material';

const Loading = () => {
  return (
    <div style = {{'display': 'flex', 'justifyContent': 'center'}}>
      <CircularProgress />
    </div>
  );
};

export default Loading;