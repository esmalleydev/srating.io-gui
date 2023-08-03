import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// import { Link } from 'next/link';
import useWindowDimensions from '../hooks/useWindowDimensions';
// import useMediaQuery from '../hooks/useMediaQuery';

import { useTheme } from '@mui/material/styles';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Sidebar from './Sidebar';
import Search from './Search';
import AccountHandler from './AccountHandler';

import Api from './../Api.jsx';
const api = new Api();

const Header = (props) => {
  const self = this;

  const theme = useTheme();
  const router = useRouter();
  const { height, width } = useWindowDimensions();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [fullSearch, setFullSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);


  const handleHome = () => {
    router.push('/');
  }


  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };


  const handleAccount = () => {
    if (props.validSession) {
      router.push('/account');
      return;
    }
    setAccountOpen(true);
  };

  const handleAccountClose = () => {
    setAccountOpen(false);
  };



  let logoStyle = {
    // 'fontFamily': 'Consolas',
    'fontFamily': 'Courier New',
    'fontWeight': 600,
    'fontSize': '20px',
    'verticalAlign':'middle',
    'cursor': 'pointer',
  };

  if (props.theme === 'dark') {
    logoStyle.color = '#2ab92a';
  }

  return (
    <AppBar position="fixed">
      {isLoading ? <Container maxWidth="xl"><Toolbar disableGutters /></Container> : // This prevents flashing on mobile since mediaQuery / width is a hook, will not be useable for first load
      <div>
        <Container maxWidth="xl">
          {
            fullSearch ?
              <Toolbar disableGutters>
                <IconButton onClick = {() => {setFullSearch(false);}} size="large" edge="start" color="inherit" aria-label="menu">
                  <ArrowBackIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                  <Search onRouter = {() => {setFullSearch(false);}} focus = {true} />
                </Box>
              </Toolbar> :
              <Toolbar disableGutters>
                <IconButton onClick = {toggleDrawer} size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                  <MenuIcon />
                  <Drawer
                    open={drawerOpen}
                    onClose={toggleDrawer}
                  >
                    <Sidebar theme = {props.theme} handleTheme = {props.handleTheme} />
                  </Drawer>
                </IconButton>
                <Box sx = {{ display: 'flex', mr: 1 }} style = {logoStyle} onClick = {handleHome}>{(width < 450 ? '> SR' : '> sRating.io')}<sup style = {{'fontSize': '14px'}}>beta</sup></Box>
                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                </Box>
                <Box sx={{ flexGrow: 0, 'marginRight': (width < 600 ? 0 : '5px') }}>
                  {width < 600 ? <IconButton  onClick={() => {setFullSearch(true);}} color="inherit"><SearchIcon /></IconButton> : <Search />}
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                  <IconButton  onClick={handleAccount} color="inherit">
                    <AccountCircle />
                  </IconButton>
                </Box>
              </Toolbar>
          }
        </Container>
        <AccountHandler open = {accountOpen} closeHandler = {handleAccountClose} loginCallback = {props.loginCallback} />
      </div>
      }
    </AppBar>
  );
}

export default Header;