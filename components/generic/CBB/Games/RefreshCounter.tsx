'use client';

import React from 'react';

import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';

import { useAppSelector } from '@/redux/hooks';
import { Box, Tooltip, Typography } from '@mui/material';

/**
 * Be very careful with any logic in this, it will be running a lot! On every interval tick
 */
const RefreshCounter = () => {
  const refreshCountdown = useAppSelector((state) => state.gamesReducer.refreshCountdown);
  const refreshRate = useAppSelector((state) => state.gamesReducer.refreshRate);
  const refreshLoading = useAppSelector((state) => state.gamesReducer.refreshLoading);
  const refreshEnabled = useAppSelector((state) => state.gamesReducer.refreshEnabled);

  if (!refreshEnabled) {
    return null;
  }

  const percentage = (1 - (refreshCountdown / refreshRate)) * 100;

  return (
    <Tooltip title = {'Refresh rate'}>
      <div style = {{ display: 'flex', padding: '0px 8px', position: 'relative' }}>
        {
        refreshLoading ?
          <CircularProgress size={20} color = 'success' /> :
          <>
            <CircularProgress variant = 'determinate' value = {percentage} size={20} />
            <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                  style = {{ fontSize: 11 }}
                >{Math.round(refreshCountdown)}</Typography>
              </Box>
          </>
        }
      </div>
    </Tooltip>
  );
};

export default RefreshCounter;
