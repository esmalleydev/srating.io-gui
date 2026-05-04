'use client';

import { useState, useEffect } from 'react';
import Typography from '@/components/ux/text/Typography';
import CircularProgress from '@/components/ux/loading/CircularProgress';
import LinearProgress from '@/components/ux/loading/LinearProgress';
import Backdrop from '@/components/ux/loading/Backdrop';
import Skeleton from '@/components/ux/loading/Skeleton';
import Button from '@/components/ux/buttons/Button';

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [backdropOpen, setBackdropOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) return 0;
        return Math.min(oldProgress + 10, 100);
      });
    }, 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let timeout: null | NodeJS.Timeout = null;
    if (backdropOpen) {
      timeout = setTimeout(() => setBackdropOpen(false), 3000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }, [backdropOpen]);

  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Loading</Typography>
      <Typography type='h6' style={{ marginBottom: 10 }}>Circle indeterminate</Typography>
      <CircularProgress />

      <Typography type='h6' style={{ marginBottom: 10, marginTop: 20 }}>Circle determinate</Typography>
      <CircularProgress type='determinate' value={progress} />

      <Typography type='h6' style={{ marginBottom: 10, marginTop: 20 }}>Linear indeterminate</Typography>
      <LinearProgress />

      <Typography type='h6' style={{ marginBottom: 10, marginTop: 20 }}>Linear determinate</Typography>
      <LinearProgress type='determinate' value={progress} />

      <Typography type='h6' style={{ marginBottom: 10, marginTop: 20 }}>Backdrop</Typography>
      <Backdrop open={backdropOpen}><CircularProgress /></Backdrop>
      <Button value='back-drop' title='Show Backdrop' handleClick={() => setBackdropOpen(true)} />

      <Typography type='h6' style={{ marginBottom: 10, marginTop: 20 }}>Skeleton</Typography>
      <Skeleton type='text' animation='wave' style={{ width: 100, height: 25, marginBottom: 10 }} />
      <Skeleton type='text' animation='pulse' style={{ width: 100, height: 25, marginBottom: 10 }} />
      <Skeleton type='circular' animation='wave' style={{ width: 50, height: 50, marginBottom: 10 }} />
      <Skeleton type='circular' animation='pulse' style={{ width: 50, height: 50 }} />
    </div>
  );
}
