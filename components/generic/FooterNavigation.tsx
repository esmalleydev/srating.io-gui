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
import { useAppDispatch } from '@/redux/hooks';
import { setScrollTop as setPicksScrollTop } from '@/redux/features/picks-slice';
import { setScrollTop as setGamesScrollTop } from '@/redux/features/games-slice';
import { setLoading } from '@/redux/features/display-slice';


const StyledBottomNavigationAction = styled(BottomNavigationAction)(({ theme }) => ({
  'color': theme.palette.mode === 'light' ? '#fff' : theme.palette.text.primary,
  '&.Mui-selected': {
    'color': theme.palette.mode === 'light' ? theme.palette.warning.light : theme.palette.success.dark,
  },
}));

export const footerNavigationHeight = 56;

const FooterNavigation = () => {
  const theme = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();

  let viewingSport = 'CBB';
  let viewingPage: string | null = null;
  const pathName = usePathname();

  // todo the /team page highlights home button, because there is no sport / viewing page
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
    } else if (
      splat &&
      splat.length === 2 &&
      splat[1] === ''
    ) {
      viewingPage = pages[pages.indexOf('home')];
    }
  }

  // TODO click away from scores, clear all the game data slice


  const handleHome = () => {
    dispatch(setLoading(true));
    startTransition(() => {
      // router.push('/'+viewingSport.toLowerCase());
      router.push('/');
    });
  }

  const handleRanking = () => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push('/'+viewingSport.toLowerCase()+'/ranking');
    });
  }

  const handleScores = () => {
    dispatch(setGamesScrollTop(0));
    dispatch(setLoading(true));
    sessionStorage.removeItem('CBB.GAMES.DATA');
    startTransition(() => {
      router.push('/'+viewingSport.toLowerCase()+'/games');
    });
  }

  const handlePicks = () => {
    dispatch(setPicksScrollTop(0));
    dispatch(setLoading(true));
    startTransition(() => {
      router.push('/'+viewingSport.toLowerCase()+'/picks');
    });
  }

  let hightlightValue = -1;

  if (viewingPage) {
    hightlightValue = pages.indexOf(viewingPage);
  }

  return (
    <div>
    {/* {viewingSport ?  */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 4}}>
        <BottomNavigation style = {{'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : '#1976d2'}} showLabels value={hightlightValue}>
          <StyledBottomNavigationAction color = 'secondary' onClick = {handleHome} label="Home" icon={<HomeIcon />} />
          <StyledBottomNavigationAction color = 'secondary' onClick = {handleRanking} label="Ranking" icon={<RankingIcon />} />
          <StyledBottomNavigationAction color = 'secondary' onClick = {handleScores} label="Scores" icon={<ScoresIcon />} />
          <StyledBottomNavigationAction color = 'secondary' onClick = {handlePicks} label="Picks" icon={<PicksIcon />} />
        </BottomNavigation>
      </Paper>
      {/* : ''} */}
    </div>
  );
}

export default FooterNavigation;