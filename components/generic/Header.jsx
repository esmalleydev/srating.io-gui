import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// import { Link } from 'next/link';
import useWindowDimensions from '../hooks/useWindowDimensions';
// import useMediaQuery from '../hooks/useMediaQuery';

import { styled, useTheme } from '@mui/material/styles';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import sratingLogo from '../../public/favicon-32x32.png';

import Sidebar from './Sidebar';
import Search from './Search';
import AccountHandler from './AccountHandler';

import Api from './../Api.jsx';
const api = new Api();



const LoginButton = styled(Button)(({ theme }) => ({
  'color': theme.palette.mode === 'light' ? '#fff' : theme.palette.success.main,
  'border': '1px solid ' + (theme.palette.mode === 'light' ? '#fff' : theme.palette.success.main),
  '&:hover': {
    'border': '1px solid ' + (theme.palette.mode === 'light' ? '#fff' : theme.palette.success.light),
    // backgroundColor: (theme.palette.mode === 'light' ? '#fff' : theme.palette.success.dark),
  },
}));

const Header = (props) => {
  const self = this;

  const theme = useTheme();
  const router = useRouter();
  const { height, width } = useWindowDimensions();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [fullSearch, setFullSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);

  const validSession = props.validSession;

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
    handleClose();
    if (validSession) {
      router.push('/account');
      return;
    }
    setAccountOpen(true);
  };

  const handleAccountClose = () => {
    setAccountOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem('session_id');
    sessionStorage.clear();
    router.push('/');
  };


  let logoStyle = {
    // 'fontFamily': 'Consolas',
    // 'fontFamily': 'Courier New',
    'fontWeight': 600,
    'fontSize': '20px',
    'fontStyle': 'italic',
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
                <Box sx = {{ display: 'flex', mr: 1, 'alignItems': 'center' }} style = {logoStyle} onClick = {handleHome}>
                  <img src={sratingLogo.src} width = '20' height = '20' style = {{'marginRight': 5}} />
                  {'SRATING'}
                </Box>
                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                </Box>
                <Box sx={{ flexGrow: 0, 'marginRight': (width < 600 ? 0 : '5px') }}>
                  {width < 600 ? <IconButton  onClick={() => {setFullSearch(true);}} color="inherit"><SearchIcon /></IconButton> : <Search />}
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                  {
                  validSession ? 
                    <div>
                      <IconButton  onClick={handleMenu} color="inherit">
                        <AccountCircle />
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={handleAccount}>My account</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </Menu>
                    </div>
                  :
                    <LoginButton variant = 'outlined' onClick={handleAccount}>Login</LoginButton>
                  }
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