import React, { useState } from 'react';
import { useRouter } from 'next/router';
// import { Link } from 'next/link';
import useWindowDimensions from '../hooks/useWindowDimensions';

import { useTheme } from '@mui/material/styles';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import StyledMenu from './StyledMenu';
import Drawer from '@mui/material/Drawer';

// Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GitHubIcon from '@mui/icons-material/GitHub';
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

  // let viewingSport = null;

  // const sports = [
  //   'CBB',
  //   'CFB ... coming soon?',
  //   'NBA ... coming soon?',
  //   'NFL ... coming soon?',
  // ];

  // let selectedIndex = null;

  // if (router && router.pathname) {
  //   const splat = router.pathname.split('/');
  //   if (
  //     splat &&
  //     splat.length > 1 &&
  //     sports.indexOf(splat[1].toUpperCase()) > -1
  //   ) {
  //     let selectedIndex = sports.indexOf(splat[1].toUpperCase());
  //     viewingSport = sports[selectedIndex];
  //   }
  // }

  // const [anchorElNav, setAnchorElNav] = React.useState(null);
  // const [anchorElUser, setAnchorElUser] = React.useState(null);

  // const handleOpenNavMenu = (event) => {
  //   setAnchorElNav(event.currentTarget);
  // };
  // const handleOpenUserMenu = (event) => {
  //   setAnchorElUser(event.currentTarget);
  // };

  // const handleCloseNavMenu = () => {
  //   setAnchorElNav(null);
  // };

  // const handleCloseUserMenu = () => {
  //   setAnchorElUser(null);
  // };

  const handleHome = () => {
    router.push('/');
  }

  // const [anchorEl, setAnchorEl] = useState(null);
  // const open = Boolean(anchorEl);

  // const handleSport = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleSportClose = () => {
  //   setAnchorEl(null);
  // };

  // const handleSportClick = (event, index) => {
  //   viewingSport = sports[index];
  //   handleSportClose();
  //   handleSportHome();
  // };

  // const handleSportHome = () => {
  //   router.push('/'+viewingSport.toLowerCase()+'/ranking');
  // }

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
                {/*<Button
                  id="sports-picker-button"
                  aria-controls={open ? 'sports-picker-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  variant="text"
                  style = {{'color': '#fff'}}
                  disableElevation
                  onClick={handleSport}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  {viewingSport ? viewingSport : 'Sport'}
                </Button>
                <StyledMenu
                  id="sports-picker-menu"
                  MenuListProps={{
                    'aria-labelledby': 'sports-picker-button',
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleSportClose}
                >
                 {sports.map((sport, index) => (
                  <MenuItem
                    key={sport}
                    disabled={index === selectedIndex || sport !== 'CBB'}
                    selected={index === selectedIndex}
                    onClick={(event) => handleSportClick(event, index)}
                  >
                    {sport}
                  </MenuItem>
                ))}
                </StyledMenu>*/}
              </Box>
              <Box sx={{ flexGrow: 0, 'marginRight': (width < 600 ? 0 : '5px') }}>
                {width < 600 ? <IconButton  onClick={() => {setFullSearch(true);}} color="inherit"><SearchIcon /></IconButton> : <Search />}
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <IconButton  onClick={() => {window.open('https://github.com/esmalleydev/srating.io-gui', '_blank');}} color="inherit">
                  <GitHubIcon />
                </IconButton>
                <IconButton  onClick={handleAccount} color="inherit">
                  <AccountCircle />
                </IconButton>
              </Box>
            </Toolbar>
        }
      </Container>
      <AccountHandler open = {accountOpen} closeHandler = {handleAccountClose} />
    </AppBar>
  );
}

export default Header;