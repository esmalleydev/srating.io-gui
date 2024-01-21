'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTheme, styled } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import RankingIcon from '@mui/icons-material/EmojiEvents';
import ScoresIcon from '@mui/icons-material/Scoreboard';
import PicksIcon from '@mui/icons-material/Casino';
// import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
// import NewspaperIcon from '@mui/icons-material/Newspaper';
import BackdropLoader from './BackdropLoader';


const StyledBottomNavigationAction = styled(BottomNavigationAction)(({ theme }) => ({
  'color': theme.palette.mode === 'light' ? '#fff' : theme.palette.text.primary,
  '&.Mui-selected': {
    'color': theme.palette.mode === 'light' ? '#424CF5' : theme.palette.success.dark,
  },
}));

const FooterNavigation = (props) => {
  const self = this;

  const theme = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [spin, setSpin] = useState(false);

  let viewingSport = null;
  let viewingPage = 'home';
  const pathName = usePathname();


  // todo share this with header
  const sports = [
    'CBB',
    'CFB ... coming soon',
    'NBA ... coming soon',
    'NFL ... coming soon',
  ];

  const pages = [
    'home',
    'ranking',
    'games',
    'picks',
  ];

  if (pathName) {
    const splat = pathName.split('/');
    if (
      splat &&
      splat.length > 1 &&
      sports.indexOf(splat[1].toUpperCase()) > -1
    ) {
      let selectedIndex = sports.indexOf(splat[1].toUpperCase());
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

  // TODO click away from scores, clear all the game data slice


  const handleHome = () => {
    setSpin(true);
    startTransition(() => {
      router.push('/'+viewingSport.toLowerCase());
      setSpin(false);
    });
  }

  const handleRanking = () => {
    setSpin(true);
    startTransition(() => {
      router.push('/'+viewingSport.toLowerCase()+'/ranking');
      setSpin(false);
    });
  }

  const handleScores = () => {
    setSpin(true);
    sessionStorage.removeItem('CBB.GAMES.DATA');
    startTransition(() => {
      router.push('/'+viewingSport.toLowerCase()+'/games');
      setSpin(false);
    });
  }

  const handlePicks = () => {
    setSpin(true);
    startTransition(() => {
      router.push('/'+viewingSport.toLowerCase()+'/picks');
      setSpin(false);
    });
  }

  return (
    <div>
    {spin ? <BackdropLoader /> : ''}
    {viewingSport ? 
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, /*'zIndex': 9000,*/}} elevation={3}>
        <BottomNavigation style = {{'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light}} showLabels value={pages.indexOf(viewingPage)}>
          <StyledBottomNavigationAction color = 'secondary' onClick = {handleHome} label="Home" icon={<HomeIcon />} />
          <StyledBottomNavigationAction color = 'secondary' onClick = {handleRanking} label="Ranking" icon={<RankingIcon />} />
          <StyledBottomNavigationAction color = 'secondary' onClick = {handleScores} label="Scores" icon={<ScoresIcon />} />
          <StyledBottomNavigationAction color = 'secondary' onClick = {handlePicks} label="Picks" icon={<PicksIcon />} />
        </BottomNavigation>
      </Paper>
      : ''}
    </div>
  );
}

export default FooterNavigation;