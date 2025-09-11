'use client';

import CircularProgress from '@mui/material/CircularProgress';

import { useAppSelector } from '@/redux/hooks';
import Tooltip from '@/components/ux/hover/Tooltip';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';

/**
 * Be very careful with any logic in this, it will be running a lot! On every interval tick
 */
const RefreshCounter = () => {
  const theme = useTheme();
  const refreshCountdown = useAppSelector((state) => state.gamesReducer.refreshCountdown);
  const refreshRate = useAppSelector((state) => state.gamesReducer.refreshRate);
  const refreshLoading = useAppSelector((state) => state.gamesReducer.refreshLoading);
  const refreshEnabled = useAppSelector((state) => state.gamesReducer.refreshEnabled);

  if (!refreshEnabled) {
    return null;
  }

  const percentage = (1 - (refreshCountdown / refreshRate)) * 100;

  return (
    <Tooltip text = {'Refresh rate'}>
      <div style = {{ display: 'flex', padding: '0px 8px', position: 'relative' }}>
        {
        refreshLoading ?
          <CircularProgress size={20} color = 'success' /> :
          <>
            <CircularProgress variant = 'determinate' value = {percentage} size={20} />
            <div
                style={{
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
                  type="caption"
                  // component="div"
                  style = {{ fontSize: 11, color: theme.text.secondary }}
                >{Math.round(refreshCountdown)}</Typography>
            </div>
          </>
        }
      </div>
    </Tooltip>
  );
};

export default RefreshCounter;
