import React, { useState, useEffect } from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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


const App = (props) => {

  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = localStorage.getItem('theme') || (defaultDark ? 'dark' : 'light');
  // const navigate = useNavigate();

  const [state, setState] = useState();

  const { height, width } = useWindowDimensions();

  const useTheme = createTheme({
    'palette': {
      'mode': theme,
    },
  });


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


  return (
    <ThemeProvider theme={useTheme}>
      <CssBaseline />
      <div style = {themeContainerStyle}>
        <BrowserRouter>
          <Header theme = {theme} handleTheme = {switchTheme} />
          <div style = {{'padding': paddingTop + ' 0px 56px 0px'}}>
            <Routes>
              {/*<Route path="/" element={<Home />} />*/}
              <Route path="/" element = {<Navigate to='/CBB/Ranking' />}/>
              <Route path="CBB" element={<CBB />}>
                <Route path="Ranking" element={<RankingCBB />} />
                <Route path="Games" element={<GamesCBB />} />
                <Route path="Games/:GameID" element={<GameCBB />} />
                <Route path="Team/:team_id" element={<TeamCBB />} />
                <Route path="Picks" element={<PicksCBB />} />
              </Route>
              {/*<Route path="CFB" element={<CFB />}>
                <Route path="Games" element={<Games />} />
                <Route path="Games/:GameID" element={<GameCFB />} />
              </Route>*/}
            </Routes>
          </div>
          <FooterNavigation theme = {theme} handleTheme = {switchTheme} />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
