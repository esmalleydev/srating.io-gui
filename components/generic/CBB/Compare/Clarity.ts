'use client';
import { clear } from '@/redux/features/compare-slice';
import { useEffect } from 'react';

// todo not used

const Clarity = () => {
  useEffect(() => {
    // do nothing
    return () => {
      console.log('clear')
      // clear(null);
    };
  });

  return null;
};

export default Clarity;