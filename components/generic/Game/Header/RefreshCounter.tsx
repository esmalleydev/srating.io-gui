'use client';

import CircularProgress from '@mui/material/CircularProgress';

import { useAppSelector } from '@/redux/hooks';
import { Box, Tooltip } from '@mui/material';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';

/**
 * Be very careful with any logic in this, it will be running a lot! On every interval tick
 */
const RefreshCounter = ({ game }) => {
  const refreshCountdown = useAppSelector((state) => state.gameReducer.refreshCountdown);
  const refreshRate = useAppSelector((state) => state.gameReducer.refreshRate);
  const refreshLoading = useAppSelector((state) => state.gameReducer.refreshLoading);
  const refreshEnabled = useAppSelector((state) => state.gameReducer.refreshEnabled);
  const theme = useTheme();

  if (!refreshEnabled || game.status === 'final') {
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
                <Typography type='caption' style={{ color: theme.text.secondary, fontSize: 11 }}>{Math.round(refreshCountdown)}</Typography>
            </Box>
          </>
        }
      </div>
    </Tooltip>
  );
};

export default RefreshCounter;
