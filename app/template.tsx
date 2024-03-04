'use client';
import React, { useState, useEffect} from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';
import { useAppSelector } from '@/redux/hooks';

import Header from "@/components/generic/Header";
import FooterNavigation from "@/components/generic/FooterNavigation";
import { ScrollContainer, ScrollProvider } from "@/contexts/scrollContext";


const Template = ({ children }: { children: React.ReactNode }) => {
  const themeMode = useAppSelector(state => state.themeReducer.mode);

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

  const darkTheme = createTheme({
    'palette': {
      'mode': 'dark',
    },
  });
  
  const lightTheme = createTheme({
    'palette': {
      'mode': 'light',
      'background': {
        'default': "#efefef"
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
            <Header />
              <div style = {{'padding': paddingTop + ' 0px 56px 0px'}}>
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
