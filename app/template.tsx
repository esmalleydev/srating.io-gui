'use client';
import React, { useRef, useState, useEffect, RefObject} from "react";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import useWindowDimensions from '@/components/hooks/useWindowDimensions';
import { useAppSelector } from '@/redux/hooks';

import Header from "@/components/generic/Header.jsx";
import FooterNavigation from "@/components/generic/FooterNavigation.jsx";
import { ScrollContainer, ScrollProvider } from "@/contexts/scrollContext";


const Template = ({ children }: { children: React.ReactNode }) => {
  const themeSlice = useAppSelector(state => state.themeReducer.value);

  interface Dimensions {
    width: number;
    height: number;
  };
  const { width } = useWindowDimensions() as Dimensions;

  /**
   * TODO this fixes some hydration issues...but shouldnt be needed...
   * I think this causes flashing too
   */
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  let paddingTop = '64px';

  if (width < 600) {
    paddingTop = '56px';
  }

  return (
    <ThemeProvider theme={themeSlice.theme}>
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
