'use client';
import BackdropLoader from '@/components/generic/BackdropLoader';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';

const ClientWrapper = ({ children }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [spin, setSpin] = useState(false);

  const handleSubscribe = () => {
    setSpin(true);
    startTransition(() => {
      router.push('/pricing');
      setSpin(false);
    });
  };

  return (
    <>
      <Typography style = {{'padding': '0px 5px', 'textAlign': 'center'}} color = 'text.secondary' variant='body1'>Below is a break down of my win prediction percentage, and the actual percentage that were correct. You can view the data by date range, the whole season, by day, week or month.</Typography>
      <div style = {{'textAlign': 'center'}}><Button variant='contained' color='warning' onClick={handleSubscribe}>Subscribe</Button></div>
      {children}
      <BackdropLoader open = {spin} />
    </>
  );
};

export default ClientWrapper;