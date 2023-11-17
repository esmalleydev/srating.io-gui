
import '../styles/global.css';
import React, { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/router';

import Script from 'next/script'

import useWindowDimensions from '../components/hooks/useWindowDimensions';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import 'typeface-roboto';

import Header from "../components/generic/Header.jsx";
import FooterNavigation from "../components/generic/FooterNavigation.jsx";

import Api from '../components/Api.jsx';
const api = new Api();

const App = ({ Component, pageProps, router }) => {
  // const router = useRouter();
  const defaultDark = true;
  const theme = (typeof window !== 'undefined' && localStorage.getItem('theme')) || (defaultDark ? 'dark' : 'light');

  const [state, setState] = useState();
  const scrollRef = useRef(null);

  const { height, width } = useWindowDimensions();

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

  const [isMounted, setIsMounted] = useState(false);
  const [useTheme, setUseTheme] = useState(theme === 'light' ? lightTheme : darkTheme);

  useEffect(() => {
    setIsMounted(true);
    setUseTheme(theme === 'light' ? lightTheme : darkTheme);
  }, []);

  // resets scroll position between pages
  // todo if a page has custom scrolling, this will reset it
  useEffect(() => {
    router.events.on('routeChangeComplete', () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0
      }
    })
  }, [router.events])


  let session_id = (typeof window !== 'undefined' && localStorage.getItem('session_id')) || null;

  const [validSession, setValidSession] = useState(false);
  const [requestedSession, setRequestedSession] = useState(false);


  if (validSession === true && !session_id) {
    setValidSession(false);
  }

  if (!requestedSession && session_id) {
    setRequestedSession(true);
    api.Request({
      'class': 'session',
      'function': 'check',
      'arguments': {
        'session_id': session_id
      },
    }).then((valid) => {
      if (valid) {
        setValidSession(true);
      } else {
        localStorage.removeItem('session_id');
      }
    }).catch((e) => {
    });
  }

  const loginCallback = () => {
    sessionStorage.clear();
    setValidSession(true);
  };


  const switchTheme = () => {
    const newTheme = (theme == 'light' ? 'dark' : 'light');
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }

    setState({'theme': newTheme});
    setUseTheme(newTheme === 'light' ? lightTheme : darkTheme);
  }

  const themeContainerStyle = {
    'height': '100%',
    // 'overflowY': 'overlay',
  };

  let paddingTop = '64px';

  if (width < 600) {
    paddingTop = '56px';
  }


  return (
    <ThemeProvider theme={useTheme}>
      <CssBaseline />
      {
      isMounted ? 
        <div ref = {scrollRef} className = 'overlay_scroller'>
          <div>
            <Header theme = {theme} handleTheme = {switchTheme} validSession = {validSession} loginCallback = {loginCallback} />
            <div style = {{'padding': paddingTop + ' 0px 56px 0px'}}>
              <Component scrollRef = {scrollRef} {...pageProps} />
            </div>
            <FooterNavigation theme = {theme} handleTheme = {switchTheme} />
          </div>
        </div>
      : ''
      }
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-S67JFT2KZW" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-S67JFT2KZW');
        `}
      </Script>
    </ThemeProvider>
  );
}

export default App;

