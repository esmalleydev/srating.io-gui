import React, { useState } from 'react';
import { useNavigate, useLocation  } from "react-router-dom";
import useWindowDimensions from '../hooks/useWindowDimensions';

import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/ModeNight';
import LightModeIcon from '@mui/icons-material/LightMode';

import Switch from '@mui/material/Switch';


import Button from '@mui/material/Button';
import StyledMenu from './StyledMenu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


import RankingIcon from '@mui/icons-material/EmojiEvents';
import ScoresIcon from '@mui/icons-material/Scoreboard';
import PicksIcon from '@mui/icons-material/Casino';


const Header = (props) => {
  const self = this;

  const navigate = useNavigate();

  let location = useLocation();

  let viewingSport = null;

  const sports = [
    'CBB',
    'CFB ... coming soon',
    'NBA ... coming soon',
    'NFL ... coming soon',
  ];

  let selectedIndex = null;

  if (location && location.pathname) {
    const splat = location.pathname.split('/');
    if (
      splat &&
      splat.length > 1 &&
      sports.indexOf(splat[1]) > -1
    ) {
      selectedIndex = sports.indexOf(splat[1]);
      viewingSport = sports[selectedIndex];
    }
  }

  const { height, width } = useWindowDimensions();


  function handleClick() {
    window.location.href = "/";
  }

  // const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  //   width: 62,
  //   height: 34,
  //   padding: 7,
  //   '& .MuiSwitch-switchBase': {
  //     margin: 1,
  //     padding: 0,
  //     transform: 'translateX(6px)',
  //     '&.Mui-checked': {
  //       color: '#fff',
  //       transform: 'translateX(22px)',
  //       '& .MuiSwitch-thumb:before': {
  //         backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
  //           '#fff',
  //         )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
  //       },
  //       '& + .MuiSwitch-track': {
  //         opacity: 1,
  //         backgroundColor: props.theme === 'dark' ? '#8796A5' : '#aab4be',
  //       },
  //     },
  //   },
  //   '& .MuiSwitch-thumb': {
  //     backgroundColor: props.theme === 'dark' ? '#003892' : '#001e3c',
  //     width: 32,
  //     height: 32,
  //     '&:before': {
  //       content: "''",
  //       position: 'absolute',
  //       width: '100%',
  //       height: '100%',
  //       left: 0,
  //       top: 0,
  //       backgroundRepeat: 'no-repeat',
  //       backgroundPosition: 'center',
  //       backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
  //         '#fff',
  //       )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
  //     },
  //   },
  //   '& .MuiSwitch-track': {
  //     opacity: 1,
  //     backgroundColor: props.theme === 'dark' ? '#8796A5' : '#aab4be',
  //     borderRadius: 20 / 2,
  //   },
  // }));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSport = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSportClose = () => {
    setAnchorEl(null);
  };

  const handleSportClick = (event, index) => {
    viewingSport = sports[index];
    handleSportClose();
    handleSportHome();
  };

  function handleSportHome() {
    navigate('/'+viewingSport+'/Ranking');
  }
  
  function handleRanking() {
    navigate('/'+viewingSport+'/Ranking');
  }

  function handleScores() {
    navigate('/'+viewingSport+'/Games');
  }

  function handlePicks() {
    navigate('/'+viewingSport+'/Picks');
  }


  const buttonStyle = {
    'textTransform': 'initial',
  };

  let buttonContainers = [];
  if (viewingSport) {
    buttonContainers.push(<Button key='ranks' variant="text" style={buttonStyle} onClick={handleRanking} startIcon={<RankingIcon />}>Ranking</Button>);
    buttonContainers.push(<Button key='scores' variant="text" style={buttonStyle} onClick={handleScores} startIcon={<ScoresIcon />}>Scores</Button>);
    buttonContainers.push(<Button key='picks' variant="text" style={buttonStyle} onClick={handlePicks} startIcon={<PicksIcon />}>Picks</Button>);
  }

   const style = {
    // 'backgroundColor': 'orange',
    'height': '50px',
    'padding': '0px 10px',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'space-between',
    'borderBottom': '1px solid'
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

  const subFlexStyle = {
    'display': 'flex',
  };


  return (
    <div style = {style}>
      <div style = {subFlexStyle}>
        {width > 645 ? <div style = {logoStyle} onClick = {handleClick}>> sportsdata.fyi<sup style = {{'fontSize': '14px'}}>beta</sup></div> : ''}
        <div style = {{'marginLeft': '10px'}}>
         <Button
            id="sports-picker-button"
            aria-controls={open ? 'sports-picker-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="text"
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
          </StyledMenu>
          {buttonContainers}
        </div>
      </div>
      {width > 415 ? <IconButton  onClick={props.handleTheme} color="inherit">
        {props.theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton> : ''}
      {/*<MaterialUISwitch sx={{ m: 1 }} checked={(props.theme === 'light')} onChange = {props.handleTheme} />*/}
    </div>
  );
}

export default Header;