'use client';

import CircularProgress from '@mui/material/CircularProgress';
import WifiOffIcon from '@mui/icons-material/WifiOff';

import { useAppSelector } from '@/redux/hooks';
import Tooltip from '@/components/ux/hover/Tooltip';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';

/**
 * Be very careful with any logic in this, it will be running a lot! On every interval tick
 */
const RefreshCounter = () => {
  const theme = useTheme();
  const online = useAppSelector((state) => state.generalReducer.online);
  const refreshCountdown = useAppSelector((state) => state.gamesReducer.refreshCountdown);
  const refreshRate = useAppSelector((state) => state.gamesReducer.refreshRate);
  const refreshLoading = useAppSelector((state) => state.gamesReducer.refreshLoading);
  const refreshEnabled = useAppSelector((state) => state.gamesReducer.refreshEnabled);

  if (!refreshEnabled) {
    return null;
  }

  const percentage = (1 - (refreshCountdown / refreshRate)) * 100;

  const getContents = () => {
    if (!online) {
      return <WifiOffIcon style = {{ fontSize: 20, color: theme.error.main }} />;
    }

    if (refreshLoading) {
      return <CircularProgress size={20} color = 'success' />;
    }

    return (
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
    );
  };

  return (
    <Tooltip text = {'Refresh rate'}>
      <div style = {{ display: 'flex', padding: '0px 8px', position: 'relative' }}>
        {getContents()}
      </div>
    </Tooltip>
  );
};

export default RefreshCounter;
