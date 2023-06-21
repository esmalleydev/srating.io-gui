
import '../styles/global.css';
import React, { useState, useEffect, useRef } from 'react';

import Script from 'next/script'
import Cookies from 'universal-cookie';

import useWindowDimensions from '../components/hooks/useWindowDimensions';
// import useScrollRestoration from '../components/hooks/useScrollRestoration';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import 'typeface-roboto';

import Header from "../components/generic/Header.jsx";
import FooterNavigation from "../components/generic/FooterNavigation.jsx";

import Api from '../components/Api.jsx';
const api = new Api();

const App = ({ Component, pageProps, router }) => {
  const defaultDark = true;
  const theme = (typeof window !== 'undefined' && localStorage.getItem('theme')) || (defaultDark ? 'dark' : 'light');
  const cookies = new Cookies();

  const [state, setState] = useState();
  const scrollRef = useRef(null);

  const { height, width } = useWindowDimensions();

  const useTheme = createTheme({
    'palette': {
      'mode': theme,
    },
  });

  let session_id = cookies.get('session_id');

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
        cookies.remove('session_id');
      }
    }).catch((e) => {
    });
  }



  const switchTheme = () => {
    const newTheme = (theme == 'light' ? 'dark' : 'light');
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    setState({'theme': newTheme});
  }

  const themeContainerStyle = {
    'height': '100%',
    'overflowY': 'overlay',
  };

  let paddingTop = '64px';

  if (width < 600) {
    paddingTop = '56px';
  }


  // useScrollRestoration(router, (scrollRef && scrollRef.current) || window);
  return (
    <ThemeProvider theme={useTheme}>
      <CssBaseline />
      <div ref = {scrollRef} style = {themeContainerStyle}>
        <div>
          <Header theme = {theme} handleTheme = {switchTheme} validSession = {validSession} />
          <div style = {{'padding': paddingTop + ' 0px 56px 0px'}}>
            <Component scrollRef = {scrollRef} {...pageProps} />
          </div>
          <FooterNavigation theme = {theme} handleTheme = {switchTheme} />
        </div>
      </div>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-3TLQ1QEXSE" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-3TLQ1QEXSE');
        `}
      </Script>
    </ThemeProvider>
  );
}

export default App;

