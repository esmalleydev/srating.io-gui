'use client';

import { toaster, ToastItem } from '@/components/utils/Toaster';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Paper from '../container/Paper';
import Typography from '../text/Typography';
import Style from '@/components/utils/Style';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '../buttons/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTheme } from '@/components/hooks/useTheme';
import Objector from '@/components/utils/Objector';


const Toast = () => {
  const theme = useTheme();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    // Subscribe to state changes in the manager
    const unsubscribe = toaster.subscribe((updatedToasts) => {
      setToasts([...updatedToasts]); // Create a new reference to trigger re-render
    });
    return unsubscribe;
  }, []);

  // If no toasts, render nothing
  if (toasts.length === 0) return null;

  const containerStyle = {
    position: 'fixed',
    bottom: 64,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: Style.getZIndex().toast,
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'center',
    gap: '14px',
    pointerEvents: 'none',
  };

  const toastStyle = {
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    minWidth: '300px',
    maxWidth: '320px',
    padding: '12px',
    animation: 'toastSlideUp 0.4s cubic-bezier(0, 0, 0.2, 1) forwards',
    '@keyframes toastSlideUp': {
      '0%': {
        transform: 'translateY(100%)',
        opacity: 0,
      },
      '100%': {
        transform: 'translateY(0)',
        opacity: 1,
      },
    },
  };

  const toastContainerStyle: React.CSSProperties = {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const lineStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
  };

  // Use React Portal to render strictly into document.body
  return ReactDOM.createPortal(
    <div className = {Style.getStyleClassName(containerStyle)}>
      {toasts.map((t, index) => {
        const tStyle = Objector.deepClone(toastStyle);
        let iconColor = theme.info.main;
        const iconStyle = { color: iconColor, marginRight: 8, fontSize: 20 };
        let textColor = theme.text.secondary;

        let icon = <InfoIcon style = {iconStyle} />;

        if (t.type === 'success') {
          iconStyle.color = '#fff';
          Objector.extender(tStyle, { color: '#fff', backgroundColor: theme.success[theme.mode] });
          iconColor = '#fff';
          textColor = '#fff';
          icon = <CheckCircleOutlineIcon style = {iconStyle} />;
        }

        if (t.type === 'error') {
          iconStyle.color = '#fff';
          Objector.extender(tStyle, { color: '#fff', backgroundColor: theme.error[theme.mode] });
          iconColor = '#fff';
          textColor = '#fff';
          icon = <WarningIcon style = {iconStyle} />;
        }

        return (
          <Paper key = {`toast-${index}`} style = {tStyle} elevation={4}>
            <div className = {Style.getStyleClassName(toastContainerStyle)}>
              <div className = {Style.getStyleClassName(lineStyle)}>
                {icon}
                <Typography style = {{ color: textColor, lineHeight: 'initial' }} type = 'caption'>{t.message}</Typography>
              </div>
              <IconButton buttonStyle={{ color: iconColor }} icon = {<CloseIcon />} value = 'close' onClick={() => toaster.remove(t.id)} />
            </div>
          </Paper>
        );
      })}
    </div>,
    document.body,
  );
};

export default Toast;
