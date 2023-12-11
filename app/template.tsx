'use client';
import React, { useRef, useState, useEffect} from "react";
// import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import useWindowDimensions from '../components/hooks/useWindowDimensions';
import { useAppSelector } from '../redux/hooks';

import Header from "../components/generic/Header.jsx";
import FooterNavigation from "../components/generic/FooterNavigation.jsx";

// todo unintall memory-cache

const Template = ({ children }: { children: React.ReactNode }) => {
  const themeSlice = useAppSelector(state => state.themeReducer.value);

  const scrollRef = useRef(null);

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

  // resets scroll position between pages
  // todo if a page has custom scrolling, this will reset it
  // TODO THIS SHOULD SHOULD NOT BE NEEDED ANYMORE GO UPDATE THE GAMES ROUTER CHANGE TO NOT SCROLL
  // https://nextjs.org/docs/app/api-reference/functions/use-router#disabling-scroll-restoration
  // useEffect(() => {
  //   router.events.on('routeChangeComplete', () => {
  //     if (scrollRef.current) {
  //       scrollRef.current.scrollTop = 0
  //     }
  //   })
  // }, [router.events])


  let paddingTop = '64px';

  if (width < 600) {
    paddingTop = '56px';
  }

  let scrollerClasses = 'overlay_scroller';

  if (width < 750) {
    scrollerClasses += ' hide_scroll';
  }

  return (
    <ThemeProvider theme={themeSlice.theme}>
      <CssBaseline />
      {
      isMounted ?
      <div ref = {scrollRef} className = {scrollerClasses}>
        <div>
          <Header />
            <div style = {{'padding': paddingTop + ' 0px 56px 0px'}}>
              {children}
            </div>
          <FooterNavigation /*theme = {theme} handleTheme = {switchTheme}*/ />
        </div>
      </div>
      : ''
      }
    </ThemeProvider>
  );
};

export default Template;
