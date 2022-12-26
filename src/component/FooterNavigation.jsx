import React, { useState } from 'react';
import { useNavigate, useLocation  } from "react-router-dom";
import { useTheme } from '@mui/material/styles';

import useWindowDimensions from '../hooks/useWindowDimensions';

// import Box from '@mui/material/Box';
// import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import RankingIcon from '@mui/icons-material/EmojiEvents';
import ScoresIcon from '@mui/icons-material/Scoreboard';
import PicksIcon from '@mui/icons-material/Casino';

import { styled } from "@mui/material/styles";


const StyledBottomNavigationAction = styled(BottomNavigationAction)(({ theme }) => ({
  'color': theme.palette.mode === 'light' ? '#fff' : theme.palette.text.primary,
  '&.Mui-selected': {
    'color': theme.palette.mode === 'light' ? theme.palette.secondary.dark : theme.palette.success.dark,
  },
}));

const FooterNavigation = (props) => {
  const self = this;

  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  let viewingSport = null;
  let viewingPage = null;

  // todo share this with header
  const sports = [
    'CBB',
    'CFB ... coming soon',
    'NBA ... coming soon',
    'NFL ... coming soon',
  ];

  const pages = [
    'Ranking',
    'Games',
    'Picks'
  ];


  if (location && location.pathname) {
    const splat = location.pathname.split('/');
    if (
      splat &&
      splat.length > 1 &&
      sports.indexOf(splat[1]) > -1
    ) {
      let selectedIndex = sports.indexOf(splat[1]);
      viewingSport = sports[selectedIndex];
    }

    if (
      splat &&
      splat.length > 2 &&
      pages.indexOf(splat[2]) > -1
    ) {
      viewingPage = pages[pages.indexOf(splat[2])];
    }
  }

  const { height, width } = useWindowDimensions();


  const handleRanking = () => {
    navigate('/'+viewingSport+'/Ranking');
  }

  const handleScores = () => {
    sessionStorage.removeItem('CBB.GAMES.DATA');
    navigate('/'+viewingSport+'/Games');
  }

  const handlePicks = () => {
    navigate('/'+viewingSport+'/Picks');
  }


  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, 'zIndex': 9000,}} elevation={3}>
      <BottomNavigation style = {{'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light}} showLabels value={pages.indexOf(viewingPage)}>
        <StyledBottomNavigationAction color = 'secondary' onClick = {handleRanking} label="Ranking" icon={<RankingIcon />} />
        <StyledBottomNavigationAction color = 'secondary' onClick = {handleScores} label="Scores" icon={<ScoresIcon />} />
        <StyledBottomNavigationAction color = 'secondary' onClick = {handlePicks} label="Picks" icon={<PicksIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default FooterNavigation;