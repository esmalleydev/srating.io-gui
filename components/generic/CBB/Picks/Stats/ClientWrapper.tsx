'use client';

import React, { useState, useTransition } from 'react';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';

const ClientWrapper = ({ children }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();

  const handleSubscribe = () => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push('/pricing');
    });
  };

  return (
    <>
      <Typography style = {{ padding: '0px 5px', textAlign: 'center' }} color = 'text.secondary' variant='body1'>Below is a break down of my win prediction percentage, and the actual percentage that were correct. You can view the data by date range, the whole season, by day, week or month.</Typography>
      <div style = {{ textAlign: 'center' }}><Button variant='contained' color='warning' onClick={handleSubscribe}>Subscribe</Button></div>
      {children}
    </>
  );
};

export default ClientWrapper;
