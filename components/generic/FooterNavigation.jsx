import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';

import useWindowDimensions from '../hooks/useWindowDimensions';

import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

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
    'Ranking',
    'Games',
    'Picks'
  ];


  if (router && router.pathname) {
    const splat = router.pathname.split('/');
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
    setSpin(true);
    router.push('/'+viewingSport+'/Ranking').then(() => {
      setSpin(false);
    });
  }

  const handleScores = () => {
    setSpin(true);
    sessionStorage.removeItem('CBB.GAMES.DATA');
    router.push('/'+viewingSport+'/Games').then(() => {
      setSpin(false);
    });
  }

  const handlePicks = () => {
    setSpin(true);
    router.push('/'+viewingSport+'/Picks').then(() => {
      setSpin(false);
    });
  }



  return (
    <div>
    {spin ?
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
      : ''}
    {viewingSport ? 
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, 'zIndex': 9000,}} elevation={3}>
        <BottomNavigation style = {{'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light}} showLabels value={pages.indexOf(viewingPage)}>
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