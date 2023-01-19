import React, { useState, useEffect, useRef } from 'react';

// import { BrowserRouter, Routes, Route, Navigate, ScrollRestoration } from 'react-router-dom';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Navigate, ScrollRestoration, Outlet } from 'react-router-dom';



import useWindowDimensions from './hooks/useWindowDimensions';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import 'typeface-roboto';

import Header from "./component/Header.jsx";
import FooterNavigation from "./component/FooterNavigation.jsx";
import Home from "./Home.jsx";

import CBB from "./sports/CBB.jsx";
import GamesCBB from "./sports/CBB/Games.jsx";
import GameCBB from "./sports/CBB/Game.jsx";
import TeamCBB from "./sports/CBB/Team.jsx";
import RankingCBB from "./sports/CBB/Ranking.jsx";
import PicksCBB from "./sports/CBB/Picks.jsx";

// todo on first load it sends the request twice? ex /CBB/Ranking then refresh in browser, sends 2 requests, but if I click on ranking button, only 1 request, same with other pages

const App = (props) => {

  // const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultDark = true;
  const theme = localStorage.getItem('theme') || (defaultDark ? 'dark' : 'light');
  // const navigate = useNavigate();

  const [state, setState] = useState();
  const scrollRef = useRef(null);

  const { height, width } = useWindowDimensions();

  const useTheme = createTheme({
    'palette': {
      'mode': theme,
    },
  });

  /*
  const [scrollValue, setScrollValue] = useState(0);

  useEffect(() => {

    const onScroll = (e) => {
      setScrollValue(e.target.documentElement.scrollTop);
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollValue]);
   */


  const switchTheme = () => {
    const newTheme = (theme == 'light' ? 'dark' : 'light');
    localStorage.setItem('theme', newTheme);
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

  // https://github.com/remix-run/react-router/discussions/9495
  // maybe that will get pushed at some point and make scroll restoration useful :)
  // tldr: scroll rest only saves window scroll position, my window doesnt scroll

  const router = createBrowserRouter([
    {
      'element':  <div><Header theme = {theme} handleTheme = {switchTheme} /><div style = {{'padding': paddingTop + ' 0px 56px 0px'}}><Outlet /></div><FooterNavigation theme = {theme} handleTheme = {switchTheme} /><ScrollRestoration /></div>,
      'children': [
        {
          'path': '/',
          'element': <Home />,
        },
        {
          'path': 'CBB',
          'element': <CBB />,
          'children': [
            {
              'path': 'Ranking',
              'element': <RankingCBB />,
            },
            {
              'path': 'Games',
              'element': <GamesCBB scrollRef = {scrollRef} />,
            },
            {
              'path': 'Games/:GameID',
              'element': <GameCBB scrollRef = {scrollRef} />,
            },
            {
              'path': 'Team/:team_id',
              'element': <TeamCBB scrollRef = {scrollRef} />,
            },
            {
              'path': 'Picks',
              'element': <PicksCBB />,
            },
          ],
        },
      ],
    },
  ]);

      /*
        <BrowserRouter>
          <Header theme = {theme} handleTheme = {switchTheme} />
          <div style = {{'padding': paddingTop + ' 0px 56px 0px'}}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="CBB" element={<CBB />}>
                <Route path="Ranking" element={<RankingCBB />} />
                <Route path="Games" element={<GamesCBB scrollRef = {scrollRef} />} />
                <Route path="Games/:GameID" element={<GameCBB />} />
                <Route path="Team/:team_id" element={<TeamCBB scrollRef = {scrollRef} />} />
                <Route path="Picks" element={<PicksCBB />} />
              </Route>
            </Routes>
          </div>
          <FooterNavigation theme = {theme} handleTheme = {switchTheme} />
          <ScrollRestoration />
        </BrowserRouter>
        */


  return (
    <ThemeProvider theme={useTheme}>
      <CssBaseline />
      <div ref = {scrollRef} style = {themeContainerStyle}>
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}

export default App;
