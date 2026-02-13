'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';
import { useAppSelector } from '@/redux/hooks';

import Header from '@/components/generic/Header';
import FooterNavigation from '@/components/generic/FooterNavigation';
import { ScrollContainer, ScrollProvider } from '@/contexts/scrollContext';
import Spinner from '@/components/generic/Spinner';
import Toast from '@/components/ux/overlay/Toast';
import { socket } from '@/components/utils/Kontororu/Socket';
import { toast } from '@/components/utils/Toaster';


const Template = ({ children }: { children: React.ReactNode }) => {
  const themeMode = useAppSelector((state) => state.themeReducer.mode);
  const session_id = useAppSelector((state) => state.userReducer.session_id);
  const pendingDisconnectRef = useRef<NodeJS.Timeout | null>(null);

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
        if (pendingDisconnectRef.current) {
          // If a disconnect was queued, this is a RECONNECTION
          clearTimeout(pendingDisconnectRef.current);
          pendingDisconnectRef.current = null;
          toast.success('Reconnected');
        } else {
          // If nothing was queued, it's just a fresh initial connection
          toast.success('Connected');
        }
      }

      if (status === 'disconnected') {
        // Clear any existing timers to avoid double-processing
        if (pendingDisconnectRef.current) {
          clearTimeout(pendingDisconnectRef.current);
        }

        // Buffer the error toast to see if a 'connected' event follows
        pendingDisconnectRef.current = setTimeout(() => {
          toast.error('Lost connection');
          pendingDisconnectRef.current = null;
        }, 1000); // 1 second buffer is usually safe for tab-switching
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
      if (pendingDisconnectRef.current) {
        clearTimeout(pendingDisconnectRef.current);
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
