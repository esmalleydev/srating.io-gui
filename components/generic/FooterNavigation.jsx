'use client';

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTheme, styled } from '@mui/material/styles';

import useWindowDimensions from '../hooks/useWindowDimensions';

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
  const [spin, setSpin] = useState(false);

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
    'home',
    'ranking',
    'games',
    'picks',
  ];


  if (router && router.pathname) {
    const splat = router.pathname.split('/');
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

  const { height, width } = useWindowDimensions();

  const handleHome = () => {
    setSpin(true);
    router.push('/'+viewingSport.toLowerCase()+'/home').then(() => {
      setSpin(false);
    });
  }

  const handleRanking = () => {
    setSpin(true);
    router.push('/'+viewingSport.toLowerCase()+'/ranking').then(() => {
      setSpin(false);
    });
  }

  const handleScores = () => {
    setSpin(true);
    sessionStorage.removeItem('CBB.GAMES.DATA');
    router.push('/'+viewingSport.toLowerCase()+'/games').then(() => {
      setSpin(false);
    });
  }

  const handlePicks = () => {
    setSpin(true);
    router.push('/'+viewingSport.toLowerCase()+'/picks').then(() => {
      setSpin(false);
    });
  }

  /*
  const handleFavorites = () => {
    setSpin(true);
    router.push('/'+viewingSport.toLowerCase()+'/favorites').then(() => {
      setSpin(false);
    });
  }
  */

  // console.log(theme);

  const buttonColor = theme.palette.mode === 'light' ? '#F59242' : 'secondary';

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
          {/* <StyledBottomNavigationAction color = 'secondary' onClick = {handleFavorites} label="Favorites" icon={<FavoriteIcon />} /> */}
        </BottomNavigation>
      </Paper>
      : ''}
    </div>
  );
}

export default FooterNavigation;