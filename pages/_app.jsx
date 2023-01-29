
import '../styles/global.css';
import React, { useState, useEffect, useRef } from 'react';

import useWindowDimensions from '../components/hooks/useWindowDimensions';
// import useScrollRestoration from '../components/hooks/useScrollRestoration';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import 'typeface-roboto';

import Header from "../components/generic/Header.jsx";
import FooterNavigation from "../components/generic/FooterNavigation.jsx";


const App = ({ Component, pageProps, router }) => {
  const defaultDark = true;
  const theme = (typeof window !== 'undefined' && localStorage.getItem('theme')) || (defaultDark ? 'dark' : 'light');

  const [state, setState] = useState();
  const scrollRef = useRef(null);

  const { height, width } = useWindowDimensions();

  const useTheme = createTheme({
    'palette': {
      'mode': theme,
    },
  });



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
          <Header theme = {theme} handleTheme = {switchTheme} />
          <div style = {{'padding': paddingTop + ' 0px 56px 0px'}}>
            <Component scrollRef = {scrollRef} {...pageProps} />
          </div>
          <FooterNavigation theme = {theme} handleTheme = {switchTheme} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;

