'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import Header from '@/components/generic/Header';
import FooterNavigation from '@/components/generic/FooterNavigation';
import { ScrollContainer, ScrollProvider } from '@/contexts/scrollContext';
import Spinner from '@/components/generic/Spinner';
import Toast from '@/components/ux/overlay/Toast';
import { socket } from '@/components/utils/Kontororu/Socket';
import { toast } from '@/components/utils/Toaster';
import { setDataKey } from '@/redux/features/general-slice';


const Template = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.themeReducer.mode);
  const session_id = useAppSelector((state) => state.userReducer.session_id);
  const pendingStatusRef = useRef<NodeJS.Timeout | null>(null);
  const pendingMSWait = 1100;

  const windowDimensions = useWindowDimensions() as Dimensions;
  const { width } = windowDimensions || {};

  /**
   * TODO this fixes some hydration issues...but shouldnt be needed...
   * I think this causes flashing too
   */
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  useEffect(() => {
    const connectionHanlder = (event: CustomEvent) => {
      const status = event?.detail;

      if (status === 'connected') {
        dispatch(setDataKey({ key: 'online', value: true }));
        if (pendingStatusRef.current) {
          // If a disconnect was queued, this is a RECONNECTION
          clearTimeout(pendingStatusRef.current);
          pendingStatusRef.current = null;

          pendingStatusRef.current = setTimeout(() => {
            toast.success('Reconnected');
            pendingStatusRef.current = null;
          }, pendingMSWait);
        } else {
          pendingStatusRef.current = setTimeout(() => {
            toast.success('Connected');
            pendingStatusRef.current = null;
          }, pendingMSWait);
        }
      }

      if (status === 'disconnected') {
        dispatch(setDataKey({ key: 'online', value: false }));
        // Clear any existing timers to avoid double-processing
        if (pendingStatusRef.current) {
          clearTimeout(pendingStatusRef.current);
        }

        // Buffer the error toast to see if a 'connected' event follows
        pendingStatusRef.current = setTimeout(() => {
          toast.error('Lost connection');
          pendingStatusRef.current = null;
        }, pendingMSWait);
      }

      // 3. Stale logic (usually immediate)
      if (status === 'stale') {
        toast.info('Stale connection');
      }
    };

    if (session_id) {
      socket.connect(session_id);

      socket.addEventListener('connection_state', connectionHanlder);
    }

    return () => {
      socket.removeEventListener('connection_state', connectionHanlder);
      if (pendingStatusRef.current) {
        clearTimeout(pendingStatusRef.current);
      }
    };
  }, [session_id]);

  // todo deprecate once mui is completely removed
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#efefef',
      },
    },
  });


  let paddingTop = '64px';

  if (width < 600) {
    paddingTop = '56px';
  }

  return (
    <ThemeProvider theme={themeMode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      {
      isMounted ?
        <ScrollProvider>
          <ScrollContainer>
            <div>
              <Toast />
              <Spinner />
              <Header />
                <div style = {{ padding: `${paddingTop} 0px 56px 0px` }}>
                  {children}
                </div>
              <FooterNavigation />
            </div>
          </ScrollContainer>
        </ScrollProvider>
        : ''
      }
    </ThemeProvider>
  );
};

export default Template;
